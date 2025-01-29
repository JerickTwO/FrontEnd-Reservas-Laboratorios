import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import io from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: any;
  public messageReceived: Subject<any> = new Subject<any>();
  private isConnected: boolean = false;

  //Order
  public employeeToClientMessageReceived: Subject<any> = new Subject<any>();

  //TODO: Chat Soporte - terminar de implementar que se repiten
  public employeeToAdminSupportMessageReceived: Subject<any> = new Subject<any>();
  public customerToAdminSupportMessageReceived: Subject<any> = new Subject<any>();

  constructor() {}

  connect(token: string) {
    if (!this.isConnected) {
      this.socket = io(environment.socketUrl, {
        transports: ['websocket'],
        forceNew: true,
        autoConnect: true,
        query: {
          'x-token': token,
        },
      });

      this.socket.on('connect', () => {
        this.isConnected = true;
        console.log('Client is connected');
      });

      this.socket.on('disconnect', () => {
        this.isConnected = false;
        console.log('Client is disconnected');
      });

      this.socket.on('message-sala', (message: any) => {
        this.messageReceived.next(message);
      });

      this.socket.on('employee-to-client-message', (message: any) => {
        console.log('employee-to-client-message', message);
        this.employeeToClientMessageReceived.next(message);
      });

      this.socket.on('employee-to-admin-support-message', (message: any) => {
        this.employeeToAdminSupportMessageReceived.next(message);
      });

      this.socket.on('customer-to-admin-support-message', (message: any) => {
        this.customerToAdminSupportMessageReceived.next(message);
      });
    }
  }

  joinRoom(roomId: number, typeChat = 'chat') {
    if (this.socket) {
      this.socket.emit('join-room', { codigo: roomId , typeChat});
    }
  }

  leaveRoom(roomId: number) {
    if (this.socket) {
      this.socket.emit('leave-room', { codigo: roomId });
    }
  }

  sendMessageToRoom(roomId: number | undefined, message: any) {
    if (this.socket) {
      this.socket.emit('message-sala', { codigo: roomId, ...message });
    }
  }

  sendMessageFromEmployeeToClient(clientId: number, message: any) {
    if (this.socket) {
      this.socket.emit('employee-to-client-message', { clientId, ...message });
    }
  }

  sendMessageFromEmployeeToAdminSupport(clientId: number, message: any) {
    if (this.socket) {
      this.socket.emit('employee-to-admin-support-message', { clientId, ...message });
    }
  }

  sendMessageFromCustomerToAdminSupport(clientId: number, message: any) {
    if (this.socket) {
      this.socket.emit('customer-to-admin-support-message', { clientId, ...message });
    }
  }

  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners('message');
      this.socket.removeAllListeners('message-sala');
      this.socket.removeAllListeners('employee-to-client-message');
      this.socket.removeAllListeners('employee-to-admin-support-message');
      this.socket.removeAllListeners('customer-to-admin-support-message');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
    }
  }

  isConnectedSocket(): boolean {
    return this.isConnected;
  }
}
