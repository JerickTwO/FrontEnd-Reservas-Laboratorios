import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClasesService } from 'src/app/core/services/clases.service';
import { HorarioService } from 'src/app/core/services/horario.service';
import { LaboratorioService } from 'src/app/core/services/laboratorio.service';
import { Clase } from 'src/app/models/clase.model';
import { HorarioReservas } from 'src/app/models/horarioReservas.model';
import { Laboratorio, DiaEnum } from 'src/app/models/laboratorio.model';

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './horarios.component.html',
  styleUrl: './horarios.component.scss'
})
export class Horario1Component implements OnInit {
  laboratorios: Laboratorio[];
  horas: string[] = [];
  dias: DiaEnum[] = [];
  numeroHorario: number;
  horariosReservas: HorarioReservas[] = [];
  numero2 = 2;
  constructor(private horarioService: HorarioService, private laboratorioService: LaboratorioService, private claseService: ClasesService) { }

  ngOnInit(): void {
    this.cargarLaboratorios();
    this.cargarReservasHorario();
  }

  cargarReservasHorario(): void {
    this.horarioService.obtenerClasesReservas().subscribe(
      (data) => {
        this.horariosReservas = data;
        console.log('Horarios con reservas:', data);
      },
      (error) => {
        console.error('Error al cargar los horarios con reservas:', error);
      }
    );
  }
  cargarLaboratorios(): void {
    this.laboratorioService.getLaboratorios().subscribe(
      (data) => {
        this.laboratorios = data;
        this.horas = this.laboratorios[0].franjasHorario;
        this.dias = Object.keys(DiaEnum).filter(key => isNaN(Number(key))).map(key => DiaEnum[key as keyof typeof DiaEnum]);
      },
      (error) => {
        console.error('Error al cargar los laboratorios:', error);
      }
    );
  }// Método para obtener la reserva que inicia en el horario dado
  obtenerReservaInicio(dia: string, hora: string): any {
    return this.horariosReservas.find(reserva => {
      const inicioBackend = reserva.horaInicio.substring(0, 5); // "07:00"
      const diaBackend = (reserva.dia || '').toUpperCase();
      // Comparamos el inicio de la reserva con el inicio del intervalo (por ejemplo, "07:00" de "07:00-08:00")
      return diaBackend === dia && inicioBackend === hora.substring(0, 5);
    });
  }

  // Método para verificar si el slot actual es parte de una reserva ya iniciada en un horario anterior
  isReservaContinuacion(dia: string, hora: string): boolean {
    return this.horariosReservas.some(reserva => {
      const diaBackend = (reserva.dia || '').toUpperCase();
      if (diaBackend !== dia) return false;
      const inicio = reserva.horaInicio.substring(0, 5);
      const fin = reserva.horaFin.substring(0, 5);
      const current = hora.substring(0, 5);
      // Si el horario actual es mayor que el inicio y menor que el fin, es parte de la misma reserva
      return current > inicio && current < fin;
    });
  }

  // Método para calcular el rowspan según la diferencia de horas entre horaInicio y horaFin
  getReservaRowspan(reserva: any): number {
    // Se asume que las franjas son de 1 hora
    const horaInicio = parseInt(reserva.horaInicio.substring(0, 2), 10);
    const horaFin = parseInt(reserva.horaFin.substring(0, 2), 10);
    return horaFin - horaInicio;
  }

  obtenerReservasEnHorario(dia: string, hora: string): any {
    const [horaInicioTabla, horaFinTabla] = hora.split('-');
    return this.horariosReservas.find((reserva) => {
      const inicioBackend = reserva?.horaInicio?.substring(0, 5); // "07:00"
      const finBackend = reserva?.horaFin?.substring(0, 5);       // "09:00"
      const diaBackend = (reserva?.dia || '').toUpperCase();      // "LUNES", "MARTES", etc.

      return (
        diaBackend === dia &&
        inicioBackend === horaInicioTabla &&
        finBackend === horaFinTabla
      );
    });
  }
}
