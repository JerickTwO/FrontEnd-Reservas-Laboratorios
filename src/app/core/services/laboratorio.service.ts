
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Laboratorio } from 'src/app/models/laboratorio.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root', // Esto hace que el servicio sea accesible sin `app.module.ts`
})
export class LaboratorioService {
  private apiUrl = `${environment.urlBase}/laboratorios`;

  constructor(private http: HttpClient) { }

  getLaboratorios(): Observable<Laboratorio[]> {
    return this.http.get<Laboratorio[]>(this.apiUrl);
  }


  // Obtener un laboratorio por ID
  getLaboratorioById(id: number): Observable<Laboratorio> {
    return this.http.get<Laboratorio>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo laboratorio
  createLaboratorio(laboratorio: Laboratorio): Observable<Laboratorio> {
    return this.http.post<Laboratorio>(this.apiUrl, laboratorio);
  }

  // Actualizar un laboratorio existente
  updateLaboratorio(id: number, laboratorio: Laboratorio): Observable<Laboratorio> {
    return this.http.put<Laboratorio>(`${this.apiUrl}/${id}`, laboratorio);
  }

  // Eliminar un laboratorio por ID
  deleteLaboratorio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Buscar laboratorios
  buscarLaboratorios(query: string): Observable<Laboratorio[]> {
    return this.http.get<Laboratorio[]>(`${this.apiUrl}/buscar?query=${query}`);
  }
}
