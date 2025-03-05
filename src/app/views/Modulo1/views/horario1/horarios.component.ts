import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
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
import { Horario } from 'src/app/models/horario.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './horarios.component.html',
  styleUrl: './horarios.component.scss',
})
export class Horario1Component implements OnInit {
  horario: Horario[] = [];
  laboratorio: Laboratorio = new Laboratorio();
  horas: string[] = [];
  dias: DiaEnum[] = [];
  periodoActivo: Periodo | null = null;
  numeroHorario: number;
  nuevaReserva: Reserva = this.resetNuevaReservaData();
  isEditing: boolean = false;
  franjasHorario: any;
  modalReserva: any;
  horariosReservas: HorarioReservas[] = [];
  userRole: string | undefined;
  public isSaving: boolean = false;
  numeroLaboratorio: number;
  minDate: string;
  maxDate: string;
  public franjasPermitidas: { horaInicio: string; horaFin: string }[] = [];
  constructor(
    private horarioService: HorarioService,
    private periodoService: PeriodoService,
    private reservaService: ReservaService,
    private laboratorioService: LaboratorioService,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    this.maxDate = maxDate.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.numeroLaboratorio = +id;
        this.getLaboratorios();
        this.cargarReservasHorario();
        this.obtenerPeriodoActivo();
        this.getHorario();
      }
    });
    this.horas = this.generarHoras('09:00');
  }

  ngAfterViewInit(): void {
    const idModal = 'modalReserva' + this.numeroLaboratorio;
    // Si por ej. numeroLaboratorio = 3 --> "modalReserva3"

    const modalElement = document.getElementById(idModal);
    if (modalElement) {
      this.modalReserva = new Modal(modalElement, { backdrop: 'static' });
      modalElement.addEventListener('hidden.bs.modal', () => {
        this.cerrarModal();
      });
    }
  }
  getHorario(): void {
    this.horarioService.obtenerHorarios().subscribe({
      next: (data) => {
        this.horario = data.resultado;
        if (this.horario.length > 0) {
          const firstHorario = this.horario[0];
          this.franjasPermitidas =
            firstHorario.franjasHorario?.map((franja: string) => {
              const [horaInicio, horaFin] = franja.split('-');
              return { horaInicio, horaFin };
            }) || [];

          this.horas = firstHorario.franjasHorario || [];
          this.dias =
            firstHorario.diasHorario?.map(
              (dia: string) => DiaEnum[dia as keyof typeof DiaEnum]
            ) || [];
        }
      },
      error: (err) => console.error('Error al cargar el horario:', err),
    });
  }

  getLaboratorios(): void {
    this.laboratorioService
      .getLaboratorioById(this.numeroLaboratorio)
      .subscribe({
        next: (data) => {
          this.laboratorio = data;
        },
        error: (err) => console.error('Error al cargar el horario:', err),
      });
  }

  actualizarHorario(): void {
    if (!this.nuevaReserva.horaInicio) {
      Swal.fire(
        'Error',
        'Seleccione una hora de inicio para actualizar el horario.',
        'error'
      );
      return;
    }

    // Generar nuevas franjas basadas en la nueva hora de inicio
    const nuevasFranjas = this.generarHoras(this.nuevaReserva.horaInicio);

    const horarioActualizado: Horario = {
      idHorario: this.horario[0]?.idHorario, // Obtener el ID del horario existente
      franjasHorario: nuevasFranjas, // Actualizar las franjas generadas dinámicamente
      diasHorario: this.dias, // Mantener los mismos días
    };

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'El horario se actualizará con los nuevos valores.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar',
      timer: 5000, // 5 segundos
      timerProgressBar: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.horarioService.actualizarHorario(horarioActualizado).subscribe({
          next: (response) => {
            this.getHorario();
            this.horario = [response]; // Actualizar la lista de horarios en el frontend
            Swal.fire(
              'Horario Actualizado',
              'El horario se ha actualizado correctamente en el servidor.',
              'success'
            );
          },
          error: (err) => {
            console.error('Error al actualizar el horario:', err);
            Swal.fire('Error', 'No se pudo actualizar el horario.', 'error');
          },
        });
      } else if (result.dismiss === Swal.DismissReason.timer) {
        Swal.fire('Tiempo agotado', 'No se realizó ningún cambio.', 'info');
      }
    });
  }
  generarHoras(inicio: string): string[] {
    const horas: string[] = [];
    let [hora, minuto] = inicio.split(':').map(Number);

    for (let i = 0; i < 8; i++) {
      // Mantener 8 franjas
      const inicioHora = `${hora.toString().padStart(2, '0')}:${minuto
        .toString()
        .padStart(2, '0')}`;
      hora++;
      const finHora = `${hora.toString().padStart(2, '0')}:${minuto
        .toString()
        .padStart(2, '0')}`;
      horas.push(`${inicioHora}-${finHora}`);
    }

    return horas;
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
        this.horariosReservas = data.filter(
          (reserva: HorarioReservas) =>
            reserva.laboratorio.idLaboratorio === this.numeroLaboratorio
        );
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
    console.log('Hora inicio tabla:', horaInicioTabla);
    console.log('Hora fin tabla:', horaFinTabla);
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
      telefono: '',
      ocupacionLaboral: '',
      laboratorio: {
        idLaboratorio: 0,
        nombreLaboratorio: '',
        ubicacion: '',
        capacidad: 0,
      },
      periodo: new Periodo(),
      horaInicio: '',
      horaFin: '',
      motivoReserva: '',
      cantidadParticipantes: 0,
      requerimientosTecnicos: '',
      estado: 'PENDIENTE',
      fechaReserva: new Date(), // Add this line
    };
  }

  guardarReserva(): void {
    this.isSaving = true;

    this.nuevaReserva.laboratorio.idLaboratorio = this.numeroLaboratorio;

    const selectedLab = this.laboratorio;
    if (!selectedLab) {
      Swal.fire(
        'Error',
        `Laboratorio ${this.numeroLaboratorio} no encontrado.`,
        'error'
      );
      this.isSaving = false;
      return;
    }

    if (this.nuevaReserva.cantidadParticipantes > selectedLab.capacidad) {
      Swal.fire(
        'Error',
        'La cantidad de participantes excede la capacidad del laboratorio.',
        'error'
      );
      this.isSaving = false;
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

    this.nuevaReserva.horaInicio = this.formatTime(
      this.nuevaReserva.horaInicio
    );
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
          },
        });
    } else {
      this.reservaService.crearReserva(this.nuevaReserva).subscribe({
        next: () => {
          Swal.fire(
            'Reserva Creada',
            'La reserva se creó correctamente.',
            'success'
          );
          this.cargarReservasHorario();
          this.cerrarModal();
          this.isSaving = false;
        },
        error: (err) => {
          const errorMessage =
            err.error?.message ||
            err.error?.error ||
            'No se pudo crear la reserva.';
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
          });
          this.isSaving = false;
        },
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
  abrirModalConHorario(dia: string, hora: string): void {
    this.isEditing = false;
    this.nuevaReserva = this.resetNuevaReservaData();
    this.nuevaReserva.dia = dia;
    if (hora.includes('-')) {
      const [horaInicio, horaFin] = hora.split('-');
      this.nuevaReserva.horaInicio = this.formatTime(horaInicio);
      this.nuevaReserva.horaFin = this.formatTime(horaFin);
    } else {
      this.nuevaReserva.horaInicio = this.formatTime(hora);
      const horaInicioNum = parseInt(hora.split(':')[0]);
      const minutos = hora.split(':')[1] || '00';
      const horaFinNum = (horaInicioNum + 1) % 24;
      this.nuevaReserva.horaFin = this.formatTime(`${horaFinNum}:${minutos}`);
    }
    
    this.modalReserva.show();
    
    setTimeout(() => {
      const horaFinInput = document.getElementById('horaFin') as HTMLInputElement;
      if (horaFinInput) {
        horaFinInput.value = this.nuevaReserva.horaFin;
      }
    }, 100);
  }

  cerrarModal(): void {
    this.modalReserva.hide();
    document.body.classList.remove('modal-open');
    this.isEditing = false;
    this.nuevaReserva = this.resetNuevaReservaData();
  }
}
