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
export class Horario5Component implements OnInit {
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
      // LUNES 07:00-09:00 - Metodología de Desarrollo de Software
      {
        idHorario: 1,
        reserva: {
          idReserva: 1,
          materia: "Metodología de Desarrollo de Software",
          nombreCompleto: "edwin camino",
          correo: "edwin.camino@docente.com",
          telefono: "0987654321",
          ocupacionLaboral: "",
          laboratorio: {
            idLaboratorio: 5,
            nombreLaboratorio: "LAB-05",
            ubicacion: "BLOQUE E",
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
          horaInicio: "07:00",
          horaFin: "09:00",
          dia: "LUNES",
          motivoReserva: "CLASES",
          cantidadParticipantes: 10,
          requerimientosTecnicos: "Ninguno",
          estado: "APROBADA"
        }
      },
      // LUNES 13:30-15:30 - Sistemas Operativos
      {
        idHorario: 2,
        reserva: {
          idReserva: 2,
          materia: "Fundamentos de Sistemas",
          nombreCompleto: "edwin camino",
          correo: "edwin.camino@docente.com",
          telefono: "0987654321",
          ocupacionLaboral: "",
          laboratorio: {
            idLaboratorio: 5,
            nombreLaboratorio: "LAB-05",
            ubicacion: "BLOQUE E",
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
          horaInicio: "09:00",
          horaFin: "11:00",
          dia: "LUNES",
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          requerimientosTecnicos: "Ninguno",
          estado: "APROBADA"
        }
      },
      // LUNES 13:30-15:30 - Sistemas Operativos
      {
        idHorario: 2,
        reserva: {
          idReserva: 2,
          materia: "Sistemas Operativos",
          nombreCompleto: "luis ortiz",
          correo: "luis.ortiz@docente.com",
          telefono: "0987654321",
          ocupacionLaboral: "",
          laboratorio: {
            idLaboratorio: 5,
            nombreLaboratorio: "LAB-05",
            ubicacion: "BLOQUE E",
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
          horaInicio: "11:00",
          horaFin: "13:00",
          dia: "LUNES",
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          requerimientosTecnicos: "Ninguno",
          estado: "APROBADA"
        }
      },
      // MARTES 09:00-11:00 - Gestión de Base de Datos
      {
        idHorario: 3,
        reserva: {
          idReserva: 3,
          materia: "Gestion de Base de Datos",
          nombreCompleto: "pablo puente",
          correo: "pablo.puente@docente.com",
          telefono: "0987654321",
          ocupacionLaboral: "",
          laboratorio: {
            idLaboratorio: 5,
            nombreLaboratorio: "LAB-05",
            ubicacion: "BLOQUE E",
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
          horaInicio: "07:00",
          horaFin: "09:00",
          dia: "MARTES",
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          requerimientosTecnicos: "Ninguno",
          estado: "APROBADA"
        }
      },
      // MARTES 11:00-13:00 - Modelados Avanzados de Base de Datos
      {
        idHorario: 4,
        reserva: {
          idReserva: 4,
          materia: "Modelados de Base de Datos",
          nombreCompleto: "edwin camino",
          correo: "edwin.camino@docente.com",
          telefono: "0987654321",
          ocupacionLaboral: "",
          laboratorio: {
            idLaboratorio: 5,
            nombreLaboratorio: "LAB-05",
            ubicacion: "BLOQUE E",
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
          horaInicio: "09:00",
          horaFin: "11:00",
          dia: "MARTES",
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          requerimientosTecnicos: "Ninguno",
          estado: "APROBADA"
        }
      },
      // MARTES 11:00-13:00 - Modelados Avanzados de Base de Datos
      {
        idHorario: 4,
        reserva: {
          idReserva: 4,
          materia: "Programacion Integrativa de Componentes",
          nombreCompleto: "luis castillo",
          correo: "luis.castillo@docente.com",
          telefono: "0987654321",
          ocupacionLaboral: "",
          laboratorio: {
            idLaboratorio: 5,
            nombreLaboratorio: "LAB-05",
            ubicacion: "BLOQUE E",
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
          horaInicio: "11:00",
          horaFin: "13:00",
          dia: "MARTES",
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          requerimientosTecnicos: "Ninguno",
          estado: "APROBADA"
        }
      },
      // MIÉRCOLES 07:00-09:00 - Metodología de Desarrollo de Software
      {
        idHorario: 5,
        reserva: {
          idReserva: 5,
          materia: "Metodología de Desarrollo de Software",
          nombreCompleto: "edwin camino",
          correo: "edwin.camino@docente.com",
          telefono: "0987654321",
          ocupacionLaboral: "",
          laboratorio: {
            idLaboratorio: 5,
            nombreLaboratorio: "LAB-05",
            ubicacion: "BLOQUE E",
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
          horaInicio: "07:00",
          horaFin: "09:00",
          dia: "MIERCOLES",
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          requerimientosTecnicos: "Ninguno",
          estado: "APROBADA"
        }
      },
      // JUEVES 13:30-15:30 - Programación Integrativa de Componentes
      {
        idHorario: 6,
        reserva: {
          idReserva: 6,
          materia: "Fundamentos de Sistemas",
          nombreCompleto: "edwin camino",
          correo: "edwin.camino@docente.com",
          telefono: "0987654321",
          ocupacionLaboral: "",
          laboratorio: {
            idLaboratorio: 5,
            nombreLaboratorio: "LAB-05",
            ubicacion: "BLOQUE E",
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
          horaInicio: "07:00",
          horaFin: "09:00",
          dia: "JUEVES",
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          requerimientosTecnicos: "Ninguno",
          estado: "APROBADA"
        }
      },
      // JUEVES 13:30-15:30 - Programación Integrativa de Componentes
      {
        idHorario: 6,
        reserva: {
          idReserva: 6,
          materia: "Programacion Integrativa de Componentes",
          nombreCompleto: "edwin camino",
          correo: "edwin.camino@docente.com",
          telefono: "0987654321",
          ocupacionLaboral: "",
          laboratorio: {
            idLaboratorio: 5,
            nombreLaboratorio: "LAB-05",
            ubicacion: "BLOQUE E",
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
          horaInicio: "09:00",
          horaFin: "11:00",
          dia: "JUEVES",
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          requerimientosTecnicos: "Ninguno",
          estado: "APROBADA"
        }
      },
      // VIERNES 09:00-11:00 - Fundamentos de Sistemas
      {
        idHorario: 7,
        reserva: {
          idReserva: 7,
          materia: "Desarollo web para la Integración",
          nombreCompleto: "edwin camino",
          correo: "edwin.camino@docente.com",
          telefono: "0987654321",
          ocupacionLaboral: "",
          laboratorio: {
            idLaboratorio: 5,
            nombreLaboratorio: "LAB-05",
            ubicacion: "BLOQUE E",
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
          horaInicio: "09:00",
          horaFin: "11:00",
          dia: "MIERCOLES",
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          requerimientosTecnicos: "Ninguno",
          estado: "APROBADA"
        }
      },
      // VIERNES 11:00-13:00 - Interfaces y Multimedia
      {
        idHorario: 8,
        reserva: {
          idReserva: 8,
          materia: "Interfaces y Multimedia",
          nombreCompleto: "javier cevallos",
          correo: "javier.cevallos@docente.com",
          telefono: "0987654321",
          ocupacionLaboral: "",
          laboratorio: {
            idLaboratorio: 5,
            nombreLaboratorio: "LAB-05",
            ubicacion: "BLOQUE E",
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
          horaInicio: "09:00",
          horaFin: "11:00",
          dia: "VIERNES",
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          requerimientosTecnicos: "Ninguno",
          estado: "APROBADA"
        }
      },
      {
        idHorario: 1,
        reserva: {
          idReserva: 1,
          materia: "Metodología de Desarrollo de Software",
          nombreCompleto: "edwin camino",
          correo: "edwin.camino@docente.com",
          telefono: "0987654321",
          ocupacionLaboral: "",
          laboratorio: {
            idLaboratorio: 5,
            nombreLaboratorio: "LAB-05",
            ubicacion: "BLOQUE E",
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
          horaInicio: "07:00",
          horaFin: "09:00",
          dia: "VIERNES",
          motivoReserva: "CLASES",
          cantidadParticipantes: 10,
          requerimientosTecnicos: "Ninguno",
          estado: "APROBADA"
        }
      },
    ];
  }


  // cargarHorarios(): void {
  //   this.horarioService.obtenerHorariosConReservaAprobada().subscribe(
  //     (data) => {
  //       this.horarios = data.filter(horario => horario?.reserva?.laboratorio.idLaboratorio === 5);
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
      // Los horarios del backend suelen venir "07:00". Cortamos a los primeros 5 caracteres: "07:00"
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
