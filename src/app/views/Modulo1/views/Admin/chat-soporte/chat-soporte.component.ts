import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { ChatStructureComponent } from '../../../components/chat-structure/chat-structure.component';
import { GroupService } from 'src/app/core/services/group.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { Group } from 'src/app/interfaces/group.interface';
import { Usuario } from 'src/app/models/usuario.model';
import { CommonModule } from '@angular/common';
import { SocketService } from 'src/app/core/services/socket.service';
import { NewMessage } from 'src/app/interfaces/chat.interface';
import { MessageService } from 'src/app/core/services/message.service';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-soporte',
  standalone: true,
  imports: [
    DialogModule,
    TabViewModule,
    ChatStructureComponent,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './chat-soporte.component.html',
  styleUrl: './chat-soporte.component.scss',
})
export class ChatSoporteComponent implements OnInit, OnDestroy {
  visible: boolean = false;

  // Variables del chat
  newMessage: string = '';
  nameUser: string = 'Nombre del usuario';
  motivoChat: string = 'Descripcion del problema';
  nameCliente: string = 'Cliente#123';
  nameOrder: string = 'Nombre de la orden';

  listGroupEmp: Group[] | undefined;
  listGroupCustomer: Group[] | undefined;
  currentGroup: Group | undefined;

  usuario: Usuario;
  messages2: NewMessage[] = [];

  messages: NewMessage[] = [];
  messagesAll: Group[] = [];

  private customerToAdminSupportMessageReceived: Subscription | undefined;
  private employeeToAdminSupportMessageReceived: Subscription | undefined;

  //TODO: Terminar esa parte
  constructor(
    private groupService: GroupService,
    private usuarioService: UsuarioService,
    private socketService: SocketService,
    private messageService: MessageService
  ) {}

  ngOnDestroy(): void {
    if (this.currentGroup) {
      this.socketService.leaveRoom(this.currentGroup.group_id);
    }
    if (this.customerToAdminSupportMessageReceived) {
      this.customerToAdminSupportMessageReceived.unsubscribe();
    }
    if (this.employeeToAdminSupportMessageReceived) {
      this.employeeToAdminSupportMessageReceived.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;
    this.getGroupMembershipAdminEmpAndCutomer();
    this.customerToAdminSupportMessageReceived =
      this.socketService.customerToAdminSupportMessageReceived.subscribe(
        (message: NewMessage) => {
          message.sender =
            message.sender_id === this.usuarioService.uid ? 'me' : 'others';
          this.messages.push(message);
        }
      );

    this.employeeToAdminSupportMessageReceived =
      this.socketService.employeeToAdminSupportMessageReceived.subscribe(
        (message: NewMessage) => {
          message.sender =
            message.sender_id === this.usuarioService.uid ? 'me' : 'others';
          this.messages.push(message);
        }
      );
  }

  showDialog() {
    this.visible = true;
  }

  getGroupMembershipAdminEmpAndCutomer(): void {
    this.groupService
      .getGroupMembershipAdminEmpAndCutomer()
      .subscribe((groups) => {
        //TODO: Realizar el filtrado de empl y customer
        if (groups) {
          this.listGroupEmp = groups.filter(
            (item) => item.type_chat === 'CHAT_SUPPORT_EMP'
          );
          this.listGroupCustomer = groups.filter(
            (item) => item.type_chat === 'CHAT_SUPPOR_CUSTOMER'
          );
        }
      });
  }

  getMessagesByGroup(group: Group): void {
    this.currentGroup = group;
    //cambiar el unread_messages a 0
    if(group.type_chat === 'CHAT_SUPPORT_EMP'){
      this.listGroupEmp = this.listGroupEmp?.map((item) => {
        if(item.group_id === group.group_id){
          item.unread_messages = 0;
        }
        return item;
      });
    }
    if(group.type_chat === 'CHAT_SUPPOR_CUSTOMER'){
      this.listGroupCustomer = this.listGroupCustomer?.map((item) => {
        if(item.group_id === group.group_id){
          item.unread_messages = 0;
        }
        return item;
      });
    }

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
        type_chat: this.currentGroup?.type_chat === 'CHAT_SUPPORT_EMP' ? 'CHAT_SUPPORT_EMP' : 'CHAT_SUPPOR_CUSTOMER',
      };
      this.messages.push(newMessage);
      if (this.currentGroup?.group_id) {
        if (this.currentGroup?.type_chat === 'CHAT_SUPPORT_EMP') {
          this.socketService.sendMessageFromEmployeeToAdminSupport(
            this.currentGroup.group_id,
            newMessage
          );
        } else {
          this.socketService.sendMessageFromCustomerToAdminSupport(
            this.currentGroup.group_id,
            newMessage
          );
        }
      }
      this.newMessage = '';
    }

    if (!this.currentGroup?.start_chat && this.currentGroup) {
      this.groupService
        .updateGroupStartChat(this.currentGroup?.group_id, this.usuario.id)
        .subscribe((group) => {
          this.currentGroup!.start_chat = 1;
        });
    }
  }
}
