import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { LaboratorioService } from 'src/app/core/services/laboratorio.service';
import { Laboratorio } from 'src/app/models/laboratorio.model';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';
import { PaginationComponent } from '../pagination/pagination.component';
import { PaginationService } from 'src/app/core/services/pagination.service';

@Component({
  selector: 'app-laboratorio',
  standalone: true,
  imports: [PaginationComponent, CommonModule, HttpClientModule, FormsModule], // Importar NgFor y NgIf
  templateUrl: './laboratorio.component.html',
})
export class LaboratorioComponent implements OnInit {
  laboratorios: Laboratorio[] = [];
  laboratoriosPaginados: Laboratorio[] = [];
  selectedLaboratorio: Laboratorio | null = null; // Para la vista previa o edición
  newLaboratorio: Laboratorio = {
    idLaboratorio: 0,
    nombreLaboratorio: '',
    capacidad: 0,
    ubicacion: '',
    franjasHorario:[],
  };
  error: string | null = null;
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;

  constructor(
    private laboratorioService: LaboratorioService,
    private paginationService: PaginationService
  ) { }

  ngOnInit(): void {
    this.cargarLaboratorios();

  }

  // Cargar la lista de laboratorios desde la API
  cargarLaboratorios(): void {
    this.laboratorioService.getLaboratorios().subscribe({
      next: (data: Laboratorio[]) => {
        this.laboratorios = data;
      },
      error: (err: any) => {
        console.error('Error al cargar laboratorios:', err);
      },
    });
  }

  // Abrir el modal para agregar un nuevo laboratorio
  openAddLaboratorioModal(): void {
    this.newLaboratorio = {
      idLaboratorio: 0,
      nombreLaboratorio: '',
      capacidad: 0,
      ubicacion: '',
      franjasHorario:[],
    }; // Limpiar el formulario
    this.openModal('addLaboratorioModal');
  }

  // Abrir el modal para editar un laboratorio existente
  openEditLaboratorioModal(laboratorio: Laboratorio): void {
    this.newLaboratorio = { ...laboratorio }; // Copiar los datos del laboratorio seleccionado
    this.openModal('editLaboratorioModal');
  }

  // Abrir el modal para vista previa de un laboratorio
  openPreviewLaboratorioModal(laboratorio: Laboratorio): void {
    this.selectedLaboratorio = laboratorio; // Asignar el laboratorio para vista previa
    this.openModal('previewLaboratorioModal');
  }

  // Agregar un nuevo laboratorio
  agregarLaboratorio(): void {
    if (!this.validarLaboratorio(this.newLaboratorio)) {
      console.error('Faltan campos obligatorios');
      return;
    }

    this.laboratorioService.crearLaboratorio(this.newLaboratorio).subscribe({
      next: () => {
        this.cargarLaboratorios();
        this.closeModal('addLaboratorioModal');
      },
      error: (err: any) => {
        console.error('Error al agregar laboratorio:', err);
      },
    });
  }

  // Editar un laboratorio existente
  editarLaboratorio(): void {
    if (!this.validarLaboratorio(this.newLaboratorio)) {
      console.error('Faltan campos obligatorios');
      return;
    }

    this.laboratorioService
      .actualizarLaboratorio(this.newLaboratorio.idLaboratorio, this.newLaboratorio)
      .subscribe({
        next: () => {
          this.cargarLaboratorios();
          this.closeModal('editLaboratorioModal');
        },
        error: (err: any) => {
          console.error('Error al editar laboratorio:', err);
        },
      });
  }

  // Eliminar un laboratorio existente
  eliminarLaboratorio(id: number): void {
    if (confirm('¿Estás seguro de eliminar este laboratorio?')) {
      this.laboratorioService.eliminarLaboratorio(id).subscribe({
        next: () => this.cargarLaboratorios(),
        error: (err: any) => {
          console.error('Error al eliminar laboratorio:', err);
        },
      });
    }
  }

  // Manejar clics en las celdas de Ag-Grid
  onCellClicked(event: any): void {
    const action = event.event.target.getAttribute('data-action');
    const laboratorio = event.data;

    if (action === 'edit') {
      this.openEditLaboratorioModal(laboratorio);
    } else if (action === 'delete') {
      this.eliminarLaboratorio(laboratorio.idLaboratorio);
    }
  }

  // Validar que los campos del laboratorio sean correctos
  private validarLaboratorio(laboratorio: Laboratorio): boolean {
    return (
      laboratorio.nombreLaboratorio.trim() !== '' &&
      laboratorio.capacidad > 0 &&
      laboratorio.ubicacion.trim() !== ''
    );
  }

  // Abrir un modal específico por su ID
  private openModal(modalId: string): void {
    const modalElement = document.getElementById(modalId) as HTMLElement;
    if (modalElement) {
      const modalInstance = new Modal(modalElement);
      modalInstance.show();
    } else {
      console.error(`Modal con ID ${modalId} no encontrado.`);
    }
  }

  // Cerrar un modal específico por su ID
  private closeModal(modalId: string): void {
    const modalElement = document.getElementById(modalId) as HTMLElement;
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement);
      modalInstance?.hide();
    } else {
      console.error(`Modal con ID ${modalId} no encontrado.`);
    }
  }

  actualizarPaginacion(): void {
    this.laboratoriosPaginados = this.paginationService.paginate(this.laboratorios, this.currentPage, this.itemsPerPage);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.actualizarPaginacion();
  }
}
