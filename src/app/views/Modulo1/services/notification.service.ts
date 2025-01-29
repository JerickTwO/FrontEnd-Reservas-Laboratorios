import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import {
  Notification,
  NotificationResponde,
} from 'src/app/interfaces/notification.interface';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private http: HttpClient) {}

  getAllNotificationsForAdmins(userId: number): Observable<Notification[]> {
    return this.http
      .get<NotificationResponde>(
        `${environment.urlBase}/notification/all/${userId}`
      )
      .pipe(
        map((resp: NotificationResponde) => {
          return resp.data;
        }),
        catchError((err) => {
          console.error(err);
          return of([]);
        })
      );
  }
}
