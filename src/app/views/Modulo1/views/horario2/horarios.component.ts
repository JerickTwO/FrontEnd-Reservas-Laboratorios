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
export class Horario2Component implements OnInit {
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
    const horarioEstatico = [
      // LUNES 07:00-09:00 - Computación Digital
      {
        idHorario: 1,
        reserva: {
          idReserva: 1,
          materia: "Computacion Digital",
          nombreCompleto: "german rodriguez",
          correo: "german.rodriguez@docente.com",
          telefono: "0987654321",
          ocupacionLaboral: "",
          laboratorio: {
            idLaboratorio: 2,
            nombreLaboratorio: "LAB-02",
            ubicacion: "BLOQUE B",
            capacidad: 20,
            franjasHorario: [
              "07:00-09:00",
              "09:00-11:00",
              "11:00-13:00",
              "13:00-15:00"
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
          dia: "LUNES" as "LUNES",
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          requerimientosTecnicos: "Ninguno",
          estado: "APROBADA"
        }
      },
      // MIERCOLES 07:00-09:00 - Computación Digital
      {
        idHorario: 2,
        reserva: {
          idReserva: 2,
          materia: "Computacion Digital",
          nombreCompleto: "german rodriguez",
          correo: "german.rodriguez@docente.com",
          telefono: "0987654321",
          ocupacionLaboral: "",
          laboratorio: {
            idLaboratorio: 2,
            nombreLaboratorio: "LAB-02",
            ubicacion: "BLOQUE B",
            capacidad: 20,
            franjasHorario: [
              "07:00-09:00",
              "09:00-11:00",
              "11:00-13:00",
              "13:00-15:00"
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
          dia: "MIERCOLES" as "MIERCOLES",
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          requerimientosTecnicos: "Ninguno",
          estado: "APROBADA"
        }
      },
      // VIERNES 07:00-09:00 - Sistema de Base de Datos
      {
        idHorario: 3,
        reserva: {
          idReserva: 3,
          materia: "Sistema de Base de Datos",
          nombreCompleto: "christian coronel",
          correo: "christian.coronel@docente.com",
          telefono: "0987654321",
          ocupacionLaboral: "",
          laboratorio: {
            idLaboratorio: 2,
            nombreLaboratorio: "LAB-02",
            ubicacion: "BLOQUE B",
            capacidad: 20,
            franjasHorario: [
              "07:00-09:00",
              "09:00-11:00",
              "11:00-13:00",
              "13:00-15:00"
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
          dia: "VIERNES" as "VIERNES",
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          requerimientosTecnicos: "Ninguno",
          estado: "APROBADA"
        }
      },
      // LUNES 09:00-11:00 - Estructura de Datos
      {
        idHorario: 4,
        reserva: {
          idReserva: 4,
          materia: "Estructura de Datos",
          nombreCompleto: "margoth garcia",
          correo: "margoth.garcia@docente.com",
          telefono: "0987654321",
          ocupacionLaboral: "",
          laboratorio: {
            idLaboratorio: 2,
            nombreLaboratorio: "LAB-02",
            ubicacion: "BLOQUE B",
            capacidad: 20,
            franjasHorario: [
              "07:00-09:00",
              "09:00-11:00",
              "11:00-13:00",
              "13:00-15:00"
            ],
            diasHorario: [
              "LUNES",
              "MARTES",
              "MIERCOLES",
              "JUEVES",
              "VIERNES"
            ]
          },
          horaInicio: "09:00:00",
          horaFin: "11:00:00",
          dia: "LUNES",
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          requerimientosTecnicos: "Ninguno",
          estado: "APROBADA"
        }
      },
      // MARTES 09:00-11:00 - Fundamentos de Programación
      {
        idHorario: 5,
        reserva: {
          idReserva: 5,
          materia: "Fundamentos de Programacion",
          nombreCompleto: "veronica martinez",
          correo: "veronica.martinez@docente.com",
          telefono: "0987654321",
          ocupacionLaboral: "",
          laboratorio: {
            idLaboratorio: 2,
            nombreLaboratorio: "LAB-02",
            ubicacion: "BLOQUE B",
            capacidad: 20,
            franjasHorario: [
              "07:00-09:00",
              "09:00-11:00",
              "11:00-13:00",
              "13:00-15:00"
            ],
            diasHorario: [
              "LUNES",
              "MARTES",
              "MIERCOLES",
              "JUEVES",
              "VIERNES"
            ]
          },
          horaInicio: "09:00:00",
          horaFin: "11:00:00",
          dia: "MARTES" as "MARTES",
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          requerimientosTecnicos: "Ninguno",
          estado: "APROBADA"
        }
      },
      // LUNES 11:00-13:00 - Inteligencia Artificial
      {
        idHorario: 6,
        reserva: {
          idReserva: 6,
          materia: "Inteligencia Artificial",
          nombreCompleto: "diego benavides",
          correo: "diego.benavides@docente.com",
          telefono: "0987654321",
          ocupacionLaboral: "",
          laboratorio: {
            idLaboratorio: 2,
            nombreLaboratorio: "LAB-02",
            ubicacion: "BLOQUE B",
            capacidad: 20,
            franjasHorario: [
              "07:00-09:00",
              "09:00-11:00",
              "11:00-13:00",
              "13:00-15:00"
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
          dia: "LUNES",
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          requerimientosTecnicos: "Ninguno",
          estado: "APROBADA"
        }
      },
      // MARTES 11:00-13:00 - Minería de Datos
      {
        idHorario: 7,
        reserva: {
          idReserva: 7,
          materia: "Mineria de Datos",
          nombreCompleto: "jose benavides",
          correo: "jose.benavides@docente.com",
          telefono: "0987654321",
          ocupacionLaboral: "",
          laboratorio: {
            idLaboratorio: 2,
            nombreLaboratorio: "LAB-02",
            ubicacion: "BLOQUE B",
            capacidad: 20,
            franjasHorario: [
              "07:00-09:00",
              "09:00-11:00",
              "11:00-13:00",
              "13:00-15:00"
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
          dia: "MARTES",
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          requerimientosTecnicos: "Ninguno",
          estado: "APROBADA"
        }
      },
      // MIERCOLES 11:00-13:00 - Inteligencia Artificial
      {
        idHorario: 8,
        reserva: {
          idReserva: 8,
          materia: "Inteligencia Artificial",
          nombreCompleto: "diego benavides",
          correo: "diego.benavides@docente.com",
          telefono: "0987654321",
          ocupacionLaboral: "",
          laboratorio: {
            idLaboratorio: 2,
            nombreLaboratorio: "LAB-02",
            ubicacion: "BLOQUE B",
            capacidad: 20,
            franjasHorario: [
              "07:00-09:00",
              "09:00-11:00",
              "11:00-13:00",
              "13:00-15:00"
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
      // LUNES 13:00-15:00 - Desarrollo Web para Integración
      {
        idHorario: 9,
        reserva: {
          idReserva: 9,
          materia: "Desarrollo Web para Integracion",
          nombreCompleto: "pablo puente",
          correo: "pablo.puente@docente.com",
          telefono: "0987654321",
          ocupacionLaboral: "",
          laboratorio: {
            idLaboratorio: 2,
            nombreLaboratorio: "LAB-02",
            ubicacion: "BLOQUE B",
            capacidad: 20,
            franjasHorario: [
              "07:00-09:00",
              "09:00-11:00",
              "11:00-13:00",
              "13:00-15:00"
            ],
            diasHorario: [
              "LUNES",
              "MARTES",
              "MIERCOLES",
              "JUEVES",
              "VIERNES"
            ]
          },
          horaInicio: "13:00:00",
          horaFin: "15:00:00",
          dia: "LUNES",
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          requerimientosTecnicos: "Ninguno",
          estado: "APROBADA"
        }
      }
    ];
    this.horarioService.obtenerHorariosConReservaAprobada().subscribe(
      (data) => {
        const horariosBackend = data.filter(horario => horario?.reserva?.laboratorio.idLaboratorio === 2);
        this.horarios = [...horarioEstatico as Horario[], ...horariosBackend];
        console.log('Horarios combinados:', horariosBackend);
        console.log('Horarios combinados:', this.horarios);
      },
      (error) => {
        console.error('Error al cargar los horarios:', error);
      }
    );
  }

  // cargarHorarios(): void {
  //   this.horarioService.obtenerHorariosConReservaAprobada().subscribe(
  //     (data) => {
  //       this.horarios = data.filter(horario => horario?.reserva?.laboratorio.idLaboratorio === 2);
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
