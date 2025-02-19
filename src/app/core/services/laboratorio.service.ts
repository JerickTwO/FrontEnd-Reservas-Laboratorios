
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Laboratorio } from 'src/app/models/laboratorio.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root', // Esto hace que el servicio sea accesible sin `app.module.ts`
})
export class LaboratorioService {
  private apiUrl = `${environment.urlBase}/laboratorios`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  // Manejo de errores genérico
  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('Error del cliente:', error.error.message);
    } else {
      console.error(
        `Backend devolvió el código ${error.status}, ` +
        `cuerpo: ${JSON.stringify(error.error)}`
      );
    }
    return throwError(() => new Error('Error en la solicitud al servidor.'));
  }

  // Obtener todos los laboratorios
  getLaboratorios(): Observable<Laboratorio[]> {
    return this.http.get<Laboratorio[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Crear un laboratorio
  crearLaboratorio(laboratorio: Laboratorio): Observable<Laboratorio> {
    return this.http.post<Laboratorio>(this.apiUrl, laboratorio, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar un laboratorio
  actualizarLaboratorio(id: number, laboratorio: Laboratorio): Observable<Laboratorio> {
    return this.http.put<Laboratorio>(`${this.apiUrl}/${id}`, laboratorio, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar un laboratorio
  eliminarLaboratorio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }
  // Buscar laboratorios
  buscarLaboratorios(query: string): Observable<Laboratorio[]> {
    return this.http.get<Laboratorio[]>(`${this.apiUrl}/buscar?query=${query}`);
  }
  // Obtener un laboratorio por ID
  getLaboratorioById(id: number): Observable<Laboratorio> {
    return this.http.get<Laboratorio>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }
}
