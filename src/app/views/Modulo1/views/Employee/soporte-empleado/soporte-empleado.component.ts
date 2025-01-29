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
  templateUrl: './soporte-empleado.component.html',
  styleUrl: './soporte-empleado.component.scss',
})
export class SoporteEmpleadoComponent implements OnInit, OnDestroy {
  visible: boolean = false;

  // Variables del chat
  newMessage: string = '';
  nameUser: string = 'Nombre del usuario';
  motivoChat: string = 'Descripcion del problema';
  nameCliente: string = 'Cliente#123';
  nameOrder: string = 'Nombre de la orden';

  listGroupEmp: Group[] | undefined;
  currentGroup: Group | undefined;

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
    {
      id: 3,
      user: 'Mi Nombre',
      text: 'Yo también estoy bien, gracias.',
      sender: 'me',
    },
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

  private employeeToAdminSupportMessageReceived: Subscription | undefined;


  //TODO: Terminar esa parte
  constructor(
    private groupService: GroupService,
    private usuarioService: UsuarioService,
    private socketService: SocketService,
    private messageService: MessageService
  ) {}


  ngOnDestroy(): void {
    this.socketService.removeAllListeners();
    if (this.currentGroup) {
      this.socketService.leaveRoom(this.currentGroup.group_id);
    }

    if (this.employeeToAdminSupportMessageReceived) {
      this.employeeToAdminSupportMessageReceived.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;
    this.getGroupMembershipByIdUser(this.usuario.id);
    this.employeeToAdminSupportMessageReceived = this.socketService.employeeToAdminSupportMessageReceived.subscribe((message: NewMessage) => {
      message.sender =
        message.sender_id === this.usuarioService.uid ? 'me' : 'others';
      this.messages.push(message);
    });
  }

  showDialog() {
    this.visible = true;
  }

  getGroupMembershipAdmin(): void {
    //TODO: Si no funciona aqui modificque
    this.groupService.getGroupMembershipAdminEmpAndCutomer().subscribe((groups) => {
      if (groups) {
        this.listGroupEmp = groups;
      }
    });
  }

  getMessagesByGroup(group: Group): void {
    console.log(group);
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
        created_at : new Date().toISOString(),
      };
      this.messages.push(newMessage);
      if (this.currentGroup?.group_id) {
        this.socketService.sendMessageFromEmployeeToAdminSupport(
          this.currentGroup.group_id,
          newMessage
        );
      }
      this.newMessage = '';
    }
  }

  createGroupSuportAndAdmin(user_id: number, name: string): void {
    if (!this.currentGroup) {
      this.groupService
        .createGroupSuportAndAdmin(user_id, this.usuario.user_nicename)
        .subscribe((group) => {
          this.currentGroup = group;
        });
    }
  }

  getGroupMembershipByIdUser(user_id: number): void {
    this.groupService
      .getGroupMembershipByIdUser(user_id)
      .subscribe((groups) => {
        console.log(groups);
        if (groups) {
          this.currentGroup = groups[0];
          this.getMessagesByGroup(this.currentGroup);
          this.socketService.joinRoom(this.currentGroup.group_id);
        }
      });
  }
}
