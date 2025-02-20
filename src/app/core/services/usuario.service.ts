import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { LoginForm } from 'src/app/interfaces/login-form.interface';
import { Usuario } from 'src/app/models/usuario.model';
import { environment } from 'src/environments/environment.development';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {

  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  public usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient, private router: Router, private ngZone: NgZone) {
    // Cargar el usuario desde localStorage al iniciar la aplicación
    this.cargarUsuarioDesdeStorage();
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


  // Guardar el token y los datos relacionados en localStorage
  guardarLocalStorage(token: string) {
    localStorage.setItem('token', token);
    console.log('Token guardado en localStorage:', token);
    // Decodificar el token y guardar el rol en localStorage
    const decoded: any = jwtDecode(token);
    if (decoded && decoded.roles) {
      localStorage.setItem('userRole', decoded.roles[0]); // Guardamos el primer rol en localStorage
    }

    this.setUsuarioFromToken(token);  // Actualiza el usuario desde el token
  }

  // Cargar usuario desde el token almacenado en localStorage
  private cargarUsuarioDesdeStorage() {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('userRole');

    if (token && storedRole) {
      this.setUsuarioFromToken(token);
    }
  }

  // Decodificar el token y establecer el usuario
  private setUsuarioFromToken(token: string) {
    try {
      const decoded: any = jwtDecode(token);
      const usuario: Usuario = {
        id: decoded.sub || 0, // El 'sub' es generalmente el id del usuario
        idUser: decoded.id || 0, // Si hay un 'id', lo asignamos también
        usuario: decoded.sub || '', // El 'sub' es generalmente el nombre de usuario
        nombre: decoded.nombre || '', // Nombre no está presente en el payload, lo dejamos vacío o agregamos lógica
        apellido: decoded.apellido || '', // Lo mismo para el apellido
        correo: decoded.correo || '', // Lo mismo para el correo
        contrasena: '', // Deberías asignar la contraseña de manera segura, pero no suele ser parte del token
        rol: {
          id: 0, // No se encuentra un id de rol en el payload, podrías agregarlo si es necesario
          nombre: decoded.roles && decoded.roles.length > 0 ? decoded.roles[0] : '', // Tomamos el primer rol
          descripcion: '', // Si tienes más información sobre el rol, puedes agregarla aquí
        },
        primerLogin: true, // Suponemos que es el primer login
        estado: true, // Suponemos que el usuario está activo
      };
      this.setUsuario(usuario); // Establecer el usuario actualizado
    } catch (error) {
      console.error('Error al decodificar el token:', error);
    }
  }

  // Cerrar sesión y limpiar localStorage
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole'); // Limpiar el rol de localStorage también
    this.ngZone.run(() => {
      this.router.navigateByUrl('/login');
    });
  }

  login(formData: LoginForm) {
    return this.http.post<any>(`${environment.urlBase}/auth/login`, formData, { observe: 'response' })
      .pipe(
        tap((resp) => {
          if (resp.status === 200 && resp.body.resultado) {
            const token = resp.body.resultado;
            this.guardarLocalStorage(token);
            console.log('Token guardado:', token);
            this.router.navigateByUrl("/dashboard");

          } else if (resp.status === 302 && resp.body.deatalleError) {
            const token = resp.body.resultado;
            this.guardarLocalStorage(token);
            console.log('Token guardado:', token);
            this.router.navigateByUrl(resp.body.deatalleError);
          }
        }),
        catchError((error) => {
          if (error.status === 302) {
            console.warn('Redirección detectada:', error);
            return of(error.error);
          }
          console.error('Error en la autenticación:', error);
          return of(null);
        })
      );
  }
  

  // Obtener más datos de usuario desde el servidor
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
