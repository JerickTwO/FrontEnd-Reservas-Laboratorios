import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Administrador } from 'src/app/models/administrador.model';
import { environment } from 'src/environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class AdministradorService {
  private apiUrl = `${environment.urlBase}/administradores`;

  constructor(private http: HttpClient) { }

  // Manejar errores de las peticiones HTTP
  private manejarError(error: HttpErrorResponse): Observable<never> {
    console.error('Error:', error.message);
    return throwError('Error al realizar la solicitud. Intente más tarde.');
  }

  // Obtener todos los Administradors
  getAdministradores(): Observable<Administrador[]> {
    return this.http.get<Administrador[]>(`${this.apiUrl}`).pipe(catchError(this.manejarError));
  }

  // Agregar un Administradors
  agregarAdministrador(Administrador: Administrador): Observable<Administrador> {
    return this.http.post<Administrador>(`${this.apiUrl}`, Administrador).pipe(catchError(this.manejarError));
  }

  // Editar un Administradors
  editarAdministrador(Administrador: Administrador): Observable<Administrador> {
    return this.http.put<Administrador>(`${this.apiUrl}/${Administrador.idAdministrador}`, Administrador).pipe(catchError(this.manejarError));
  }

  // Eliminar un Administradors

  eliminarAdministrador(idAdministrador: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idAdministrador}`).pipe(catchError(this.manejarError));
  }
}
