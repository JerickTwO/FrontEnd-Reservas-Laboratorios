import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HorarioService } from 'src/app/core/services/horario.service';
import { LaboratorioService } from 'src/app/core/services/laboratorio.service';
import { PeriodoService } from 'src/app/core/services/periodo.service';
import { HorarioReservas } from 'src/app/models/horarioReservas.model';
import { Laboratorio, DiaEnum } from 'src/app/models/laboratorio.model';
import { Periodo } from 'src/app/models/periodo.model';
import { ReservaService } from 'src/app/core/services/reserva.service';
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';
import { Reserva } from 'src/app/models/reserva.model';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './horarios.component.html',
  styleUrl: '../horario1/horarios.component.scss',
})
export class Horario3Component implements OnInit {
  laboratorios: Laboratorio[];
  horas: string[] = [];
  dias: DiaEnum[] = [];
  periodoActivo: Periodo | null = null;
  numeroHorario: number;
  nuevaReserva: Reserva = this.resetNuevaReservaData();
  isEditing: boolean = false;
  franjasHorario: any;
  modalReserva: any;
  numeroLaboratorio: number = 3;
  horariosReservas: HorarioReservas[] = [];
  userRole: string | undefined;
  public isSaving: boolean = false;

  public franjasPermitidas: { horaInicio: string; horaFin: string }[] = [];
  constructor(
    private horarioService: HorarioService,
    private periodoService: PeriodoService,
    private reservaService: ReservaService,
    private laboratorioService: LaboratorioService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.cargarReservasHorario();
    this.obtenerPeriodoActivo();
    this.getLaboratorios();
    this.modalReserva = new Modal(document.getElementById(`modalReserva${this.numeroLaboratorio}`)!, {
      backdrop: 'static',
    });

    document
      .getElementById(`modalReserva${this.numeroLaboratorio}`)
      ?.addEventListener('hidden.bs.modal', () => {
        this.cerrarModal();
      });
    this.usuarioService.usuario$.subscribe((usuario) => {
      if (usuario) {
        this.userRole = usuario.rol.nombre;
      }
    });
  }

  getLaboratorios(): void {
    this.laboratorioService.getLaboratorios().subscribe({
      next: (data) => {
        this.laboratorios = data;

        if (this.laboratorios.length > 0) {
          this.franjasPermitidas = this.laboratorios[0].franjasHorario.map(
            (franja: string) => {
              const [horaInicio, horaFin] = franja.split('-');
              return { horaInicio, horaFin };
            }
          );

          this.horas = this.laboratorios[0].franjasHorario;
          this.dias = Object.keys(DiaEnum)
            .filter((key) => isNaN(Number(key)))
            .map((key) => DiaEnum[key as keyof typeof DiaEnum]);
        }
      },
      error: (err) => console.error('Error al cargar los laboratorios:', err),
    });
  }
  obtenerPeriodoActivo(): void {
    this.periodoService.getPeriodoActivo().subscribe(
      (data) => {
        this.periodoActivo = data;
      },
      (error) => {
        console.error('Error al cargar el periodo activo:', error);
      }
    );
  }
  cargarReservasHorario(): void {
    this.horarioService.obtenerClasesReservas().subscribe(
      (data) => {
        this.horariosReservas = data.filter((reserva: HorarioReservas) => reserva.laboratorio.idLaboratorio === this.numeroLaboratorio);
      },
      (error) => {
        console.error('Error al cargar los horarios con reservas:', error);
      }
    );
  }

  obtenerReservaInicio(dia: string, hora: string): any {
    return this.horariosReservas.find((reserva) => {
      const inicioBackend = reserva.horaInicio.substring(0, 5);
      const diaBackend = (reserva.dia || '').toUpperCase();
      return diaBackend === dia && inicioBackend === hora.substring(0, 5);
    });
  }
  isReservaContinuacion(dia: string, hora: string): boolean {
    return this.horariosReservas.some((reserva) => {
      const diaBackend = (reserva.dia || '').toUpperCase();
      if (diaBackend !== dia) return false;
      const inicio = reserva.horaInicio.substring(0, 5);
      const fin = reserva.horaFin.substring(0, 5);
      const current = hora.substring(0, 5);
      return current > inicio && current < fin;
    });
  }

  getReservaRowspan(reserva: any): number {
    const horaInicio = parseInt(reserva.horaInicio.substring(0, 2), 10);
    const horaFin = parseInt(reserva.horaFin.substring(0, 2), 10);
    return horaFin - horaInicio;
  }

