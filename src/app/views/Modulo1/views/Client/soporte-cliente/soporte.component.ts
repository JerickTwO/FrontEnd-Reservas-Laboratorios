import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { ChatStructureComponent } from '../../../components/chat-structure/chat-structure.component';
import { Group } from 'src/app/interfaces/group.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupService } from 'src/app/core/services/group.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { SocketService } from 'src/app/core/services/socket.service';
import { NewMessage } from 'src/app/interfaces/chat.interface';
import { MessageService } from 'src/app/core/services/message.service';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/core/services/alerts.service';

@Component({
  selector: 'app-soporte',
  standalone: true,
  imports: [
    DialogModule,
    TabViewModule,
    ChatStructureComponent,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './soporte-cliente.component.html',
  styleUrl: './soporte-cliente.component.scss',
})
export class SoporteClienteComponent implements OnInit, OnDestroy {
  // Variables del chat
  newMessage: string = '';
  nameUser: string = 'Nombre del usuario';
  motivoChat: string = 'Descripcion del problema';
  nameCliente: string = 'Cliente#123';
  nameOrder: string = 'Nombre de la orden';

  motivoSolicitud: string = '';
  detalleAsunto: string = '';

  listGroupEmp: Group[] | undefined;
  currentGroup: Group | undefined;
  visible: boolean = false;

  usuario: Usuario;
  messages2: NewMessage[] = [];

  messages: any[] = [
    { id: 1, user: 'Mi Nombre', text: 'Hola, ¿cómo estás?', sender: 'me' },
    {
      id: 2,
      user: 'Nombre de Otra Persona',
      text: '¡Hola! Estoy bien, ¿y tú?',
      sender: 'others',
    },
  ];

  messagesAll: Group[] = [
    {
      name: 'JosueVelasquez#123',
      start_chat: 0,
      id: 3,
      group_id: 1,
      user_id: 1,
      unread_messages: 0,
    },
  ];

  private customerToAdminSupportMessageReceived: Subscription | undefined;

  //TODO: Terminar esa parte
  constructor(
    private groupService: GroupService,
    private usuarioService: UsuarioService,
    private socketService: SocketService,
    private messageService: MessageService,
    private alertService: AlertService
  ) { }

  ngOnDestroy(): void {
    if (this.currentGroup) {
      this.socketService.leaveRoom(this.currentGroup.group_id);
    }

    if (this.customerToAdminSupportMessageReceived) {
      this.customerToAdminSupportMessageReceived.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;
    this.getGroupMembershipAdminByIdCustomer();
    this.customerToAdminSupportMessageReceived =
      this.socketService.customerToAdminSupportMessageReceived.subscribe(
        (message: NewMessage) => {
          message.sender =
            message.sender_id === this.usuarioService.uid ? 'me' : 'others';
          this.messages.push(message);
        }
      );

    // Alerta de valoracion

    // Ejemplo de uso
    this.alertService.alertRating('Por favor, selecciona tu valoración:').then((rating) => {
      if (rating !== null) {
        console.log('Valoración seleccionada:', rating);
      } else {
        console.log('Valoración cancelada');
      }
    });
  }

  showDialog() {
    this.visible = true;
  }

  enviarSolicitud(): void {
    //TODO: validar que el motivo de la solicitud no este vacio ni el detalle del asunto
    if (
      this.motivoSolicitud.trim() === '' ||
      this.detalleAsunto.trim() === ''
    ) {
      console.log('Falta completar los campos');
      return;
    }
    this.createGroupSuportAndAdminCustomer(
      this.usuario.id,
      this.usuario.user_nicename
    );
  }

  getGroupMembershipAdminByIdCustomer(): void {
    this.groupService
      .getGroupMembershipAdminByIdCustomer(this.usuario.id)
      .subscribe((groups) => {
        if (groups && groups.length > 0 && groups[0].group_id !== undefined) {
          this.currentGroup = groups[0];
          this.getMessagesByGroup(this.currentGroup);
          this.socketService.joinRoom(this.currentGroup.group_id);
        } else {
          // Manejar el caso en que groups es vacío o el primer elemento no tiene group_id
          console.error(
            'No groups found or the first group does not have a group_id'
          );
        }
      });
  }

  getMessagesByGroup(group: Group): void {
    this.currentGroup = group;
    this.socketService.joinRoom(group.group_id);
    this.messageService
      .getMessagesByGroup(group.group_id)
      .subscribe((messages) => {
        this.messages = messages.map((message) => {
          message.sender =
            message.sender_id === this.usuarioService.uid ? 'me' : 'others';
          return message;
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
        type_chat: "CHAT_SUPPOR_CUSTOMER"
      };
      console.log(this.currentGroup);

      this.messages.push(newMessage);
      if (this.currentGroup?.group_id) {
        this.socketService.sendMessageFromCustomerToAdminSupport(
          this.currentGroup.group_id,
          newMessage
        );
      }
      this.newMessage = '';
    }
  }

  createGroupSuportAndAdminCustomer(user_id: number, name: string): void {
    if (!this.currentGroup) {
      this.groupService
        .createGroupSuportAndAdminCustomer(
          user_id,
          this.usuario.user_nicename,
          this.motivoChat,
          this.motivoSolicitud
        )
        .subscribe((group) => {
          this.currentGroup = group;
          this.getMessagesByGroup(this.currentGroup);
          this.socketService.joinRoom(this.currentGroup.group_id);
        });
    }
  }

  getGroupMembershipByIdUser(user_id: number): void {
    this.groupService
      .getGroupMembershipByIdUser(user_id)
      .subscribe((groups) => {
        if (groups) {
          this.currentGroup = groups[0];
          this.getMessagesByGroup(this.currentGroup);
          this.socketService.joinRoom(this.currentGroup.group_id);
        }
      });
  }
}
