import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { ChatStructureComponent } from '../../../components/chat-structure/chat-structure.component';
import { SocketService } from 'src/app/core/services/socket.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { OrderService } from 'src/app/core/services/order.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NewMessage } from 'src/app/interfaces/chat.interface';
import { OrderUser } from 'src/app/interfaces/orden.interface';
import { MessageService } from 'src/app/core/services/message.service';
import { FormsModule } from '@angular/forms';
import { GroupService } from 'src/app/core/services/group.service';
import { Group } from 'src/app/interfaces/group.interface';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/core/services/alerts.service';

@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [
    DialogModule,
    TabViewModule,
    ChatStructureComponent,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './chats-cliente.component.html',
  styleUrl: './chats-cliente.component.scss',
})
export class ChatsClienteComponent implements OnInit, OnDestroy {
  // Variables del chat
  nameEmpleado: string = 'Jugador#23356';
  nameOrder: string = 'Nombre de la orden';
  messages: NewMessage[] = [];
  visible: boolean = false;
  id: number | null = null;
  newMessage: string = '';

  clientsByEmployeStartTrue: OrderUser[] = [];
  clientsByEmployeStartFalse: OrderUser[] = [];
  currentOrder: OrderUser | undefined;
  currentGroup: Group | undefined;
  previousGroup: Group | undefined;

  nameCliente: string = 'Cliente#123';

  private employeeToClientMessageReceived: Subscription | undefined;

  constructor(
    private socketService: SocketService,
    private usuarioService: UsuarioService,
    private orderService: OrderService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private groupService: GroupService,
    private alertService: AlertService
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

  ngOnInit(): void {
    console.log('Initializing component...');
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.employeeToClientMessageReceived =
      this.socketService.employeeToClientMessageReceived.subscribe(
        (message: any) => {
          console.log('Message received in component:', message);
          message.sender =
            message.sender_id === this.usuarioService.uid ? 'me' : 'others';
          this.messages.push(message);
        }
      );

    if (this.id) {
      this.socketService.joinRoom(this.id);
    }

    this.getOrdersByUserId(this.usuarioService.uid);
  }

  getOrdersByUserId(user_id: number): void {
    this.orderService.getOrdersByUserId(user_id).subscribe((orders) => {
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

  getMessagesByGroup(orderUser: OrderUser): void {
    console.log('Getting messages by group:', orderUser);

    this.groupService
      .getGroupByOrderId(orderUser.order_item_id)
      .subscribe((group) => {
        this.currentGroup = group;
        this.currentOrder = orderUser;
        this.nameOrder = orderUser.order_item_name;
        this.nameCliente = orderUser.customer_name;

        // Cambiar de sala y unirse a la nueva
        if (this.previousGroup) {
          this.socketService.leaveRoom(this.previousGroup.group_id);
        }
        this.previousGroup = group;
        this.socketService.joinRoom(this.currentGroup.group_id);

        this.clientsByEmployeStartTrue.forEach((order) => {
          if (order.order_item_id === orderUser.order_item_id) {
            order.unread_messages = 0;
          }
        });

        this.messageService
          .getMessagesByGroup(this.currentGroup.group_id)
          .subscribe((messages) => {
            //cambiar el contedo a cero
            this.messages = messages.map((message) => {
              message.sender =
                message.sender_id === this.usuarioService.uid ? 'me' : 'others';
              return message;
            });
          });
      });
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

  startChat(): void {
    this.orderService
      .startChat(this.currentOrder?.order_item_id)
      .subscribe(() => {
        this.getOrdersByUserId(this.usuarioService.uid);
      });
  }

  openDialog = () => {
    this.alertService.alertRating('Por favor, selecciona tu valoración:').then((rating) => {
      if (rating !== null) {
        console.log('Valoración seleccionada:', rating);
        this.updateRating(rating);
      } else {
        console.log('Valoración cancelada');
      }
    });
  }

  updateRating = (rating: number) => {
    this.orderService
      .updateRating(this.currentOrder?.order_item_id || 0, rating)
      .subscribe(() => {
        this.getOrdersByUserId(this.usuarioService.uid);
      });
  }
}
