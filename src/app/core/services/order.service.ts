import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import {
  Order,
  OrderReponse,
  OrderUser,
  OrderUserReponse,
} from 'src/app/interfaces/orden.interface';
@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<OrderReponse>(`${environment.urlBase}/order`).pipe(
      map((resp: OrderReponse) => {
        return resp.data.orders;
      }),
      catchError((err) => {
        console.error(err);
        return of([]);
      })
    );
  }

  getOrder(id: string): Observable<Order[]> {
    return this.http
      .get<OrderReponse>(`${environment.urlBase}/order/${id}`)
      .pipe(
        map((resp: OrderReponse) => {
          return resp.data.orders;
        }),
        catchError((err) => {
          return of([]);
        })
      );
  }

  acceptOrder(order_item_id: number, user_id: number) {
    return this.http.post(`${environment.urlBase}/order/accept`, {
      order_item_id,
      user_id,
    });
  }

  getOrdersByUserId(user_id: number): Observable<OrderUser[]> {
    return this.http
      .get<OrderUserReponse>(`${environment.urlBase}/order/user/${user_id}`)
      .pipe(
        map((resp: OrderUserReponse) => {
          return resp.data.orders;
        }),
        catchError((err) => {
          return of([]);
        })
      );
  }

  getOrdersForAdmin(): Observable<OrderUser[]> {
    return this.http
      .get<OrderUserReponse>(`${environment.urlBase}/order/admin`)
      .pipe(
        map((resp: OrderUserReponse) => {
          console.log(resp.data.orders);

          return resp.data.orders;
        }),
        catchError((err) => {
          return of([]);
        })
      );
  }

  getOrdersForEmployee(user_id: number): Observable<OrderUser[]> {
    console.log(user_id);

    return this.http
      .get<OrderUserReponse>(`${environment.urlBase}/order/employee/${user_id}`)
      .pipe(
        map((resp: OrderUserReponse) => {
          return resp.data.orders;
        }),
        catchError((err) => {
          return of([]);
        })
      );
  }

  startChat(order_item_id: number | undefined) {
    return this.http.post(`${environment.urlBase}/order/start-chat`, {
      order_item_id,
    });
  }

  finishChat(order_item_id: number | undefined) {
    return this.http.post(`${environment.urlBase}/order/finish-chat`, {
      order_item_id,
    });
  }

  markOrderAsApproved(order: OrderUser, adminId: number) {
    return this.http.post(`${environment.urlBase}/order/mark-as-approved`, {
      orderData: order,
      adminId,
    });
  }

  updateRating(order_item_id: number, rating: number) {
    return this.http.post(`${environment.urlBase}/order/update-rating`, {
      order_item_id,
      rating,
    });
  }

}
