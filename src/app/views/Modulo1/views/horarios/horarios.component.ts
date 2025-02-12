import { Component, OnInit } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { FullCalendarModule } from '@fullcalendar/angular';
import { HorarioService } from 'src/app/core/services/horario.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Horario } from 'src/app/models/horario.model';
import { Clase } from 'src/app/models/clase.model';

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [FormsModule, CommonModule, FullCalendarModule],
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.scss'],
})
export class HorariosComponent implements OnInit {
  franjasPermitidas: { horaInicio: string, horaFin: string }[] = [
    { horaInicio: "07:00", horaFin: "09:00" },
    { horaInicio: "09:00", horaFin: "11:00" },
    { horaInicio: "11:00", horaFin: "13:00" },
    { horaInicio: "13:30", horaFin: "15:30" },
  ];
  dias: string[] = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES'];

  eventos: any[] = [];
  clases: any[] = [];
  laboratorios: { idLaboratorio: number; nombreLaboratorio: string }[] = [];
  modalVisible = false;

  nuevoHorario: Horario = {

    fecha: '',
    dia: '',
    horaInicio: '',
    horaFin: '',
    clase: {
      idClase: 0,
      materia: { idMateria: 0, nombre: '' }
    },
    laboratorio: { idLaboratorio: 0, nombreLaboratorio: '' },
  };



  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    selectable: true,
    editable: true,
    events: [],
    locale: esLocale,
    slotMinTime: '07:00:00',
    slotMaxTime: '15:30:00',
    hiddenDays: [0, 6],
    select: this.abrirModal.bind(this),
    eventClick: this.editarHorario.bind(this),
  };

  constructor(private horarioService: HorarioService) {}

  ngOnInit(): void {
    this.cargarHorarios();
    this.cargarClases();
    this.cargarLaboratorios();
  }

  cargarHorarios(): void {
    this.horarioService.obtenerHorarios().subscribe((horarios: Horario[]) => {
      this.eventos = horarios.map((horario) => ({
        title: `${horario.clase.materia?.nombre || ''} - ${horario.laboratorio?.nombreLaboratorio || ''}`,
        start: `${horario.fecha}T${horario.horaInicio}`,
        end: `${horario.fecha}T${horario.horaFin}`,
        extendedProps: { ...horario },
      }));
      this.calendarOptions.events = this.eventos;
    });
  }

  cargarClases(): void {
    this.horarioService.getClases().subscribe((clases: Clase[]) => {
      this.clases = clases.map((clase: Clase) => ({
        idClase: clase.idClase,
        nombreMostrar: `${clase.materia.nombreMateria} - ${clase.docente.nombreDocente} - ${clase.periodo.nombrePeriodo}`,
        materia: clase.materia,
        docente: clase.docente,
        periodo: clase.periodo
      }));
    });
  }

  cargarLaboratorios(): void {
    this.horarioService.getLaboratorios().subscribe((laboratorios) => {
      this.laboratorios = laboratorios;
    });
  }

  abrirModal(selectInfo: DateSelectArg): void {
    const fechaSeleccionada = selectInfo.start;
    const diaSemana = fechaSeleccionada.toLocaleDateString('es-ES', { weekday: 'long' }).toUpperCase();

    if (diaSemana === 'SÁBADO' || diaSemana === 'DOMINGO') {
      alert('No se pueden registrar horarios en sábados o domingos.');
      return;
    }

    this.nuevoHorario.fecha = fechaSeleccionada.toISOString().split('T')[0];
    this.nuevoHorario.dia = diaSemana;
    this.nuevoHorario.horaInicio = fechaSeleccionada.toISOString().slice(11, 19);
    this.nuevoHorario.horaFin = selectInfo.end.toISOString().slice(11, 19);
    this.modalVisible = true;
  }

  cerrarModal(): void {
    this.modalVisible = false;
    this.nuevoHorario = {
      fecha: '',
      dia: '',
      horaInicio: '',
      horaFin: '',
      clase: {
        idClase: 0,
        materia: { idMateria: 0, nombre: '' } // Se eliminan `docente` y `periodo`
      },
      laboratorio: { idLaboratorio: 0, nombreLaboratorio: '' },
    };
  }


  guardarHorario(): void {
    this.nuevoHorario.dia = this.quitarTildes(this.nuevoHorario.dia);

    this.horarioService.crearHorario(this.nuevoHorario).subscribe(
      () => {
        this.cerrarModal();
        window.location.reload(); // Recargar la página siempre
      },
      () => {
        this.cerrarModal();
        window.location.reload(); // Recargar la página incluso en caso de error
      }
    );
  }

  quitarTildes(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  }

  editarHorario(eventClick: EventClickArg): void {
    const props = eventClick.event.extendedProps; // Extraemos `extendedProps` para acceder más fácilmente

    this.nuevoHorario = {
      id: props['id'], // Usamos corchetes en lugar de la notación de punto
      fecha: props['fecha'],
      dia: props['dia'],
      horaInicio: props['horaInicio'],
      horaFin: props['horaFin'],
      clase: {
        idClase: props['clase']['idClase'],
        materia: props['clase']['materia'],
        docente: props['clase']['docente'],
        periodo: props['clase']['periodo'],
      },
      laboratorio: {
        idLaboratorio: props['laboratorio']['idLaboratorio'],
        nombreLaboratorio: props['laboratorio']['nombreLaboratorio'],
      }
    };

    this.modalVisible = true;
  }




  actualizarHorario(): void {
    if (!this.nuevoHorario.id) {
      console.error("El horario no tiene un ID válido para actualizar.");
      return;
    }

    this.horarioService.actualizarHorario(this.nuevoHorario.id, this.nuevoHorario).subscribe(
      () => {
        this.cerrarModal();
        window.location.reload(); // Recargar la página siempre
      },
      () => {
        this.cerrarModal();
        window.location.reload(); // Recargar la página incluso en caso de error
      }
    );
  }



}
