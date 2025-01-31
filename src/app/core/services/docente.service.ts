import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment.development';
import { Docente } from 'src/app/models/docente.model';

@Injectable({
  providedIn: 'root',
})
export class DocenteService {
  private apiUrl = `${environment.urlBase}/docentes`;

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

  getDocentes(): Observable<Docente[]> {
    return this.http.get<Docente[]>(this.apiUrl).pipe(catchError(this.manejarError));
  }

  agregarDocente(docente: Docente): Observable<Docente> {
    return this.http.post<Docente>(this.apiUrl, docente).pipe(catchError(this.manejarError));
  }

  editarDocente(docente: Docente): Observable<Docente> {
    return this.http.put<Docente>(`${this.apiUrl}/${docente.idDocente}`, docente).pipe(
      catchError(this.manejarError)
    );
  }

  eliminarDocente(idDocente: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idDocente}`).pipe(catchError(this.manejarError));
  }
}
