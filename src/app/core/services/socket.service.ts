import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  public messageReceived: Subject<any> = new Subject<any>();
  private isConnected: boolean = false;

  //Order
  public employeeToClientMessageReceived: Subject<any> = new Subject<any>();

  //TODO: Chat Soporte - terminar de implementar que se repiten
  public employeeToAdminSupportMessageReceived: Subject<any> = new Subject<any>();
  public customerToAdminSupportMessageReceived: Subject<any> = new Subject<any>();

  constructor() { }



}