import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Reserva } from 'src/app/models/reserva.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ReservaService {
  private baseUrl = `${environment.urlBase}/reservas`;

  constructor(private http: HttpClient) { }

  private get headers() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  listarReservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.baseUrl, this.headers).pipe(
      catchError(this.handleError)
    );
  }

  obtenerReservaPorId(idReserva: number): Observable<Reserva> {
    return this.http.get<Reserva>(`${this.baseUrl}/${idReserva}`, this.headers).pipe(
      catchError(this.handleError)
    );
  }

  crearReserva(reserva: Reserva): Observable<Reserva> {
    const { idReserva, ...reservaSinId } = reserva; // Eliminar el ID si existe
    return this.http.post<Reserva>(this.baseUrl, reservaSinId, this.headers).pipe(
      catchError(this.handleError)
    );
  }

  actualizarReserva(idReserva: number, data: Partial<Reserva>): Observable<Reserva> {
    return this.http.put<Reserva>(`${this.baseUrl}/${idReserva}`, data, this.headers).pipe(
      catchError(this.handleError)
    );
  }
  cambiarEstado(idReserva: number, estado: string): Observable<Reserva> {
    const body = { estado: estado };  // Crear un objeto con la propiedad estado
    return this.http.patch<Reserva>(`${this.baseUrl}/${idReserva}/estado`, body, this.headers).pipe(
      catchError(this.handleError)
    );
  }


  eliminarReserva(idReserva: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${idReserva}`, this.headers).pipe(
      catchError(this.handleError)
    );
  }

  buscarReservas(parametro: string, valor: string): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.baseUrl}?${parametro}=${valor}`, this.headers).pipe(
      catchError(this.handleError)
    );
  }

  enviarNotificacion(idReserva: number, destinatario: string): Observable<void> {
    const url = `${this.baseUrl}/${idReserva}/notificar`;
    return this.http.post<void>(url, { destinatario }, this.headers).pipe(
      catchError(this.handleError)
    );
  }

  verificarDisponibilidad(
    laboratorioId: number,
    horaInicio: string,
    horaFin: string
  ): Observable<boolean> {
    const url = `${this.baseUrl}/disponibilidad`;
    const params = { laboratorioId, horaInicio, horaFin };
    return this.http.get<boolean>(url, { params, ...this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error('Error al comunicarse con el servidor.'));
  }
}
