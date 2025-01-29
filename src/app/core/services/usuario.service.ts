import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import {
  LoginForm,
  UserReponse,
} from 'src/app/interfaces/login-form.interface';
import { Usuario } from 'src/app/models/usuario.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private usuarioSubject = new BehaviorSubject<Usuario>(
    new Usuario(0, '', '', '', '', '', 'Colaborador')
  );
  public usuario$ = this.usuarioSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get usuario(): Usuario {
    return this.usuarioSubject.value;
  }

  private setUsuario(usuario: Usuario) {
    this.usuarioSubject.next(usuario);
  }

  get role(): 'Administrador' | 'Colaborador' | 'Customer' | undefined {
    return this.usuario.role;
  }

  get uid(): number {
    return this.usuario.id || 0;
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  guardarLocalStorage(token: string) {
    localStorage.setItem('token', token);
  }

  logout() {
    localStorage.removeItem('token');

    this.ngZone.run(() => {
      this.router.navigateByUrl('/login');
    });
  }

  validarToken(): Observable<boolean> {

    return this.http
      .get<UserReponse>(`${environment.urlBase}/auth/renew`, {
        headers: {
          'x-token': this.token,
        },
      })
      .pipe(
        map((resp: UserReponse) => {
          const {
            id,
            user_login,
            user_nicename,
            user_email,
            user_url,
            display_name,
            role,
          } = resp.data;
          this.setUsuario(
            new Usuario(
              id,
              user_login,
              user_nicename,
              user_email,
              user_url,
              display_name,
              role
            )
          );
          this.guardarLocalStorage(resp.token);
          console.log("Token renovado");
          return true;
        }),
        catchError((error) => {
          console.log("Error en el token: ", error);

          return of(false);
        }
        )
      );
  }

  login(formData: LoginForm) {
    return this.http
      .post<UserReponse>(`${environment.urlBase}/auth/login`, formData)
      .pipe(
        tap((resp: UserReponse) => {
          const {
            id,
            user_login,
            user_nicename,
            user_email,
            user_url,
            display_name,
            role,
          } = resp.data;
          this.setUsuario(
            new Usuario(
              id,
              user_login,
              user_nicename,
              user_email,
              user_url,
              display_name,
              role
            )
          );
          this.guardarLocalStorage(resp.token);
        })
      );
  }
}
