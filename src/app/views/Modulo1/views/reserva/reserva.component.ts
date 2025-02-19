import { Component, OnInit } from '@angular/core';
import { ReservaService } from 'src/app/core/services/reserva.service';
import { Reserva } from 'src/app/models/reserva.model';
import { Laboratorio } from 'src/app/models/laboratorio.model';
import { Horario } from 'src/app/models/horario.model';
import { LaboratorioService } from 'src/app/core/services/laboratorio.service';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { PaginationComponent } from '../pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Modal } from 'bootstrap';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [PaginationComponent, CommonModule, FormsModule, HttpClientModule],
  styleUrls: ['./reserva.component.scss'],
  templateUrl: './reserva.component.html',
})
export class ReservaComponent implements OnInit {
  reservas: Reserva[] = [];
  laboratorios: Laboratorio[] = [];
  nuevaReserva: Reserva = this.resetNuevaReservaData();
  modalVisible: boolean = false;
  isEditing: boolean = false;
  reservasPaginadas: Reserva[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  modalReserva: any; usuario!: Usuario;
  userRole: string | undefined;


  franjasPermitidas:
    { horaInicio: string, horaFin: string }[] = [
      { horaInicio: "07:00", horaFin: "09:00" },
      { horaInicio: "09:00", horaFin: "11:00" },
      { horaInicio: "11:00", horaFin: "13:00" },
      { horaInicio: "13:30", horaFin: "15:30" },
    ];
  dias: string[] = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'];
  eventos: any[] = [];
  clases: any[] = [];

  constructor(
    private reservaService: ReservaService,
    private laboratorioService: LaboratorioService,
    private paginationService: PaginationService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.getReservas();
    this.modalReserva = new Modal(document.getElementById('modalReserva')!, { backdrop: 'static' });
    this.getLaboratorios();
    document.getElementById('modalReserva')?.addEventListener('hidden.bs.modal', () => {
      this.cerrarModal();
    });
    this.usuarioService.usuario$.subscribe((usuario) => {
      if (usuario) {
        this.userRole = usuario.rol.nombre;
        console.log('Rol del usuario:', this.userRole);
      }
    });
    this.franjasPermitidas = [
      { horaInicio: "07:00", horaFin: "09:00" },
      { horaInicio: "09:00", horaFin: "11:00" },
      { horaInicio: "11:00", horaFin: "13:00" },
      { horaInicio: "13:30", horaFin: "15:30" },
    ];
    this.getReservas();
  }

  getReservas(): void {
    this.reservaService.listarReservas().subscribe({
      next: (data) => {
        this.reservas = data;
        this.totalPages = Math.ceil(this.reservas.length / this.itemsPerPage);
        this.actualizarPaginacion();
        if (this.reservas.length > 0) {
          this.franjasPermitidas = data.map((reserva) => {
            return { horaInicio: reserva.horaInicio, horaFin: reserva.horaFin };
          });
        }
      },
      error: (err) => console.error('Error al cargar las reservas:', err),
    });
  }

  getLaboratorios(): void {
    this.laboratorioService.getLaboratorios().subscribe({
      next: (data) => (this.laboratorios = data),
      error: (err) => console.error('Error al cargar los laboratorios:', err),
    });
  }

  guardarReserva(): void {
    this.nuevaReserva.horaInicio = this.formatTime(this.nuevaReserva.horaInicio);
    this.nuevaReserva.horaFin = this.formatTime(this.nuevaReserva.horaFin);
    console.log(this.franjasPermitidas);


    if (this.isEditing) {
      if (!this.nuevaReserva.idReserva) {
        console.error('ID inválido para actualizar la reserva.');
        return;
      }
      this.reservaService.actualizarReserva(this.nuevaReserva.idReserva, this.nuevaReserva).subscribe({
        next: (reservaActualizada) => {
          console.log('Reserva actualizada:', reservaActualizada);
          this.getReservas();
          this.cerrarModal();
        },
        error: (err) => console.error('Error al actualizar la reserva:', err),
      });
    } else {
      this.reservaService.crearReserva(this.nuevaReserva).subscribe({

        next: (reservaCreada) => {

          console.log('Reserva creada:', reservaCreada);
          this.getReservas();
          this.cerrarModal();
        },
        error: (err) => console.error('Error al crear la reserva:', err),
      });
    }
  }
  cambiarEstadoPendiente(reserva: Reserva): void {
    if (reserva.idReserva === undefined || reserva.idReserva === null) {
      console.error('ID de reserva no definido.');
      Swal.fire('Error', 'No se ha encontrado un ID de reserva válido.', 'error');
      return;
    }

    // Verificar si el estado actual es "PENDIENTE"
    if (reserva.estado !== 'PENDIENTE') {
      console.error('La reserva no está en estado "PENDIENTE".');
      return;
    }

    // Mostrar SweetAlert2 para confirmar la acción
    Swal.fire({
      title: '¿Qué deseas hacer con esta reserva?',
      text: 'Puedes aprobar o rechazar esta reserva.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aprobar',
      cancelButtonText: 'Rechazar',
      showLoaderOnConfirm: true,  // Muestra un cargador cuando se confirme
    }).then((result) => {
      if (result.isConfirmed) {
        reserva.estado = 'APROBADA';
        this.reservaService.actualizarReserva(reserva.idReserva, reserva).subscribe({
          next: () => {
            Swal.fire('Estado actualizado', 'La reserva ha sido aprobada.', 'success');
            this.getReservas();
          },
          error: (err) => {
            Swal.fire('Error', 'No se pudo actualizar el estado.', 'error');
            console.error('Error al cambiar el estado de la reserva:', err);
          },
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Si el usuario cancela, cambiar el estado a "RECHAZADA"
        reserva.estado = 'RECHAZADA';

        // Llamar al servicio para actualizar la reserva en el backend
        this.reservaService.actualizarReserva(reserva.idReserva, reserva).subscribe({
          next: () => {
            Swal.fire('Estado actualizado', 'La reserva ha sido rechazada.', 'error');
            this.getReservas(); // Recargar las reservas
          },
          error: (err) => {
            Swal.fire('Error', 'No se pudo actualizar el estado.', 'error');
            console.error('Error al cambiar el estado de la reserva:', err);
          },
        });
      }
    });
  }
  abrirModal(): void {
    this.isEditing = false;
    this.nuevaReserva = this.resetNuevaReservaData();
    this.getReservas();
    console.log('Franjas permitidas al abrir modal:', this.franjasPermitidas);

    this.modalReserva.show();
  }

  abrirModalEditar(reserva: Reserva): void {
    this.isEditing = true;
    this.nuevaReserva = { ...reserva };
    this.nuevaReserva.horaInicio = reserva.horaInicio;
    this.nuevaReserva.horaFin = reserva.horaFin;
    console.log('Franjas permitidas al abrir modal:', this.franjasPermitidas);
    this.modalReserva.show();
  }

  cerrarModal(): void {
    this.modalReserva.hide();
    document.body.classList.remove('modal-open');
    this.isEditing = false;
    this.nuevaReserva = this.resetNuevaReservaData();
  }

  eliminarReserva(id: number | undefined): void {
    if (!id) {
      console.error('ID inválido para eliminar reserva.');
      return;
    }

    this.reservaService.eliminarReserva(id).subscribe({
      next: () => {
        console.log(`Reserva con ID ${id} eliminada correctamente.`);
        this.getReservas();
      },
      error: (err) => console.error('Error al eliminar la reserva:', err),
    });
  }

  private resetNuevaReservaData(): Reserva {
    return {
      idReserva: 0,
      nombreCompleto: '',
      correo: '',
      dia: 'LUNES',
      telefono: '',
      ocupacionLaboral: '',
      laboratorio: { idLaboratorio: 0, nombreLaboratorio: '', ubicacion: '', capacidad: 0, franjasHorario: [], diasHorario: [] },
      horaInicio: '',
      horaFin: '',
      motivoReserva: '',
      cantidadParticipantes: 0,
      requerimientosTecnicos: '',
      estado: 'PENDIENTE',
    };
  }

  private formatTime(hour: string): string {
    if (hour && !hour.includes(':')) {
      return `${hour}:00`;
    }
    return hour;
  }

  actualizarPaginacion(): void {
    this.reservasPaginadas = this.paginationService.paginate(this.reservas, this.currentPage, this.itemsPerPage);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.actualizarPaginacion();
  }
}
