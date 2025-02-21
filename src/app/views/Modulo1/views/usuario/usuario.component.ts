import { Component, OnInit } from '@angular/core';
import { Docente } from 'src/app/models/docente.model';
import { PaginationComponent } from '../pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Modal } from 'bootstrap';
import { Departamento } from 'src/app/models/departamento.model';
import { DocenteService } from 'src/app/core/services/docente.service';
import { DepartamentoService } from 'src/app/core/services/departamento.service';
import { AdministradorService } from 'src/app/core/services/administrador.service';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { Administrador } from 'src/app/models/administrador.model';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export class UsuarioComponent {

  docentes: Docente[] = [];
  departamentos: Departamento[] = [];
  newDocente: Docente = new Docente();
  selectedDocente: Docente | null = null;
  isEditing: boolean = false;
  administradores: Administrador[] = [];
  newAdministrador: Administrador = new Administrador();
  selectedAdminstrador: Administrador | null = null;
  administradoresPaginados: Administrador[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  usuariosUnificados: Usuario[] = [];
  // nuevoUsuario: Usuario = new Usuario();
  constructor(
    private docenteService: DocenteService,
    private departamentoService: DepartamentoService,
    private administradorService: AdministradorService,
    private usuarioService: UsuarioService,
  ) { }
  ngOnInit(): void {
    this.cargarDocentes();
    this.cargarDepartamentos();
    this.cargarAdministradores();
    this.cargarUsuarios();
  }
  cargarDocentes(): void {
    this.docenteService.getDocentes().subscribe(
      (data) => (this.docentes = data),
      (error) => console.error('Error al cargar docentes:', error)
    );
  }
  cargarUsuarios(): void {
    this.usuarioService.getUsuariosUnificados().subscribe(
      (data) => {
        this.usuariosUnificados = data;
      },
      (error) => {
        console.error('Error al cargar la lista unificada', error);
      }
    );
  }
  cargarDepartamentos(): void {
    this.departamentoService.getDepartamentos().subscribe(
      (data) => (this.departamentos = data),
      (error) => console.error('Error al cargar departamentos:', error)
    );
  }

  openAddDocenteModal(): void {
    this.newDocente = new Docente();
    this.newDocente.departamento = new Departamento();
    this.isEditing = false;
    this.showModal('addDocenteModal');
  }

  openEditDocenteModal(usuario: Usuario): void {
    // this.nuevoUsuario = { ...usuario };
    this.isEditing = true;
    this.showModal('addDocenteModal');
  }

  openPreviewDocenteModal(docente: Docente): void {
    this.selectedDocente = docente;
    this.showModal('previewDocenteModal');
  }

  guardarDocente(): void {
    if (this.isEditing) {
      this.editarDocente();
    } else {
      this.agregarDocente();
    }
  }

  agregarDocente(): void {
    this.docenteService.agregarDocente(this.newDocente).subscribe({
      next: () => {
        this.cargarDocentes();
        this.closeModal('addDocenteModal');
        this.newDocente = new Docente();
      },
      error: (err) => {
        console.error('Error al agregar docente:', err);
        alert('Ocurrió un error al agregar el docente. Por favor, revisa los datos e intenta nuevamente.');
      },
    });
  }

  editarDocente(): void {
    this.docenteService.editarDocente(this.newDocente).subscribe({
      next: () => {
        this.cargarDocentes();
        this.closeModal('addDocenteModal');
      },
      error: (err) => console.error('Error al editar docente:', err),
    });
  }

  eliminarDocente(id: number): void {
    if (confirm('¿Estás seguro de eliminar este docente?')) {
      this.docenteService.eliminarDocente(id).subscribe({
        next: () => this.cargarDocentes(),
        error: (err) => {
          console.error('Error al eliminar docente:', err);
          alert('Ocurrió un error al eliminar el docente. Por favor, intenta nuevamente.');
        },
      });
    }
  }

  showModal(modalId: string): void {
    const modalElement = document.getElementById(modalId) as HTMLElement;
    const modalInstance = new Modal(modalElement);
    modalInstance.show();
  }

  closeModal(modalId: string): void {
    const modalElement = document.getElementById(modalId) as HTMLElement;
    const modalInstance = Modal.getInstance(modalElement);
    modalInstance?.hide();
  }

  onCellClicked(event: any): void {
    const action = event.event.target.getAttribute('data-action');
    const docente = event.data;

    if (action === 'edit') {
      this.openEditDocenteModal(docente);
    } else if (action === 'view') {
      this.openPreviewDocenteModal(docente);
    } else if (action === 'delete') {
      this.eliminarDocente(docente.idDocente);
    }
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

  showModalAdministrador(modalId: string): void {
    const modalElement = document.getElementById(modalId) as HTMLElement;
    const modalInstance = new Modal(modalElement);
    modalInstance.show();
  }

  closeModalAdministrador(modalId: string): void {
    const modalElement = document.getElementById(modalId) as HTMLElement;
    const modalInstance = Modal.getInstance(modalElement);
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove()); this.isEditing = false;

    modalInstance?.hide();
  }
}
