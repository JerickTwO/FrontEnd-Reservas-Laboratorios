import { Component, OnInit } from '@angular/core';
import { ReservaService } from 'src/app/core/services/reserva.service';
import { Reserva } from 'src/app/models/reserva.model';
import { Laboratorio } from 'src/app/models/laboratorio.model';
import { LaboratorioService } from 'src/app/core/services/laboratorio.service';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { PaginationComponent } from '../pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Modal } from 'bootstrap';

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
  isEditing: boolean = false; // Modo edición o creación
  reservasPaginadas: Reserva[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  modalReserva: any;

  constructor(
    private reservaService: ReservaService,
    private laboratorioService: LaboratorioService,
    private paginationService: PaginationService
  ) { }

  ngOnInit(): void {
    this.getReservas();
    this.modalReserva = new Modal(document.getElementById('modalReserva')!, { backdrop: 'static' });
    this.getLaboratorios();
    document.getElementById('modalReserva')?.addEventListener('hidden.bs.modal', () => {
      this.cerrarModal();
    });
  }

  getReservas(): void {
    this.reservaService.listarReservas().subscribe({
      next: (data) => {
        this.reservas = data;
        this.totalPages = Math.ceil(this.reservas.length / this.itemsPerPage);
        this.actualizarPaginacion();
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

    if (this.isEditing) {

      console.log(this.nuevaReserva)
      console.log(this.nuevaReserva.idReserva)
      if (!this.nuevaReserva.idReserva) {
        console.error('ID inválido para actualizar la reserva.');
        return;
      }

      this.reservaService.actualizarReserva(this.nuevaReserva.idReserva, this.nuevaReserva).subscribe({
        next: () => {
          console.log('Reserva actualizada con éxito');
          this.getReservas();
          this.cerrarModal();
        },
        error: (err) => console.error('Error al actualizar la reserva:', err),
      });
    } else {
      this.reservaService.crearReserva(this.nuevaReserva).subscribe({
        next: () => {
          console.log('Reserva creada con éxito');
          this.getReservas();
          this.cerrarModal();
        },
        error: (err) => console.error('Error al crear la reserva:', err),
      });
    }
  }

  cambiarEstado(reserva: Reserva, nuevoEstado: string): void {
    if (!reserva.idReserva) {
      console.error('ID de reserva inválido para cambiar estado.');
      return;
    }

    reserva.estado = nuevoEstado; // Actualiza localmente
    this.reservaService.actualizarReserva(reserva.idReserva, { estado: nuevoEstado }).subscribe({
      next: () => console.log(`Estado de la reserva con ID ${reserva.idReserva} actualizado a ${nuevoEstado}`),
      error: (err) => console.error('Error al actualizar el estado de la reserva:', err),
    });
  }

  abrirModal(): void {
    this.isEditing = false;

    if (this.modalReserva) {
      this.modalReserva.hide(); // Cierra cualquier modal abierto
      setTimeout(() => this.modalReserva.show(), 300); // Abre el nuevo modal después de un corto retraso
    }
  }

  abrirModalEditar(reserva: Reserva): void {
    this.isEditing = true;
    this.nuevaReserva = { ...reserva };

    const laboratorioEncontrado = this.laboratorios.find(lab => lab.idLaboratorio === reserva.laboratorio.idLaboratorio);
    this.nuevaReserva.laboratorio = laboratorioEncontrado || { idLaboratorio: 0, nombreLaboratorio: '' };

    this.abrirModal();
  }

  cerrarModal(): void {
    if (this.modalReserva) {
      this.modalReserva.hide();
    }
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
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
      telefono: '',
      ocupacionLaboral: '',
      laboratorio: { idLaboratorio: 0, nombreLaboratorio: '' },
      horaInicio: '',
      horaFin: '',
      motivoReserva: '',
      cantidadParticipantes: 0,
      estado: 'PENDIENTE',
    };
  }

  onCellClicked(event: any): void {
    const action = event.event.target.getAttribute('data-action');
    const reserva = event.data;

    if (action === 'edit') {
      this.abrirModalEditar(reserva);
    } else if (action === 'delete') {
      this.eliminarReserva(reserva.idReserva);
    } else if (event.event.target.tagName === 'SELECT') {
      const estado = (event.event.target as HTMLSelectElement).value;
      this.cambiarEstado(reserva, estado);
    }
  }
  actualizarPaginacion(): void {
    this.reservasPaginadas = this.paginationService.paginate(this.reservas, this.currentPage, this.itemsPerPage);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.actualizarPaginacion();
  }
}