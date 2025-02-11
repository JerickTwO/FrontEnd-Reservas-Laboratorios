import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Clase } from 'src/app/models/clase.model';

@Injectable({
  providedIn: 'root',
})
export class ClasesService {
  private apiUrl = 'http://localhost:8080/api/v1/clases';

  constructor(private http: HttpClient) {}

  getClases(): Observable<Clase[]> {
    return this.http.get<Clase[]>(this.apiUrl);
  }

  agregarClase(clase: Clase): Observable<Clase> {
    const payload = {
      materia: { idMateria: Number(clase.materia.idMateria) },
      docente: { idDocente: Number(clase.docente.idDocente) },
      periodo: { idPeriodo: Number(clase.periodo.idPeriodo) },
    };
    return this.http.post<Clase>(this.apiUrl, payload);
  }

  editarClase(id: number, clase: Clase): Observable<Clase> {
    const payload = {
      idClase: clase.idClase,
      materia: { idMateria: Number(clase.materia.idMateria) },
      docente: { idDocente: Number(clase.docente.idDocente) },
      periodo: { idPeriodo: Number(clase.periodo.idPeriodo) },
    };
    return this.http.put<Clase>(`${this.apiUrl}/${id}`, payload);
  }

  eliminarClase(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
