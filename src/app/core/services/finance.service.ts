import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError, of, Observable } from 'rxjs';
import { Finance, FinanceResponde } from 'src/app/interfaces/finance.interface';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class FinanceService {
  constructor(private http: HttpClient) {}

  getFinanceByUserId(user_id: number): Observable<Finance[]> {
    return this.http
      .get<FinanceResponde>(`${environment.urlBase}/finance/user/${user_id}`)
      .pipe(
        map((resp: FinanceResponde) => {
          console.log("--");

          return resp.data.finance;
        }),
        catchError((err) => {
          console.error(err);
          return of([]);
        })
      );
  }
}