  obtenerReservasEnHorario(dia: string, hora: string): any {
    const [horaInicioTabla, horaFinTabla] = hora.split('-');
    return this.horariosReservas.find((reserva) => {
      const inicioBackend = reserva?.horaInicio?.substring(0, 5);
      const finBackend = reserva?.horaFin?.substring(0, 5);
      const diaBackend = (reserva?.dia || '').toUpperCase();

      return (
        diaBackend === dia &&
        inicioBackend === horaInicioTabla &&
        finBackend === horaFinTabla
      );
    });
  }
  public resetNuevaReservaData(): Reserva {
    return {
      idReserva: 0,
      nombreCompleto: '',
      correo: '',
      dia: DiaEnum.LUNES,
      telefono: '',
      ocupacionLaboral: '',
      laboratorio: {
        idLaboratorio: 0,
        nombreLaboratorio: '',
        ubicacion: '',
        capacidad: 0,
        franjasHorario: [],
        diasHorario: [],
      },
      periodo: new Periodo(),
      horaInicio: '',
      horaFin: '',
      motivoReserva: '',
      cantidadParticipantes: 0,
      requerimientosTecnicos: '',
      estado: 'PENDIENTE',
    };
  }

  guardarReserva(): void {
    this.isSaving = true;

    this.nuevaReserva.laboratorio.idLaboratorio = this.numeroLaboratorio;

    const selectedLab = this.laboratorios.find(
      (lab) => lab.idLaboratorio === this.numeroLaboratorio
    );
    if (!selectedLab) {
      Swal.fire('Error', `Laboratorio ${this.numeroLaboratorio} no encontrado.`, 'error');
      this.isSaving = false
      return;
    }

    if (this.nuevaReserva.cantidadParticipantes > selectedLab.capacidad) {
      Swal.fire(
        'Error',
        'La cantidad de participantes excede la capacidad del laboratorio.',
        'error'
      );
      this.isSaving = false
      return;
    }

    const [startHourStr, startMinStr] = this.nuevaReserva.horaInicio.split(':');
    const [endHourStr, endMinStr] = this.nuevaReserva.horaFin.split(':');

    const startHour = parseInt(startHourStr, 10);
    const startMin = parseInt(startMinStr || '0', 10);
    const endHour = parseInt(endHourStr, 10);
    const endMin = parseInt(endMinStr || '0', 10);

    const diffHours = endHour - startHour;
    const diffMinutes = endMin - startMin;
    if (diffHours !== 1 || diffMinutes !== 0) {
      Swal.fire(
        'Error',
        'La reserva debe tener exactamente 1 hora de diferencia (por ej. 07:00-08:00).',
        'error'
      );
      this.isSaving = false;
      return;
    }

    const existeReservaDuplicada = this.horariosReservas.some((reserva) => {
      return (
        reserva.laboratorio.idLaboratorio === this.numeroLaboratorio &&
        reserva.dia === this.nuevaReserva.dia &&
        reserva.horaInicio === this.nuevaReserva.horaInicio &&
        reserva.horaFin === this.nuevaReserva.horaFin &&
        (!this.isEditing || reserva.id !== this.nuevaReserva.idReserva)
      );
    });
    if (existeReservaDuplicada) {
      Swal.fire(
        'Error',
        'Ya existe una reserva para este laboratorio, día y horario.',
        'error'
      );
      this.isSaving = false;
      return;
    }

    this.nuevaReserva.horaInicio = this.formatTime(this.nuevaReserva.horaInicio);
    this.nuevaReserva.horaFin = this.formatTime(this.nuevaReserva.horaFin);

    if (this.isEditing) {
      if (!this.nuevaReserva.idReserva) {
        console.error('ID inválido para actualizar la reserva.');
        this.isSaving = false;
        return;
      }
      this.reservaService
        .actualizarReserva(this.nuevaReserva.idReserva, this.nuevaReserva)
        .subscribe({
          next: () => {
            Swal.fire(
              'Reserva Actualizada',
              'La reserva se actualizó correctamente.',
              'success'
            );
            this.cargarReservasHorario();
            this.cerrarModal();
            this.isSaving = false;
          },
          error: () => {
            Swal.fire('Error', 'No se pudo actualizar la reserva.', 'error');
            this.isSaving = false;
          }
        });
    } else {
      this.reservaService.crearReserva(this.nuevaReserva).subscribe({
        next: () => {
          Swal.fire('Reserva Creada', 'La reserva se creó correctamente.', 'success');
          this.cargarReservasHorario();
          this.cerrarModal();
          this.isSaving = false;
        },
        error: () => {
          Swal.fire('Error', 'No se pudo crear la reserva.', 'error');
          this.isSaving = false;
        }
      });
    }
  }
  private formatTime(hour: string): string {
    if (hour && !hour.includes(':')) {
      return `${hour}:00`;
    }
    return hour;
  }
  abrirModal(): void {
    this.isEditing = false;
    this.nuevaReserva = this.resetNuevaReservaData();
    this.modalReserva.show();
  }

  cerrarModal(): void {
    this.modalReserva.hide();
    document.body.classList.remove('modal-open');
    this.isEditing = false;
    this.nuevaReserva = this.resetNuevaReservaData();
  }
}
