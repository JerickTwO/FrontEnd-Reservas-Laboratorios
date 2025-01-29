import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SocketService } from 'src/app/core/services/socket.service';

@Component({
  selector: 'app-chat-structure',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat-structure.component.html',
  styleUrl: './chat-structure.component.scss',
})
export class ChatStructureComponent implements OnInit {
  @Input() name1: string = '';
  @Input() name2: string = '';
  @Input() description: string = '';

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
  newMessage: string = '';

  constructor(private socketService: SocketService,


  ) {}

  ngOnInit(): void {

    console.log('ChatStructureComponent');

    this.socketService.messageReceived.subscribe((message: any) => {
      console.log("Guardando mensaje");

      this.messages.push(message);

    });
  }

  sendMessage(): void {
    if (this.newMessage.trim() !== '') {
      const newId = this.messages.length + 1;
      const newMessage = {
        id: newId,
        user: 'Mi Nombre',
        text: this.newMessage,
        sender: 'me',
      };
      this.messages.push(newMessage);
      // this.socketService.sendMessage(newMessage);
      this.newMessage = '';
    }
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
}
