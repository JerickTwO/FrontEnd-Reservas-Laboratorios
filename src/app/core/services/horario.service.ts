import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError, map } from 'rxjs';
import { Horario } from 'src/app/models/horario.model';
import { DiaEnum, Laboratorio } from 'src/app/models/laboratorio.model';
import { environment } from 'src/environments/environment.development';
import { HorarioReservas } from 'src/app/models/horarioReservas.model';

@Injectable({
  providedIn: 'root',
})
export class HorarioService {
  private readonly HorarioApiUrl = `${environment.urlBase}/horarios`;
  private readonly laboratorioApiUrl = `${environment.urlBase}/laboratorios`;

  constructor(private http: HttpClient) {}

  obtenerClasesReservas(): Observable<HorarioReservas[]> {
    return this.http
      .get<HorarioReservas[]>(`${this.HorarioApiUrl}/clases-reservas`)
      .pipe(catchError(this.handleError));
  }

  obtenerHorarios(): Observable<{
    respuesta: boolean;
    codigoHttp: number;
    mensaje: string;
    resultado: Horario[];
    detalleError: any;
  }> {
    return this.http
      .get<{
        respuesta: boolean;
        codigoHttp: number;
        mensaje: string;
        resultado: Horario[];
        detalleError: any;
      }>(this.HorarioApiUrl)
      .pipe(catchError(this.handleError));
  }
  crearHorario(horario: Horario): Observable<Horario> {
    return this.http
      .post<Horario>(this.HorarioApiUrl, horario)
      .pipe(catchError(this.handleError));
  }

  actualizarHorario(horario: Horario): Observable<Horario> {
    return this.http
      .put<Horario>(`${this.HorarioApiUrl}/${horario.idHorario}`, horario)
      .pipe(catchError(this.handleError));
  }

  getLaboratorios(): Observable<Laboratorio[]> {
    return this.http
      .get<Laboratorio[]>(this.laboratorioApiUrl)
      .pipe(catchError(this.handleError));
  }

  getLaboratorioById(id: number): Observable<Laboratorio> {
    return this.http
      .get<Laboratorio>(`${this.laboratorioApiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  crearLaboratorio(laboratorio: Laboratorio): Observable<Laboratorio> {
    return this.http
      .post<Laboratorio>(this.laboratorioApiUrl, laboratorio)
      .pipe(catchError(this.handleError));
  }

  actualizarLaboratorio(laboratorio: Laboratorio): Observable<Laboratorio> {
    return this.http
      .put<Laboratorio>(
        `${this.laboratorioApiUrl}/${laboratorio.idLaboratorio}`,
        laboratorio
      )
      .pipe(catchError(this.handleError));
  }

  obtenerHorariosConReservaAprobada(): Observable<Horario[]> {
    return this.http
      .get<Horario[]>(`${this.HorarioApiUrl}/aprobadas`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error('Error al comunicarse con el servidor.'));
  }
}
