import { CommonModule } from '@angular/common';
import { Component, OnInit, ValueSansProvider } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HorarioService } from 'src/app/core/services/horario.service';
import { LaboratorioService } from 'src/app/core/services/laboratorio.service';
import { Horario } from 'src/app/models/horario.model';
import { DiaEnum, Laboratorio } from 'src/app/models/laboratorio.model';

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
  dias: DiaEnum[] = [];
  horarios: Horario[] = [];
  constructor(private horarioService: HorarioService, private laboratorioService: LaboratorioService) { }

  ngOnInit(): void {
    this.cargarHorarios();
    this.cargarLaboratorios();
  }

  cargarHorarios(): void {
    const horarioEstatico = [
      // LUNES
      {
        idHorario: 1,
        reserva: {
          idReserva: 1,
          materia: "Sistemas de Base de Datos",
          nombreCompleto: "Paulo Galarza",
          correo: "paulo.galarza@docente.com",
          telefono: "0987654321",
          laboratorio: {
            idLaboratorio: 4,
            nombreLaboratorio: "LAB-04",
            ubicacion: "BLOQUE D",
            capacidad: 20,
            franjasHorario: [
              "07:00-09:00",
              "09:00-11:00",
              "11:00-13:00",
              "13:00-15:00"
            ],
            diasHorario: ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES"]
          },
          horaInicio: "07:00:00",
          horaFin: "09:00:00",
          dia: DiaEnum.LUNES,
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          estado: "APROBADA",
          ocupacionLaboral: ''

        }
      },
      {
        idHorario: 2,
        reserva: {
          idReserva: 2,
          materia: "Programacion Orientada a Objetos",
          nombreCompleto: "Hector Revelo",
          correo: "hector.revelo@docente.com",
          telefono: "0987654321",
          laboratorio: {
            idLaboratorio: 4,
            nombreLaboratorio: "LAB-04",
            ubicacion: "BLOQUE D",
            capacidad: 20,
            franjasHorario: [
              "07:00-09:00",
              "09:00-11:00",
              "11:00-13:00",
              "13:00-15:00"
            ],
            diasHorario: ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES"]
          },
          horaInicio: "09:00:00",
          horaFin: "11:00:00",
          dia: DiaEnum.LUNES,
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          estado: "APROBADA",
          ocupacionLaboral: ''

        }
      },
      {
        idHorario: 3,
        reserva: {
          idReserva: 3,
          materia: "Aplicaciones de Sistemas Operativos",
          nombreCompleto: "Luis Castillo",
          correo: "luis.castillo@docente.com",
          telefono: "0987654321",
          laboratorio: {
            idLaboratorio: 4,
            nombreLaboratorio: "LAB-04",
            ubicacion: "BLOQUE D",
            capacidad: 20,
            franjasHorario: [
              "07:00-09:00",
              "09:00-11:00",
              "11:00-13:00",
              "13:00-15:00"
            ],
            diasHorario: ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES"]
          },
          horaInicio: "11:00:00",
          horaFin: "13:00:00",
          dia: DiaEnum.LUNES,
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          estado: "APROBADA",
          ocupacionLaboral: ''

        }
      },

      // MARTES
      {
        idHorario: 4,
        reserva: {
          idReserva: 4,
          materia: "Interfaces y Multimedia",
          nombreCompleto: "Luis Ortiz",
          correo: "luis.ortiz@docente.com",
          telefono: "0987654321",
          laboratorio: {
            idLaboratorio: 4,
            nombreLaboratorio: "LAB-04",
            ubicacion: "BLOQUE D",
            capacidad: 20,
            franjasHorario: [
              "07:00-09:00",
              "09:00-11:00",
              "11:00-13:00",
              "13:00-15:00"
            ],
            diasHorario: ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES"]
          },
          horaInicio: "09:00:00",
          horaFin: "11:00:00",
          dia: DiaEnum.MARTES,
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          estado: "APROBADA",
          ocupacionLaboral: ''

        }
      },
      {
        idHorario: 5,
        reserva: {
          idReserva: 5,
          materia: "Modelados Discretos",
          nombreCompleto: "Pablo Puente",
          correo: "pablo.puente@docente.com",
          telefono: "0987654321",
          laboratorio: {
            idLaboratorio: 4,
            nombreLaboratorio: "LAB-04",
            ubicacion: "BLOQUE D",
            capacidad: 20,
            franjasHorario: [
              "07:00-09:00",
              "09:00-11:00",
              "11:00-13:00",
              "13:00-15:00"
            ],
            diasHorario: ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES"]
          },
          horaInicio: "11:00:00",
          horaFin: "13:00:00",
          dia: DiaEnum.MARTES,
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          estado: "APROBADA",
          ocupacionLaboral: ''

        }
      },

      // MIÉRCOLES
      {
        idHorario: 6,
        reserva: {
          idReserva: 6,
          materia: "Sistemas de Base de Datos",
          nombreCompleto: "Paulo Galarza",
          correo: "paulo.galarza@docente.com",
          telefono: "0987654321",
          laboratorio: {
            idLaboratorio: 4,
            nombreLaboratorio: "LAB-04",
            ubicacion: "BLOQUE D",
            capacidad: 20,
            franjasHorario: [
              "07:00-09:00",
              "09:00-11:00",
              "11:00-13:00",
              "13:00-15:00"
            ],
            diasHorario: ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES"]
          },
          horaInicio: "07:00:00",
          horaFin: "09:00:00",
          dia: DiaEnum.MIERCOLES,
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          estado: "APROBADA",
          ocupacionLaboral: ''

        }
      },
      {
        idHorario: 8,
        reserva: {
          idReserva: 8,
          materia: "Internetworking",
          nombreCompleto: "Javier Cevallos",
          correo: "javier.cevallos@docente.com",
          telefono: "0987654321",
          laboratorio: {
            idLaboratorio: 4,
            nombreLaboratorio: "LAB-04",
            ubicacion: "BLOQUE D",
            capacidad: 20,
            franjasHorario: [
              "07:00-09:00",
              "09:00-11:00",
              "11:00-13:00",
              "13:00-15:00"
            ],
            diasHorario: ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES"]
          },
          horaInicio: "09:00:00",
          horaFin: "11:00:00",
          dia: DiaEnum.MIERCOLES,
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          estado: "APROBADA",
          ocupacionLaboral: ''

        }
      },
      {
        idHorario: 9,
        reserva: {
          idReserva: 9,
          materia: "Modelados Discretos",
          nombreCompleto: "Pablo Puente",
          correo: "pablo.puente@docente.com",
          telefono: "0987654321",
          laboratorio: {
            idLaboratorio: 4,
            nombreLaboratorio: "LAB-04",
            ubicacion: "BLOQUE D",
            capacidad: 20,
            franjasHorario: [
              "07:00-09:00",
              "09:00-11:00",
              "11:00-13:00",
              "13:00-15:00"
            ],
            diasHorario: ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES"]
          },
          horaInicio: "11:00:00",
          horaFin: "13:00:00",
          dia: DiaEnum.MIERCOLES,
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          estado: "APROBADA",
          ocupacionLaboral: ''

        }
      },

      // JUEVES
      {
        idHorario: 10,
        reserva: {
          idReserva: 10,
          materia: "Programacion Orientada a Objetos",
          nombreCompleto: "Hector Revelo",
          correo: "hector.revelo@docente.com",
          telefono: "0987654321",
          laboratorio: {
            idLaboratorio: 4,
            nombreLaboratorio: "LAB-04",
            ubicacion: "BLOQUE D",
            capacidad: 20,
            franjasHorario: [
              "07:00-09:00",
              "09:00-11:00",
              "11:00-13:00",
              "13:00-15:00"
            ],
            diasHorario: ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES"]
          },
          horaInicio: "11:00:00",
          horaFin: "13:00:00",
          dia: DiaEnum.JUEVES,
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          estado: "APROBADA",
          ocupacionLaboral: ''

        }
      },

      // VIERNES
      {
        idHorario: 11,
        reserva: {
          idReserva: 11,
          materia: "Aplicaciones de Sistemas Operativos",
          nombreCompleto: "Luis Castillo",
          correo: "luis.castillo@docente.com",
          telefono: "0987654321",
          laboratorio: {
            idLaboratorio: 4,
            nombreLaboratorio: "LAB-04",
            ubicacion: "BLOQUE D",
            capacidad: 20,
            franjasHorario: [
              "07:00-09:00",
              "09:00-11:00",
              "11:00-13:00",
              "13:00-15:00"
            ],
            diasHorario: ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES"]
          },
          horaInicio: "07:00:00",
          horaFin: "09:00:00",
          dia: DiaEnum.VIERNES,
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          estado: "APROBADA",
          ocupacionLaboral: ''

        }
      },
      {
        idHorario: 12,
        reserva: {
          idReserva: 12,
          materia: "Aplicaciones Distribuidas",
          nombreCompleto: "Veronica Martinez",
          correo: "veronica.martinez@docente.com",
          telefono: "0987654321",
          laboratorio: {
            idLaboratorio: 4,
            nombreLaboratorio: "LAB-04",
            ubicacion: "BLOQUE D",
            capacidad: 20,
            franjasHorario: [
              "07:00-09:00",
              "09:00-11:00",
              "11:00-13:00",
              "13:00-15:00"
            ],
            diasHorario: ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES"]
          },
          horaInicio: "09:00:00",
          horaFin: "11:00:00",
          dia: DiaEnum.VIERNES,
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          estado: "APROBADA",
          ocupacionLaboral: ''
        }
      },
      {
        idHorario: 13,
        reserva: {
          idReserva: 13,
          materia: "Programacion Orientada a Objetos",
          nombreCompleto: "Hector Revelo",
          correo: "hector.revelo@docente.com",
          telefono: "0987654321",
          laboratorio: {
            idLaboratorio: 4,
            nombreLaboratorio: "LAB-04",
            ubicacion: "BLOQUE D",
            capacidad: 20,
            franjasHorario: [
              "07:00-09:00",
              "09:00-11:00",
              "11:00-13:00",
              "13:00-15:00"
            ],
            diasHorario: ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES"]
          },
          horaInicio: "11:00:00",
          horaFin: "13:00:00",
          dia: DiaEnum.VIERNES,
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          estado: "APROBADA",
          ocupacionLaboral: ''
        }
      }
    ];
    this.horarioService.obtenerHorariosConReservaAprobada().subscribe(
      (data) => {
        this.horarios = data.filter(horario => horario?.reserva?.laboratorio.idLaboratorio === 1);
        console.log('Horarios con reservas aprobadas:', this.horarios);
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
        this.horas = this.laboratorios[0].franjasHorario;
        this.dias =        this.dias = Object.keys(DiaEnum).filter(key => isNaN(Number(key))).map(key => DiaEnum[key as keyof typeof DiaEnum]);

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
