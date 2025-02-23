import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Periodo } from 'src/app/models/periodo.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class PeriodoService {
  private apiUrl = `${environment.urlBase}/periodos`;

  constructor(private http: HttpClient) {}

  getPeriodos(): Observable<Periodo[]> {
    return this.http.get<Periodo[]>(this.apiUrl);
  }

  getPeriodoById(id: number): Observable<Periodo> {
    return this.http.get<Periodo>(`${this.apiUrl}/${id}`);
  }

  agregarPeriodo(periodo: Periodo): Observable<Periodo> {
    return this.http.post<Periodo>(this.apiUrl, periodo);
  }

  verificarNombreDuplicado(nombre: string): Observable<boolean> {
    const url = `${this.apiUrl}/existe-nombre?nombre=${nombre}`;
    return this.http.get<boolean>(url);
  }

  editarPeriodo(id: number, periodo: Periodo): Observable<Periodo> {
    return this.http.put<Periodo>(`${this.apiUrl}/${id}`, periodo);
  }

  cambiarEstadoPeriodo(id: number, estado: boolean): Observable<Periodo> {
    const url = `${this.apiUrl}/${id}/estado?estado=${estado}`;
    return this.http.patch<Periodo>(url, null);
  }

  eliminarPeriodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
