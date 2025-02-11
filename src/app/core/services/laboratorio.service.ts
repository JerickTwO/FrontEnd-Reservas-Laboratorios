import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Laboratorio } from 'src/app/models/laboratorio.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class LaboratorioService {
  private apiUrl = `${environment.urlBase}/laboratorios`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

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

  getLaboratorios(): Observable<Laboratorio[]> {
    try {
      return this.http.get<Laboratorio[]>(this.apiUrl).pipe(
        catchError(this.handleError)
      );
    } catch (error) {
      return throwError(() => new Error('Error inesperado al obtener laboratorios.'));
    }
  }

  crearLaboratorio(laboratorio: Laboratorio): Observable<Laboratorio> {
    try {
      return this.http.post<Laboratorio>(this.apiUrl, laboratorio, this.httpOptions).pipe(
        catchError(this.handleError)
      );
    } catch (error) {
      return throwError(() => new Error('Error inesperado al crear laboratorio.'));
    }
  }

  actualizarLaboratorio(id: number, laboratorio: Laboratorio): Observable<Laboratorio> {
    try {
      return this.http.put<Laboratorio>(`${this.apiUrl}/${id}`, laboratorio, this.httpOptions).pipe(
        catchError(this.handleError)
      );
    } catch (error) {
      return throwError(() => new Error('Error inesperado al actualizar laboratorio.'));
    }
  }

  eliminarLaboratorio(id: number): Observable<void> {
    try {
      return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
        catchError(this.handleError)
      );
    } catch (error) {
      return throwError(() => new Error('Error inesperado al eliminar laboratorio.'));
    }
  }

  buscarLaboratorios(query: string): Observable<Laboratorio[]> {
    try {
      return this.http.get<Laboratorio[]>(`${this.apiUrl}/buscar?query=${query}`).pipe(
        catchError(this.handleError)
      );
    } catch (error) {
      return throwError(() => new Error('Error inesperado al buscar laboratorios.'));
    }
  }
}
