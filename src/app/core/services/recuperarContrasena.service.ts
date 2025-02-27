import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class RecoveryService {
    private apiUrl = `${environment.urlBase}/recuperar`;

  constructor(private http: HttpClient) {}

  // Paso 1: Generar código de recuperación
  enviarCorreoRecuperacion(correo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/recovery-password`, {
      correo: correo,
    });
  }

  // Paso 2: Verificar código de recuperación
  verificarCodigo(correo: string, code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-code`, {
      correo,
      code,
    });
  }

  // Paso 3: Restablecer la contraseña
  resetPassword(correo: string, code: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, {
      correo,
      code,
      newPassword,
    });
  }
}

