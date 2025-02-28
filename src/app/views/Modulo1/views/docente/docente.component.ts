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

@Component({
  selector: 'app-docente',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './docente.component.html',
  styleUrl: './docente.component.scss'
})
export class DocenteComponent {

  docentes: Docente[] = [];
  departamentos: Departamento[] = [];
  newDocente: Docente = new Docente();
  selectedDocente: Docente | null = null;
  isEditing: boolean = false;
  idInstitucionalError: boolean = false;

  constructor(
    private docenteService: DocenteService,
    private departamentoService: DepartamentoService
  ) { }

  ngOnInit(): void {
    this.cargarDocentes();
    this.cargarDepartamentos();
  }
  cargarDocentes(): void {
    this.docenteService.getDocentes().subscribe(
      (data) => (this.docentes = data),
      (error) => console.error('Error al cargar docentes:', error)
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

  openEditDocenteModal(docente: Docente): void {
    this.newDocente = { ...docente };
    this.isEditing = true;
    this.showModal('addDocenteModal');
  }

  openPreviewDocenteModal(docente: Docente): void {
    this.selectedDocente = docente;
    this.showModal('previewDocenteModal');
  }

  validarIdInstitucional(): void {
    const pattern = /^L[0-9A-Za-z]{7}$/;
    this.idInstitucionalError = !pattern.test(this.newDocente.idInstitucional);
  }

  guardarDocente(): void {
    this.validarIdInstitucional();
    if (this.idInstitucionalError) {
      alert("El ID Institucional es inválido. Debe comenzar con 'L' y tener exactamente 8 caracteres.");
      return;
    }

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

}
