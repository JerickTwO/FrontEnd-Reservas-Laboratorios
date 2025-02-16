import { CommonModule } from '@angular/common';
import { Component, OnInit, ValueSansProvider } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HorarioService } from 'src/app/core/services/horario.service';
import { ReservaService } from 'src/app/core/services/reserva.service';
import { Horario } from 'src/app/models/horario.model';
import { Reserva } from 'src/app/models/reserva.model';

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './horarios.component.html',
  styleUrl: './horarios.component.scss'
})
export class HorariosComponent implements OnInit {
  dias: string[] = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'];
  horas: string[] = ['07:00-09:00', '09:00-11:00', '11:00-13:00', '13:30-15:30'];
  horarios: any[] = []; // Arreglo para los horarios y las reservas

  constructor(private horarioService: HorarioService) {}

  ngOnInit(): void {
    this.cargarHorarios();
  }

  cargarHorarios(): void {
    this.horarioService.obtenerHorariosConReservaAprobada().subscribe(
      (data) => {
        this.horarios = data;
        console.log('Horarios con reservas aprobadas:', this.horarios);
      },
      (error) => {
        console.error('Error al cargar los horarios:', error);
      }
    );
  }

  obtenerReservaEnHorario(dia: string, hora: string): any {
    // "hora" viene en formato "HH:mm-HH:mm" (p. ej. "07:00-09:00").
    const [horaInicioTabla, horaFinTabla] = hora.split('-'); 
    // horaInicioTabla = "07:00", horaFinTabla = "09:00"

    // Buscamos en this.horarios un objeto que coincida en día y en las horas
    return this.horarios.find((horario) => {
      // Los horarios del backend suelen venir "07:00:00". Cortamos a los primeros 5 caracteres: "07:00"
      const inicioBackend = horario?.reserva.horaInicio?.substring(0, 5); // "07:00"
      const finBackend = horario?.reserva.horaFin?.substring(0, 5);       // "09:00"
      const diaBackend = (horario?.reserva.dia || '').toUpperCase();      // "LUNES", "MARTES", etc.

      return (
        diaBackend === dia && 
        inicioBackend === horaInicioTabla && 
        finBackend === horaFinTabla
      );
    });
  }
}
