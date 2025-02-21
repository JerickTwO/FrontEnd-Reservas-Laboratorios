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

  private manejarError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error desconocido.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      errorMessage = `Error del servidor: Código ${error.status}, mensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

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
