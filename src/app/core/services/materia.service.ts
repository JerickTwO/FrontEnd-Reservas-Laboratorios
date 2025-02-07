import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Materia } from 'src/app/models/materia.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class MateriaService {
  private apiUrl = `${environment.urlBase}/materias`;

  constructor(private http: HttpClient) {}

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

  getMaterias(): Observable<Materia[]> {
    return this.http.get<Materia[]>(this.apiUrl).pipe(catchError(this.manejarError));
  }

  agregarMateria(materia: Materia): Observable<Materia> {
    return this.http.post<Materia>(this.apiUrl, materia).pipe(catchError(this.manejarError));
  }

  editarMateria(materia: Materia): Observable<Materia> {
    return this.http.put<Materia>(`${this.apiUrl}/${materia.idMateria}`, materia).pipe(
      catchError(this.manejarError)
    );
  }

  eliminarMateria(idMateria: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idMateria}`).pipe(catchError(this.manejarError));
  }
}
