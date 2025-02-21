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
export class Horario6Component implements OnInit {
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
    this.horarios = [
      {
        idHorario: 1,
        reserva: {
          idReserva: 1,
          materia: "Lectura de Textos Académicos",
          nombreCompleto: "Diego Salazar",
          correo: "diego.salazar@docente.com",
          telefono: "0987654321",
          ocupacionLaboral: "",
          laboratorio: {
            idLaboratorio: 6,
            nombreLaboratorio: "LAB-06",
            ubicacion: "BLOQUE F",
            capacidad: 20,
            franjasHorario: [
              "07:00-09:00",
              "09:00-11:00",
              "11:00-13:00",
              "13:00-15:00"
            ],
            diasHorario: [DiaEnum.LUNES, DiaEnum.MARTES, DiaEnum.MIERCOLES, DiaEnum.JUEVES, DiaEnum.VIERNES]
          },
          horaInicio: "09:00",
          horaFin: "11:00",
          dia: DiaEnum.LUNES,
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          requerimientosTecnicos: "",
          estado: "APROBADA"
        }
      },
      // MARTES 09:00-11:00 - Administración y Mantenimientos de Sistemas
      {
        idHorario: 1,
        reserva: {
          idReserva: 1,
          materia: "Administracion y Mantenimientos de Sistemas",
          nombreCompleto: "Hector Revelo",
          correo: "hector.revelo@docente.com",
          telefono: "0987654321",
          ocupacionLaboral: "",
          laboratorio: {
            idLaboratorio: 6,
            nombreLaboratorio: "LAB-06",
            ubicacion: "BLOQUE F",
            capacidad: 20,
            franjasHorario: [
              "07:00-09:00",
              "09:00-11:00",
              "11:00-13:00",
              "13:00-15:00"
            ],
            diasHorario: [DiaEnum.LUNES, DiaEnum.MARTES, DiaEnum.MIERCOLES, DiaEnum.JUEVES, DiaEnum.VIERNES]
          },
          horaInicio: "07:00:00",
          horaFin: "09:00:00",
          dia: DiaEnum.MARTES,
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          requerimientosTecnicos: "",
          estado: "APROBADA"
        }
      },
      {
        idHorario: 1,
        reserva: {
          idReserva: 1,
          materia: "Aplicaciones de Tecnologías Web",
          nombreCompleto: "Luis Castillo",
          correo: "luis.castillo@docente.com",
          telefono: "0987654321",
          ocupacionLaboral: "",
          laboratorio: {
            idLaboratorio: 6,
            nombreLaboratorio: "LAB-06",
            ubicacion: "BLOQUE F",
            capacidad: 20,
            franjasHorario: [
              "07:00-09:00",
              "09:00-11:00",
              "11:00-13:00",
              "13:00-15:00"
            ],
            diasHorario: [DiaEnum.LUNES, DiaEnum.MARTES, DiaEnum.MIERCOLES, DiaEnum.JUEVES, DiaEnum.VIERNES]
          },
          horaInicio: "09:00:00",
          horaFin: "11:00:00",
          dia: DiaEnum.MARTES,
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          requerimientosTecnicos: "",
          estado: "APROBADA"
        }
      },
      // MIÉRCOLES 09:00-11:00 - Fundamentos de Sistemas Web
      {
        idHorario: 2,
        reserva: {
          idReserva: 2,
          materia: "Fundamentos de Sistemas Web",
          nombreCompleto: "Edwin Camino",
          correo: "edwin.camino@docente.com",
          telefono: "0987654321",
          ocupacionLaboral: "",
          laboratorio: {
            idLaboratorio: 6,
            nombreLaboratorio: "LAB-06",
            ubicacion: "BLOQUE F",
            capacidad: 20,
            franjasHorario: [
              "07:00-09:00",
              "09:00-11:00",
              "11:00-13:00",
              "13:00-15:00"
            ],
            diasHorario: [DiaEnum.LUNES, DiaEnum.MARTES, DiaEnum.MIERCOLES, DiaEnum.JUEVES, DiaEnum.VIERNES]
          },
          horaInicio: "09:00:00",
          horaFin: "11:00:00",
          dia: DiaEnum.MIERCOLES,
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          requerimientosTecnicos: "",
          estado: "APROBADA"
        }
      },
      // MIÉRCOLES 13:00-15:00 - Aplicaciones de Sistemas Operativo
      {
        idHorario: 3,
        reserva: {
          idReserva: 3,
          materia: "Aplicaciones de Sistemas Operativo",
          nombreCompleto: "Paulo Galarza",
          correo: "paulo.galarza@docente.com",
          telefono: "0987654321",
          ocupacionLaboral: "",
          laboratorio: {
            idLaboratorio: 6,
            nombreLaboratorio: "LAB-06",
            ubicacion: "BLOQUE F",
            capacidad: 20,
            franjasHorario: [
              "07:00-09:00",
              "09:00-11:00",
              "11:00-13:00",
              "13:00-15:00"
            ],
            diasHorario: [DiaEnum.LUNES, DiaEnum.MARTES, DiaEnum.MIERCOLES, DiaEnum.JUEVES, DiaEnum.VIERNES]
          },
          horaInicio: "11:00:00",
          horaFin: "13:00:00",
          dia: DiaEnum.MIERCOLES,
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          requerimientosTecnicos: "",
          estado: "APROBADA"
        }
      },
      // JUEVES 07:00-09:00 - Administración y Mantenimientos de Sistemas
      {
        idHorario: 4,
        reserva: {
          idReserva: 4,
          materia: "Administracion y Mantenimientos de Sistemas",
          nombreCompleto: "Hector Revelo",
          correo: "hector.revelo@docente.com",
          telefono: "0987654321",
          ocupacionLaboral: "",
          laboratorio: {
            idLaboratorio: 6,
            nombreLaboratorio: "LAB-06",
            ubicacion: "BLOQUE F",
            capacidad: 20,
            franjasHorario: [
              "07:00-09:00",
              "09:00-11:00",
              "11:00-13:00",
              "13:00-15:00"
            ],
            diasHorario: [DiaEnum.LUNES, DiaEnum.MARTES, DiaEnum.MIERCOLES, DiaEnum.JUEVES, DiaEnum.VIERNES]
          },
          horaInicio: "07:00:00",
          horaFin: "09:00:00",
          dia: DiaEnum.JUEVES,
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          requerimientosTecnicos: "",
          estado: "APROBADA"
        }
      },
      // JUEVES 13:00-15:00 - Gestión de Base de Datos
      {
        idHorario: 5,
        reserva: {
          idReserva: 5,
          materia: "Gestion de Base de Datos",
          nombreCompleto: "Pablo Puente",
          correo: "pablo.puente@docente.com",
          telefono: "0987654321",
          ocupacionLaboral: "",
          laboratorio: {
            idLaboratorio: 6,
            nombreLaboratorio: "LAB-06",
            ubicacion: "BLOQUE F",
            capacidad: 20,
            franjasHorario: [
              "07:00-09:00",
              "09:00-11:00",
              "11:00-13:00",
              "13:00-15:00"
            ],
            diasHorario: [DiaEnum.LUNES, DiaEnum.MARTES, DiaEnum.MIERCOLES, DiaEnum.JUEVES, DiaEnum.VIERNES]
          },
          horaInicio: "11:00:00",
          horaFin: "13:00:00",
          dia: DiaEnum.JUEVES,
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          requerimientosTecnicos: "",
          estado: "APROBADA"
        }
      },
      {
        idHorario: 5,
        reserva: {
          idReserva: 5,
          materia: "Gestion de Base de Datos",
          nombreCompleto: "Pablo Puente",
          correo: "pablo.puente@docente.com",
          telefono: "0987654321",
          ocupacionLaboral: "",
          laboratorio: {
            idLaboratorio: 6,
            nombreLaboratorio: "LAB-06",
            ubicacion: "BLOQUE F",
            capacidad: 20,
            franjasHorario: [
              "07:00-09:00",
              "09:00-11:00",
              "11:00-13:00",
              "13:00-15:00"
            ],
            diasHorario: [DiaEnum.LUNES, DiaEnum.MARTES, DiaEnum.MIERCOLES, DiaEnum.JUEVES, DiaEnum.VIERNES]
          },
          horaInicio: "11:00:00",
          horaFin: "13:00:00",
          dia: DiaEnum.VIERNES,
          motivoReserva: "CLASES",
          cantidadParticipantes: 20,
          requerimientosTecnicos: "",
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
