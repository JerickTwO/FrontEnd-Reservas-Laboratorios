import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MateriaService } from 'src/app/core/services/materia.service';
import { Materia } from 'src/app/models/materia.model';
import { Modal } from 'bootstrap';
import { PaginationComponent } from '../pagination/pagination.component';
import { PaginationService } from 'src/app/core/services/pagination.service';

@Component({
  selector: 'app-materia',
  standalone: true,
  imports: [PaginationComponent, CommonModule, FormsModule],
  templateUrl: './materia.component.html',
})
export class MateriaComponent implements OnInit {
  materias: Materia[] = [];
  newMateria: Materia = new Materia(); // Materia para agregar o editar
  isEditing: boolean = false;
  materiasPaginadas: Materia[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  modalMateria: any;

  constructor(
    private materiaService: MateriaService,
    private paginationService: PaginationService
  ) {}

  ngOnInit(): void {
    this.cargarMaterias();
    const modalElement = document.getElementById('materiaModal');
    if (modalElement) {
      this.modalMateria = new Modal(modalElement, { backdrop: 'static' });
    } else {
      console.error('El elemento modal no está disponible en el DOM');
    }
  }

  cargarMaterias(): void {
    this.materiaService.getMaterias().subscribe({
      next: (data: Materia[]) => {
        this.materias = data;
        this.actualizarPaginacion();
      },
      error: (err) => {
        console.error('Error al cargar materias:', err);
      },
    });
  }

  cerrarModal(): void {
    if (this.modalMateria) {
      this.modalMateria.hide();
    }
    document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove());
    this.isEditing = false;
    this.newMateria = this.resetNuevaMateriaData();
  }

  openAddMateriaModal(): void {
    this.newMateria = new Materia(); // Resetea la materia
    this.isEditing = false; // Modo agregar
    if (this.modalMateria) {
      this.modalMateria.show();
    }
  }
  trackById(index: number, item: Materia): number {
    return item.idMateria; // Devuelve el ID único de la materia para rastreo
  }


  guardarMateria(): void {
    if (this.isEditing) {
      this.editarMateria();
    } else {
      this.agregarMateria();
    }
  }

  agregarMateria(): void {
    this.materiaService.agregarMateria(this.newMateria).subscribe({
      next: (response: Materia) => {
        console.log('Materia agregada:', response);
        this.cargarMaterias(); // Recarga la lista de materias
        this.cerrarModal();
      },
      error: (err) => {
        console.error('Error al agregar materia:', err);
      },
    });
  }

  editarMateria(): void {
    this.materiaService.editarMateria(this.newMateria).subscribe({
      next: (response: Materia) => {
        console.log('Materia editada:', response);
        this.cargarMaterias(); // Recarga la lista de materias
        this.cerrarModal();
      },
      error: (err) => {
        console.error('Error al editar materia:', err);
      },
    });
  }

  openEditMateriaModal(materia: Materia): void {
    this.newMateria = { ...materia }; // Copia los datos de la materia para editar
    this.isEditing = true; // Modo edición
    if (this.modalMateria) {
      this.modalMateria.show(); // Abre el modal de edición
    } else {
      console.error('El modal no está disponible');
    }
  }

  eliminarMateria(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta materia?')) {
      this.materiaService.eliminarMateria(id).subscribe({
        next: () => {
          this.cargarMaterias(); // Recarga la lista de materias
        },
        error: (err) => {
          console.error('Error al eliminar materia:', err);
        },
      });
    }
  }

  actualizarPaginacion(): void {
    this.materiasPaginadas = this.paginationService.paginate(this.materias, this.currentPage, this.itemsPerPage);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.actualizarPaginacion();
  }

  private resetNuevaMateriaData(): Materia {
    return {
      idMateria: 0,
      nombreMateria: '',
      nrc: '',
      creditos: 0,
    };
  }
}
