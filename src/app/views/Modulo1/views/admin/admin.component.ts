import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../pagination/pagination.component';
import { Administrador } from 'src/app/models/administrador.model';
import { Modal } from 'bootstrap';
import { AdministradorService } from 'src/app/core/services/administrador.service';
import { PaginationService } from 'src/app/core/services/pagination.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [PaginationComponent, CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  administradores: Administrador[] = [];
  newAdministrador: Administrador = new Administrador();
  selectedAdminstrador: Administrador | null = null;
  isEditing: boolean = false;
  administradoresPaginados: Administrador[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  modalReserva: any;


  constructor(
    private administradorService: AdministradorService,
    private paginationService: PaginationService
  ) { }

  ngOnInit(): void {
    this.cargarAdministradores();
    this.modalReserva = new Modal(document.getElementById('modalReserva')!, { backdrop: 'static' });

  }

  cargarAdministradores(): void {
    this.administradorService.getAdministradores().subscribe((data) => {
      this.administradores = data; // Actualiza la lista de Administradores
    });
  }

  openAddAdministradorModal(): void {
    this.newAdministrador = new Administrador();
    this.isEditing = false;
    this.showModal('addAdministradorModal');
  }

  openEditAdministradorModal(Administrador: Administrador): void {
    this.newAdministrador = { ...Administrador };
    this.isEditing = true;
    this.showModal('addAdministradorModal');
  }


  openPreviewAdministradorModal(Administrador: Administrador): void {
    this.selectedAdminstrador = Administrador;
    this.showModal('previewAdministradorModal');
  }

  guardarAdministrador(): void {
    if (this.isEditing) {
      this.editarAdministrador();
    } else {
      this.agregarAdministrador();
    }
  }

  agregarAdministrador(): void {
    this.administradorService.agregarAdministrador(this.newAdministrador).subscribe({
      next: () => {
        this.cargarAdministradores();
        this.closeModal('addAdministradorModal');
        this.newAdministrador = new Administrador();
      },
      error: (err) => {
        console.error('Error al agregar administrador:', err);
        alert('Ocurrió un error al agregar el administrador. Por favor, revisa los datos e intenta nuevamente.');
      },
    });
  }

  editarAdministrador(): void {
    this.administradorService.editarAdministrador(this.newAdministrador).subscribe(() => {
      this.cargarAdministradores();
      this.closeModal('addAdministradorModal');
    });
  }

  eliminarAdministrador(id: number): void {
    this.administradorService.eliminarAdministrador(id).subscribe(() => this.cargarAdministradores());
  }

  showModal(modalId: string): void {
    const modalElement = document.getElementById(modalId) as HTMLElement;
    const modalInstance = new Modal(modalElement);
    modalInstance.show();
  }

  closeModal(modalId: string): void {
    const modalElement = document.getElementById(modalId) as HTMLElement;
    const modalInstance = Modal.getInstance(modalElement);
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove()); this.isEditing = false;

    modalInstance?.hide();
  }
  actualizarPaginacion(): void {
    this.administradoresPaginados = this.paginationService.paginate(this.administradores, this.currentPage, this.itemsPerPage);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.actualizarPaginacion();
  }
}
