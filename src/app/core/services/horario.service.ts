import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HorarioService {
  private apiUrl = 'http://localhost:8080/api/v1/horarios';

  constructor(private http: HttpClient) {}

  obtenerHorarios(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl);
  }

  crearHorario(horario: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.apiUrl, horario, { observe: 'response' });
  }

  actualizarHorario(id: number, horario: any): Observable<HttpResponse<any>> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, horario, { observe: 'response' });
  }

  eliminarHorario(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { observe: 'response' });
  }

  getClases(): Observable<any> {
    return this.http.get('http://localhost:8080/api/v1/clases');
  }

  getLaboratorios(): Observable<any> {
    return this.http.get('http://localhost:8080/api/v1/laboratorios');
  }
}
