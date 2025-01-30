
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reserva } from 'src/app/models/reserva.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root', 
})
export class ReservaService {
  private apiUrl = `${environment.urlBase}/reservas`;

  constructor(private http: HttpClient) { }

  getReservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.apiUrl);
  }


  // Obtener un laboratorio por ID
  getReservaById(id: number): Observable<Reserva> {
    return this.http.get<Reserva>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo laboratorio
  createReserva(laboratorio: Reserva): Observable<Reserva> {
    return this.http.post<Reserva>(this.apiUrl, laboratorio);
  }

  // Actualizar un laboratorio existente
  updateReserva(id: number, laboratorio: Reserva): Observable<Reserva> {
    return this.http.put<Reserva>(`${this.apiUrl}/${id}`, laboratorio);
  }

  // Eliminar un laboratorio por ID
  deleteReserva(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Buscar laboratorios
  buscarReservas(query: string): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.apiUrl}/buscar?query=${query}`);
  }
}
