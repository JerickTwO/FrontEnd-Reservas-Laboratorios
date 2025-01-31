
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = `${environment.urlBase}/dashboard`;

  constructor(private http: HttpClient) { }

  getTotalLaboratorios(): Observable<{ total: number }> {
    return this.http.get<{ total: number }>(`${this.apiUrl}/laboratorios/total`);
  }

  getReservasHoy(): Observable<{ hoy: number }> {
    return this.http.get<{ hoy: number }>(`${this.apiUrl}/reservas/hoy`);
  }

  getTotalUsuarios(): Observable<{ registrados: number }> {
    return this.http.get<{ registrados: number }>(`${this.apiUrl}/usuarios/total`);
  }
}
