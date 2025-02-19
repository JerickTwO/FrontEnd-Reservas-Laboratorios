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
export class Horario4Component implements OnInit {
  laboratorios: Laboratorio[];
  horas: string[] = [];
  dias: string[] = [];
  horarios: Horario[] = [];
  constructor(private horarioService: HorarioService, private laboratorioService: LaboratorioService) { }

  ngOnInit(): void {
    this.cargarHorarios();
    this.cargarLaboratorios();
  }

  cargarHorarios(): void {
    this.horarios = [
      // LUNES 07:00-09:00 - Sistema de Base de Datos
      {
        idHorario: 1,
        reserva: {
          idReserva: 1,
          materia: "Sistema de Base de Datos",
          nombreCompleto: "paulo galarza",
          correo: "paulo.galarza@docente.com",
          telefono: "0987654321",
          ocupacionLaboral: "",
          laboratorio: {
            idLaboratorio: 4,
            nombreLaboratorio: "LAB-04",
            ubicacion: "BLOQUE D",
            capacidad: 20,
            franjasHorario: [
              "07:00-09:00",
              "09:00-11:00",
              "11:00-13:00",
              "13:30-15:30"
            ],
            diasHorario: [
              "LUNES",
              "MARTES",
              "MIERCOLES",
              "JUEVES",
              "VIERNES"
            ]
          },
          horaInicio: "07:00:00",
          horaFin: "09:00:00",
          dia: "LUNES",
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          requerimientosTecnicos: "Ninguno",
          estado: "APROBADA"
        }
      },
      // MIERCOLES 11:00-13:00 - Internetworking
      {
        idHorario: 2,
        reserva: {
          idReserva: 2,
          materia: "Internetworking",
          nombreCompleto: "andres castillo",
          correo: "andres.castillo@docente.com",
          telefono: "0987654321",
          ocupacionLaboral: "",
          laboratorio: {
            idLaboratorio: 4,
            nombreLaboratorio: "LAB-04",
            ubicacion: "BLOQUE D",
            capacidad: 20,
            franjasHorario: [
              "07:00-09:00",
              "09:00-11:00",
              "11:00-13:00",
              "13:30-15:30"
            ],
            diasHorario: [
              "LUNES",
              "MARTES",
              "MIERCOLES",
              "JUEVES",
              "VIERNES"
            ]
          },
          horaInicio: "11:00:00",
          horaFin: "13:00:00",
          dia: "MIERCOLES",
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          requerimientosTecnicos: "Ninguno",
          estado: "APROBADA"
        }
      },
      // MIERCOLES 13:30-15:30 - Modelos Discretos
      {
        idHorario: 3,
        reserva: {
          idReserva: 3,
          materia: "Modelos Discretos",
          nombreCompleto: "pablo puente",
          correo: "pablo.puente@docente.com",
          telefono: "0987654321",
          ocupacionLaboral: "",
          laboratorio: {
            idLaboratorio: 4,
            nombreLaboratorio: "LAB-04",
            ubicacion: "BLOQUE D",
            capacidad: 20,
            franjasHorario: [
              "07:00-09:00",
              "09:00-11:00",
              "11:00-13:00",
              "13:30-15:30"
            ],
            diasHorario: [
              "LUNES",
              "MARTES",
              "MIERCOLES",
              "JUEVES",
              "VIERNES"
            ]
          },
          horaInicio: "13:30:00",
          horaFin: "15:30:00",
          dia: "MIERCOLES",
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          requerimientosTecnicos: "Ninguno",
          estado: "APROBADA"
        }
      },
      // JUEVES 13:30-15:30 - Programación Orientada a Objetos
      {
        idHorario: 4,
        reserva: {
          idReserva: 4,
          materia: "Programacion Orientada a Objetos",
          nombreCompleto: "hector revelo",
          correo: "hector.revelo@docente.com",
          telefono: "0987654321",
          ocupacionLaboral: "",
          laboratorio: {
            idLaboratorio: 4,
            nombreLaboratorio: "LAB-04",
            ubicacion: "BLOQUE D",
            capacidad: 20,
            franjasHorario: [
              "07:00-09:00",
              "09:00-11:00",
              "11:00-13:00",
              "13:30-15:30"
            ],
            diasHorario: [
              "LUNES",
              "MARTES",
              "MIERCOLES",
              "JUEVES",
              "VIERNES"
            ]
          },
          horaInicio: "13:30:00",
          horaFin: "15:30:00",
          dia: "JUEVES",
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          requerimientosTecnicos: "Ninguno",
          estado: "APROBADA"
        }
      },
      // VIERNES 07:00-09:00 - Aplicaciones de Sistemas Operativos
      {
        idHorario: 5,
        reserva: {
          idReserva: 5,
          materia: "Aplicaciones de Sistemas Operativos",
          nombreCompleto: "luis castillo",
          correo: "luis.castillo@docente.com",
          telefono: "0987654321",
          ocupacionLaboral: "",
          laboratorio: {
            idLaboratorio: 4,
            nombreLaboratorio: "LAB-04",
            ubicacion: "BLOQUE D",
            capacidad: 20,
            franjasHorario: [
              "07:00-09:00",
              "09:00-11:00",
              "11:00-13:00",
              "13:30-15:30"
            ],
            diasHorario: [
              "LUNES",
              "MARTES",
              "MIERCOLES",
              "JUEVES",
              "VIERNES"
            ]
          },
          horaInicio: "07:00:00",
          horaFin: "09:00:00",
          dia: "VIERNES",
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          requerimientosTecnicos: "Ninguno",
          estado: "APROBADA"
        }
      }
    ];
  }


  // cargarHorarios(): void {
  //   this.horarioService.obtenerHorariosConReservaAprobada().subscribe(
  //     (data) => {
  //       this.horarios = data.filter(horario => horario?.reserva?.laboratorio.idLaboratorio === 1);
  //       console.log('Horarios con reservas aprobadas:', this.horarios);
  //     },
  //     (error) => {
  //       console.error('Error al cargar los horarios:', error);
  //     }
  //   );
  // }

  cargarLaboratorios(): void {
    this.laboratorioService.getLaboratorios().subscribe(
      (data) => {
        this.laboratorios = data;
        this.horas = this.laboratorios[0].franjasHorario;
        this.dias = this.laboratorios[0].diasHorario;
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
