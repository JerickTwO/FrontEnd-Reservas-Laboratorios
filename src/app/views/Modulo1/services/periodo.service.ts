import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Periodo } from 'src/app/models/periodo.model';

@Injectable({
  providedIn: 'root',
})
export class PeriodoService {
  private apiUrl = 'http://localhost:8080/api/periodos'; // URL base del backend

  constructor(private http: HttpClient) {}

  /**
   * Obtener todos los periodos.
   */
  getPeriodos(): Observable<Periodo[]> {
    return this.http.get<Periodo[]>(this.apiUrl);
  }

  /**
   * Obtener un periodo por su ID.
   */
  getPeriodoById(id: number): Observable<Periodo> {
    return this.http.get<Periodo>(`${this.apiUrl}/${id}`);
  }

  /**
   * Agregar un nuevo periodo.
   */
  agregarPeriodo(periodo: Periodo): Observable<Periodo> {
    return this.http.post<Periodo>(this.apiUrl, periodo);
  }

  /**
   * Editar un periodo existente.
   */
  editarPeriodo(id: number, periodo: Periodo): Observable<Periodo> {
    return this.http.put<Periodo>(`${this.apiUrl}/${id}`, periodo);
  }

  /**
   * Eliminar un periodo por su ID.
   */
  eliminarPeriodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
