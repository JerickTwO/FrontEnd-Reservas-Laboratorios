import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Horario } from 'src/app/models/horario.model';
import { Laboratorio } from 'src/app/models/laboratorio.model'; // Importar el modelo de laboratorio
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class HorarioService {
  private apiUrl = `${environment.urlBase}/horarios`;
  private laboratorioApiUrl = `${environment.urlBase}/laboratorios`;


  constructor(private http: HttpClient) {}

  // Obtener todos los horarios
  obtenerHorarios(): Observable<Horario[]> {
    return this.http.get<Horario[]>(this.apiUrl);
  }

  // Crear un nuevo horario
  crearHorario(horario: Horario): Observable<Horario> {
    return this.http.post<Horario>(this.apiUrl, horario);
  }

  // Actualizar un horario existente
  actualizarHorario(horario: Horario): Observable<Horario> {
    return this.http.put<Horario>(`${this.apiUrl}/${horario.idHorario}`, horario);
  }

  // Obtener todos los laboratorios
  getLaboratorios(): Observable<Laboratorio[]> {
    return this.http.get<Laboratorio[]>(this.laboratorioApiUrl);
  }

  // Obtener un laboratorio por ID
  getLaboratorioById(id: number): Observable<Laboratorio> {
    return this.http.get<Laboratorio>(`${this.laboratorioApiUrl}/${id}`);
  }

  // Crear un nuevo laboratorio (si es necesario)
  crearLaboratorio(laboratorio: Laboratorio): Observable<Laboratorio> {
    return this.http.post<Laboratorio>(this.laboratorioApiUrl, laboratorio);
  }

  // Actualizar un laboratorio existente (si es necesario)
  actualizarLaboratorio(laboratorio: Laboratorio): Observable<Laboratorio> {
    return this.http.put<Laboratorio>(`${this.laboratorioApiUrl}/${laboratorio.idLaboratorio}`, laboratorio);
  }
}
