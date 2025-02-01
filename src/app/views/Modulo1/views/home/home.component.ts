import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
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
  totalReservasPendientes: number = 0;
  totalLaboratorios: number = 0;
  totalDocentes: number = 0;
  totalDepartamentos: number = 0;
  totalCarreras: number = 0;

  cards = [
    { icon: 'bx-calendar', color: 'blue', title: 'Reservas Pendientes', count: () => this.totalReservasPendientes },
    { icon: 'bx-chalkboard', color: 'red', title: 'Docentes', count: () => this.totalDocentes },
    { icon: 'bx-book', color: 'purple', title: 'Carreras', count: () => this.totalCarreras },
    { icon: 'bx-building', color: 'yellow', title: 'Departamentos', count: () => this.totalDepartamentos },
    { icon: 'bxs-flask', color: 'green', title: 'Laboratorios', count: () => this.totalLaboratorios }
  ];

  constructor(
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
