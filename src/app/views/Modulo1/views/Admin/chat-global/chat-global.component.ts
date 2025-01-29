import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';


import { ChatStructureComponent } from '../../../components/chat-structure/chat-structure.component';
import { CommonModule, NgFor } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from 'src/app/core/services/group.service';
import { OrderService } from 'src/app/core/services/order.service';
import { SocketService } from 'src/app/core/services/socket.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { NewMessage } from 'src/app/interfaces/chat.interface';
import { Group } from 'src/app/interfaces/group.interface';
import { OrderUser } from 'src/app/interfaces/orden.interface';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'src/app/core/services/message.service';
import { Subscription } from 'rxjs';


interface Mensaje {
  remitente: string;
  mensaje: string;
  estado: string;
  tiempo: string;
}

@Component({
  selector: 'app-chat-global',
  standalone: true,
  imports: [DialogModule, TabViewModule, ChatStructureComponent, NgFor, CommonModule, FormsModule],

  templateUrl: './chat-global.component.html',
  styleUrl: './chat-global.component.scss'
})
export class ChatGlobalComponent implements OnInit, OnDestroy {
  messages: NewMessage[] = [];
  visible: boolean = false;
  id: number | null;
  newMessage: string = '';

  clientsByEmployeStartTrue: OrderUser[] = [];
  clientsByEmployeStartFalse: OrderUser[] = [];
  currentOrder: OrderUser | undefined;
  currentGroup: Group | undefined;
  employeeName: string = 'Nombre del empleado';
  clientName: string = 'Nombre del cliente';

  nameCliente: string = 'Cliente#123';
  nameOrder: string = 'Nombre de la orden';

  private employeeToClientMessageReceived: Subscription | undefined;


  constructor(
    private socketService: SocketService,
    private usuarioService: UsuarioService,
    private orderService: OrderService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private groupService: GroupService
  ) {}


  ngOnDestroy(): void {
    if (this.currentGroup) {
      this.socketService.leaveRoom(this.currentGroup.group_id);
      this.currentGroup = undefined;
    }

    if (this.employeeToClientMessageReceived) {
      this.employeeToClientMessageReceived.unsubscribe();
    }
  }

  showDialog() {
    this.visible = true;
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    console.log(this.id);
    if (this.id) {
      this.socketService.joinRoom(this.id, 'globalChat');
    }
    this.employeeToClientMessageReceived = this.socketService.employeeToClientMessageReceived.subscribe((message: NewMessage) => {
      message.sender =
        message.sender_id === this.usuarioService.uid ? 'me' : 'others';
      this.messages.push(message);
    });
    this.getOrdersForAdmin();
  }

  sendMessage(): void {
    const usuario = this.usuarioService.usuario;
    if (this.newMessage.trim() !== '') {
      const newMessage: NewMessage = {
        group_id: this.currentGroup?.group_id || 0,
        image_url: usuario.imagenUrl,
        message_text: this.newMessage,
        name: usuario.user_nicename,
        role_user: usuario.role,
        sender_id: usuario.id,
        sender: 'me',
        created_at: new Date().toISOString(),
      };
      this.messages.push(newMessage);
      if (this.currentOrder?.order_item_id) {
        this.socketService.sendMessageFromEmployeeToClient(
          this.currentOrder.order_item_id,
          newMessage
        );
      }
      this.newMessage = '';
    }
  }

  getOrdersForAdmin(): void {
    this.orderService.getOrdersForAdmin().subscribe((orders) => {
      this.clientsByEmployeStartTrue = orders.filter(
        (order) => order.finish_chat === 0
      );

      this.clientsByEmployeStartFalse = orders.filter(
        (order) => order.finish_chat === 1
      );

      this.currentOrder = orders.find((order) => {
        return order.order_item_id === this.id;
      });

      if (this.currentOrder) {
        this.getMessagesByGroup(this.currentOrder);
      }
    });
  }

  getMessagesWithVisibilityFlag(messages: any[]): any[] {
    return messages.map((message, index, array) => {
      const isLastOrNextIsDifferentUser =
        index === array.length - 1 || array[index + 1].user !== message.user;
      return {
        ...message,
        showName: isLastOrNextIsDifferentUser,
      };
    });
  }

  getMessagesByGroup(orderUser: OrderUser): void {
    console.log(orderUser);

    this.groupService
      .getGroupByOrderId(orderUser.order_item_id)
      .subscribe((group) => {
        console.log(group);
        this.currentGroup = group;
        this.currentOrder = orderUser;
        this.nameOrder = orderUser.order_item_name;
        this.nameCliente = orderUser.customer_name;
        this.socketService.joinRoom(this.currentGroup.group_id);

        //TODO: Confirmar si funciona
        this.clientsByEmployeStartTrue.forEach((order) => {
          if (order.order_item_id === orderUser.order_item_id) {
            order.unread_messages = 0;
          }
        });


        this.messageService
          .getMessagesByGroup(this.currentGroup.group_id)
          .subscribe((messages) => {
            this.messages = messages.map((message) => {
              message.sender =
                message.sender_id === this.usuarioService.uid ? 'me' : 'others';
              return message;
            });
          });
      });
  }

  startChat(): void {
    this.orderService
      .startChat(this.currentOrder?.order_item_id)
      .subscribe(() => {
        this.getOrdersForAdmin();
      });
  }

  endChat(): void {
    this.orderService
      .finishChat(this.currentOrder?.order_item_id)
      .subscribe(() => {
        this.getOrdersForAdmin();
      });
  }
}
