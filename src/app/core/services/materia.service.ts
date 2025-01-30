import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Materia } from 'src/app/models/materia.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class MateriaService {
  private apiUrl = `${environment.urlBase}/materias`;

  constructor(private http: HttpClient) {}

  getMaterias(): Observable<Materia[]> {
    return this.http.get<Materia[]>(this.apiUrl);
  }

  getMateriaById(id: number): Observable<Materia> {
    return this.http.get<Materia>(`${this.apiUrl}/${id}`);
  }

  createMateria(materia: Materia): Observable<Materia> {
    return this.http.post<Materia>(this.apiUrl, materia);
  }

  updateMateria(id: number, materia: Materia): Observable<Materia> {
    return this.http.put<Materia>(`${this.apiUrl}/${id}`, materia);
  }

  deleteMateria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
