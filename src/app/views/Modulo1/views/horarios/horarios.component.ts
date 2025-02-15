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
  dias: string[] = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES'];
  horas: string[] = ['07:00-09:00', '09:00-11:00', '11:00-13:00', '13:30-15:30'];
  horarios: Horario[] = [];
  reservas: Reserva[] = []; // Nueva lista para reservas
  constructor(
    private horarioService: HorarioService,
  ) { }

  ngOnInit(): void {
    this.cargarHorariosAprobados();
  }
  cargarHorariosAprobados(): void {
    this.horarioService.obtenerHorariosConReservaAprobada().subscribe(
      (data: Horario[]) => {
        this.horarios = data;
        console.log(this.horarios)
      },
      (error: any) => {
        console.error('Error al cargar los horarios:', error);
      }
    );
  }
}
