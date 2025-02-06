import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Estudiante } from '../../models/estudiante.model';
import { environment } from 'src/environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private apiUrl = `${environment.urlBase}/estudiantes`;

  constructor(private http: HttpClient) { }

  // Manejar errores de las peticiones HTTP
  private manejarError(error: HttpErrorResponse): Observable<never> {
    console.error('Error:', error.message);
    return throwError('Error al realizar la solicitud. Intente más tarde.');
  }

  // Obtener todos los Estudiantes
  getEstudiantes(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(`${this.apiUrl}`).pipe(catchError(this.manejarError));
  }

  // Agregar un Estudiantes
  agregarEstudiante(estudiante: Estudiante): Observable<Estudiante> {
    return this.http.post<Estudiante>(`${this.apiUrl}`, estudiante).pipe(catchError(this.manejarError));
  }

  // Editar un Estudiantes
  editarEstudiante(estudiante: Estudiante): Observable<Estudiante> {
    return this.http.put<Estudiante>(`${this.apiUrl}/${estudiante.idEstudiante}`, estudiante).pipe(catchError(this.manejarError));
  }

  // Eliminar un Estudiantes

  eliminarEstudiante(idEstudiante: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idEstudiante}`).pipe(catchError(this.manejarError));
  }
}
