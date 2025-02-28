import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { LoginForm } from 'src/app/interfaces/login-form.interface';
import { Usuario } from 'src/app/models/usuario.model';
import { environment } from 'src/environments/environment.development';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
// Remove the import statement for Roles as it is not available
@Injectable({
  providedIn: 'root',
})
export class UsuarioService {

  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  public usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient, private router: Router, private ngZone: NgZone) {
    this.cargarUsuarioDesdeStorage();
  }

  getUsuariosUnificados(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${environment.urlBase}/auth/listado`);
  }

  get token(): string {
    const token = localStorage.getItem('token');
    if (!token || token.trim().length === 0) {
      console.error('El token no está presente en localStorage o está vacío.');
      return '';
    }
    return token;
  }

  get usuario(): Usuario | null {
    return this.usuarioSubject.value;
  }

  private setUsuario(usuario: Usuario) {
    this.usuarioSubject.next(usuario);
  }

  get role(): string | undefined {
    return this.usuario?.rol.nombre;
  }

  get uid(): number {
    return this.usuario?.id || 0;
  }

  get headers() {
    const token = this.token;
    console.log('Authorization Header:', `Bearer ${token}`);
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  }

  guardarLocalStorage(token: string) {
    localStorage.setItem('token', token);
    console.log('Token guardado en localStorage:', token);
    const decoded: any = jwtDecode(token);
    if (decoded && decoded.roles) {
      localStorage.setItem('userRole', decoded.roles[0]);
    }
    this.setUsuarioFromToken(token);
  }

  private cargarUsuarioDesdeStorage() {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('userRole');
    if (token && storedRole) {
      this.setUsuarioFromToken(token);
    }
  }

  private setUsuarioFromToken(token: string) {
    try {
      const decoded: any = jwtDecode(token);
      const usuario: Usuario = {
        id: decoded.sub || 0,
        idUser: decoded.id || 0,
        usuario: decoded.sub || '',
        nombre: decoded.nombre || '',
        apellido: decoded.apellido || '',
        correo: decoded.correo || '',
        contrasena: '',
        rol: {
          id: 0,
          nombre: decoded.roles && decoded.roles.length > 0 ? decoded.roles[0] : '',
          descripcion: '',
        },
        primerLogin: true,
        estado: true,
        tipoUsuario: decoded.roles,
        nombreCompleto: '',
        idInstitucional: '',
        departamentoId: 0,
      };
      this.setUsuario(usuario);
    } catch (error) {
      console.error('Error al decodificar el token:', error);
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    this.ngZone.run(() => {
      this.router.navigateByUrl('/login');
    });
  }

  login(formData: LoginForm) {
    return this.http.post<any>(`${environment.urlBase}/auth/login`, formData, { observe: 'response' })
      .pipe(
        tap((resp) => {
          if (resp.body.detalleError) {
            this.guardarLocalStorage(resp.body.resultado);
            this.router.navigateByUrl('/actualizar-contrasena');
          } else {
            this.guardarLocalStorage(resp.body.resultado);
            this.router.navigateByUrl('/dashboard');
          }
        }),
        catchError((error) => {
          if (error.status === 200) {
            console.warn('Redirección detectada:', error);
            return of(error.error);
          }
          Swal.fire('Error', "Contraseña Incorrecta", 'error')
          console.error('Error en la autenticación:', error);
          return of(null);
        })
      );
  }

  obtenerDatosUsuario() {
    return this.http.get<Usuario>(`${environment.urlBase}/usuario/datos`, this.headers).pipe(
      tap((usuario) => {
        if (usuario instanceof ArrayBuffer) {
          console.error('Error: Respuesta del servidor es un ArrayBuffer en lugar de un objeto Usuario.');
          return;
        }
        this.setUsuario(usuario);
      }),
      catchError((error) => {
        console.error('Error al obtener los datos del usuario:', error);
        return of(null);
      })
    );
  }

  updatePassword(passwordData: any) {
    const headers = {
      'Authorization': `Bearer ${this.token}`
    };

    return this.http.put<any>(`${environment.urlBase}/auth/update-password`, passwordData, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error al actualizar la contraseña:', error);
          return of(null);
        })
      );
  }
}
