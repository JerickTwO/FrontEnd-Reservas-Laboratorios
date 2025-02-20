import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { ReservaService } from 'src/app/core/services/reserva.service';
import { LaboratorioService } from 'src/app/core/services/laboratorio.service';
import { CarreraService } from 'src/app/core/services/carrera.service';
import { DepartamentoService } from 'src/app/core/services/departamento.service';
import { DocenteService } from 'src/app/core/services/docente.service';
import 'boxicons';


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
    { icon: 'bx-calendar', color: 'text-blue-600', gradient: 'from-blue-500 to-blue-700  shadow-blue-800/40', title: 'Reservas Pendientes', count: () => this.totalReservasPendientes, link: '/reserva' },
    { icon: 'bx-chalkboard', color: 'text-red-600', gradient: 'from-red-500 to-red-700  shadow-red-800/40', title: 'Docentes', count: () => this.totalDocentes, link: '/docentes' },
    { icon: 'bx-book', color: 'text-purple-600', gradient: 'from-purple-500 to-purple-700  shadow-purple-800/40', title: 'Carreras', count: () => this.totalCarreras, link: '/carreras' },
    { icon: 'bx-building', color: 'text-yellow-600', gradient: 'from-yellow-500 to-yellow-700  shadow-yellow-800/40', title: 'Departamentos', count: () => this.totalDepartamentos, link: '/departamentos' },
    { icon: 'bxs-flask', color: 'text-green-600', gradient: 'from-green-500 to-green-700  shadow-green-800/40', title: 'Laboratorios', count: () => this.totalLaboratorios, link: '/laboratorio' },
  ];

  constructor(
    private reservaService: ReservaService,
    private laboratorioService: LaboratorioService,
    private docenteService: DocenteService,
    private departamentoService: DepartamentoService,
    private carreraService: CarreraService
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.reservaService.listarReservas().subscribe((data) => {
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
