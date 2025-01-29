import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import {
  Group,
  GroupEmpSupportResponde,
} from 'src/app/interfaces/group.interface';
@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor(private http: HttpClient) {}

  getGroupMembershipByIdUser(user_id: number): Observable<Group[]> {
    return this.http
      .get<GroupEmpSupportResponde>(
        `${environment.urlBase}/group/getGroupMembershipByIdUser/${user_id}`
      )
      .pipe(
        map((resp: GroupEmpSupportResponde) => {
          return resp.data.group;
        }),
        catchError((err) => {
          console.error(err);
          return of([]);
        })
      );
  }

  getGroupMembershipAdminByIdCustomer(user_id: number): Observable<Group[]> {
    return this.http
      .get<GroupEmpSupportResponde>(
        `${environment.urlBase}/group/getGroupMembershipAdminByIdCustomer/${user_id}`
      )
      .pipe(
        map((resp: GroupEmpSupportResponde) => {
          return resp.data.group;
        }),
        catchError((err) => {
          console.error(err);
          return of([]);
        })
      );
  }


  getGroupMembershipAdminEmpAndCutomer(): Observable<Group[]> {
    return this.http
      .get<GroupEmpSupportResponde>(
        `${environment.urlBase}/group/getGroupMembershipAdminEmpAndCutomer`
      )
      .pipe(
        map((resp: GroupEmpSupportResponde) => {
          console.log(resp.data.group);

          return resp.data.group;
        }),
        catchError((err) => {
          console.error(err);
          return of([]);
        })
      );
  }



  createGroupSuportAndAdmin(user_id: number, name:string): Observable<Group> {
    return this.http
      .post<GroupEmpSupportResponde>(
        `${environment.urlBase}/group/createGroupSuportAndAdmin`,
        {
          user_id,
          name,
        }
      )
      .pipe(
        map((resp: GroupEmpSupportResponde) => {
          return resp.data.group[0];
        }),
        catchError((err) => {
          console.error(err);
          return of({} as Group);
        })
      );
  }

  createGroupSuportAndAdminCustomer(user_id: number, name:string, description:string, reason:string): Observable<Group> {
    return this.http
      .post<GroupEmpSupportResponde>(
        `${environment.urlBase}/group/createGroupSuportAndAdminCustomer`,
        {
          user_id,
          name,
        }
      )
      .pipe(
        map((resp: GroupEmpSupportResponde) => {
          return resp.data.group[0];
        }),
        catchError((err) => {
          console.error(err);
          return of({} as Group);
        })
      );
  }

  getGroupByOrderId(order_id: number): Observable<Group> {
    return this.http
      .get<GroupEmpSupportResponde>(
        `${environment.urlBase}/group/getGroupByOrderId/${order_id}`
      )
      .pipe(
        map((resp: GroupEmpSupportResponde) => {
          return resp.data.group[0];
        }),
        catchError((err) => {
          console.error(err);
          return of({} as Group);
        })
      );
  }

  updateGroupStartChat(groupId: number, userId: number): Observable<Group> {
    return this.http
      .post<GroupEmpSupportResponde>(
        `${environment.urlBase}/group/updateGroupStartChat`,
        {
          groupId,
          userId,
        }
      )
      .pipe(
        map((resp: GroupEmpSupportResponde) => {
          return resp.data.group[0];
        }),
        catchError((err) => {
          console.error(err);
          return of({} as Group);
        })
      );
  }
}
