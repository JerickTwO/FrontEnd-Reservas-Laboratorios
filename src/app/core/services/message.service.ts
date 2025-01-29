import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ChatMessageReponse, NewMessage } from 'src/app/interfaces/chat.interface';
@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) { }

  getMessagesByGroup(id: number): Observable<NewMessage[]> {
    return this.http.get<ChatMessageReponse>(`${environment.urlBase}/message/${id}`).pipe(
      map((resp: ChatMessageReponse) => {
        return resp.data;
      }),
      catchError((err) => {
        console.error(err);
        return of([]);
      })
    );
  }
}
