import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Departamento } from 'src/app/models/departamento.model';
import { environment } from 'src/environments/environment.development';


@Injectable({
  providedIn: 'root',
})
export class DepartamentoService {
  private apiUrl = `${environment.urlBase}/departamentos`;

  constructor(private http: HttpClient) {}

  private manejarError(error: HttpErrorResponse): Observable<never> {
    console.error(`Error: ${error.status} - ${error.message}`);
    return throwError('Ocurrió un error al procesar la solicitud.');
  }

  getDepartamentos(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(this.apiUrl).pipe(catchError(this.manejarError));
  }

  agregarDepartamento(departamento: Departamento): Observable<Departamento> {
    return this.http.post<Departamento>(this.apiUrl, departamento).pipe(catchError(this.manejarError));
  }

  editarDepartamento(departamento: Departamento): Observable<Departamento> {
    return this.http.put<Departamento>(`${this.apiUrl}/${departamento.idDepartamento}`, departamento).pipe(
      catchError(this.manejarError)
    );
  }

  eliminarDepartamento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(catchError(this.manejarError));
  }
}
