import { CommonModule } from '@angular/common';
import { Component, OnInit, ValueSansProvider } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HorarioService } from 'src/app/core/services/horario.service';
import { LaboratorioService } from 'src/app/core/services/laboratorio.service';
import { Horario } from 'src/app/models/horario.model';
import { Laboratorio } from 'src/app/models/laboratorio.model';

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './horarios.component.html',
  styleUrl: './horarios.component.scss'
})
export class HorariosComponent implements OnInit {
  dias: string[] = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'];
  laboratorios:Laboratorio[];
  horaslabO: string[] = [];
  horarios: Horario[] = [];

  constructor(private horarioService: HorarioService,private laboratorioService: LaboratorioService) { }

  ngOnInit(): void {
    this.cargarHorarios();
    this.cargarLaboratorios();
  }

  cargarHorarios(): void {
    this.horarioService.obtenerHorariosConReservaAprobada().subscribe(
      (data) => {
        this.horarios = data;
        console.log('Horarios con horarios aprobadas:', this.horarios);
      },
      (error) => {
        console.error('Error al cargar los horarios:', error);
      }
    );
  }

  cargarLaboratorios(): void {
    this.laboratorioService.getLaboratorios().subscribe(
      (data) => {
        this.laboratorios = data;
        this.horaslabO = this.laboratorios[0].franjasHorario;
        console.log('Horarios con laboratorios aprobadas:', this.laboratorios);
      },
      (error) => {
        console.error('Error al cargar los laboratorios:', error);
      }
    );
  }

  obtenerReservaEnHorario(dia: string, hora: string): any {
    // "hora" viene en formato "HH:mm-HH:mm" (p. ej. "07:00-09:00").
    const [horaInicioTabla, horaFinTabla] = hora.split('-');
    return this.horarios.find((horario) => {
      // Los horarios del backend suelen venir "07:00:00". Cortamos a los primeros 5 caracteres: "07:00"
      const inicioBackend = horario?.reserva?.horaInicio?.substring(0, 5); // "07:00"
      const finBackend = horario?.reserva?.horaFin?.substring(0, 5);       // "09:00"
      const diaBackend = (horario?.reserva?.dia || '').toUpperCase();      // "LUNES", "MARTES", etc.

      return (
        diaBackend === dia &&
        inicioBackend === horaInicioTabla &&
        finBackend === horaFinTabla
      );
    });
  }
}
