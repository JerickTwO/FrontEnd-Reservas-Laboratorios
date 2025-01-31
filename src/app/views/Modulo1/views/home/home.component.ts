import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { AlertService } from 'src/app/core/services/alerts.service';
import { ReservaService } from 'src/app/core/services/reserva.service';
import { LaboratorioService } from 'src/app/core/services/laboratorio.service';
import { CarreraService } from 'src/app/core/services/carrera.service';
import { DepartamentoService } from 'src/app/core/services/departamento.service';
import { DocenteService } from 'src/app/core/services/docente.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: []
})
export class HomeComponent implements OnInit {

  totalReservasPendientes: number = 0; // Reemplazado por reservas pendientes
  totalLaboratorios: number = 0; // Reemplazado por laboratorios
  totalDocentes: number = 0;
  totalDepartamentos: number = 0;
  totalCarreras: number = 0;

  reservasRecientes: any[] = []; // Reemplazado por reservas recientes

  constructor(
    private alertService: AlertService,
    private reservaService: ReservaService,
    private laboratorioService: LaboratorioService,
    private docenteService: DocenteService,
    private departamentoService: DepartamentoService,
    private carreraService: CarreraService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.reservaService.getReservas().subscribe((data) => {
      this.totalReservasPendientes = data.filter((reserva) => reserva.estado === 'PENDIENTE').length;
      this.reservasRecientes = data.slice(0, 5); // Las 5 reservas más recientes
    });

    this.laboratorioService.getLaboratorios().subscribe((data) => {
      this.totalLaboratorios = data.length;
    });

    this.docenteService.getDocentes().subscribe((data) => {
      this.totalDocentes = data.length;
    });

    this.departamentoService.getDepartamentos().subscribe((data) => {
      this.totalDepartamentos = data.length;
    });

    this.carreraService.getCarreras().subscribe((data) => {
      this.totalCarreras = data.length;
    });
  }
}
