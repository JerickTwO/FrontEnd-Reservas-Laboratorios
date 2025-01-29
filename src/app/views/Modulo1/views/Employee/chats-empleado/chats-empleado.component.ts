import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { DividerModule } from 'primeng/divider';
import { ChatStructureComponent } from '../../../components/chat-structure/chat-structure.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SocketService } from 'src/app/core/services/socket.service';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { NewMessage } from 'src/app/interfaces/chat.interface';
import { OrderUser } from 'src/app/interfaces/orden.interface';
import { OrderService } from 'src/app/core/services/order.service';
import { RouterModule } from '@angular/router';
import { MessageService } from 'src/app/core/services/message.service';
import { GroupService } from 'src/app/core/services/group.service';
import { Group } from 'src/app/interfaces/group.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [
    DialogModule,
    TabViewModule,
    ChatStructureComponent,
    DividerModule,
    FormsModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './chats-empleado.component.html',
  styleUrl: './chats-empleado.component.scss',
})
export class ChatsEmpleadoComponent implements OnInit, OnDestroy {
  messages: NewMessage[] = [];
  visible: boolean = false;
  id: number | null;
  newMessage: string = '';

  clientsByEmployeStartTrue: OrderUser[] = [];
  clientsByEmployeStartFalse: OrderUser[] = [];
  currentOrder: OrderUser | undefined;
  currentGroup: Group | undefined;
  previousGroup: Group | undefined;

  nameCliente: string = 'Cliente#123';
  nameOrder: string = 'Nombre de la orden';
  private intervalId: any;

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
    if (this.id) {
      this.socketService.joinRoom(this.id);
    }

    this.employeeToClientMessageReceived =
      this.socketService.employeeToClientMessageReceived.subscribe(
        (message: any) => {
          message.sender =
            message.sender_id === this.usuarioService.uid ? 'me' : 'others';
          this.messages.push(message);
        }
      );

    this.startOrderPolling();
    this.getOrdersByUserId(this.usuarioService.uid);
  }

  startOrderPolling(): void {
    const userId = this.usuarioService.uid;
    this.intervalId = setInterval(() => {
      this.getOrdersByUserInterval(userId);
    }, 5000);
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

  getOrdersByUserInterval(user_id: number): void {
    this.orderService.getOrdersByUserId(user_id).subscribe((orders) => {
      console.log(orders);

      this.clientsByEmployeStartTrue = orders.filter(
        (order) => order.finish_chat === 0
      );

      this.clientsByEmployeStartFalse = orders.filter(
        (order) => order.finish_chat === 1
      );
    });
  }

  getOrdersByUserId(user_id: number): void {
    this.orderService.getOrdersByUserId(user_id).subscribe((orders) => {
      console.log(orders);

      this.clientsByEmployeStartTrue = orders.filter(
        (order) => order.finish_chat === 0
      );

      this.clientsByEmployeStartFalse = orders.filter(
        (order) => order.finish_chat === 1
      );

      this.currentOrder = orders.find(
        (order) => order.order_item_id === this.id
      );

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
    this.groupService
      .getGroupByOrderId(orderUser.order_item_id)
      .subscribe((group) => {
        console.log(group);
        this.currentGroup = group;
        this.currentOrder = orderUser;
        this.nameOrder = orderUser.order_item_name;
        this.nameCliente = orderUser.customer_name;
        //Salir de la sala anterior
        if (this.previousGroup) {
          this.socketService.leaveRoom(this.previousGroup.group_id);
        }

        this.socketService.joinRoom(this.currentGroup.group_id);
        this.previousGroup = group;
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

  // created_at
  trandorDateCreated(date: string): string {
    const dateCreated = new Date(date);
    const day = dateCreated.getDate();
    const month = dateCreated.getMonth();
    const year = dateCreated.getFullYear();
    const hours = dateCreated.getHours();
    const minutes = dateCreated.getMinutes();
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  changeGroup(newGroupId: number): void {}

  startChat(): void {
    this.orderService
      .startChat(this.currentOrder?.order_item_id)
      .subscribe(() => {
        this.getOrdersByUserId(this.usuarioService.uid);
      });
  }

  endChat(): void {
    this.orderService
      .finishChat(this.currentOrder?.order_item_id)
      .subscribe(() => {
        this.getOrdersByUserId(this.usuarioService.uid);
      });
  }
}
