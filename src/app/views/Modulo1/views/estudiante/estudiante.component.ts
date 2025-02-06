import { Component, OnInit } from '@angular/core';
import { Estudiante } from 'src/app/models/estudiante.model';
import { Carrera } from 'src/app/models/carrera.model';
import { EstudianteService } from 'src/app/core/services/estudiante.service';
import { CarreraService } from 'src/app/core/services/carrera.service';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { PaginationComponent } from '../pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-estudiante',
  standalone: true,
  imports: [PaginationComponent, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './estudiante.component.html',
  styleUrl: './estudiante.component.scss'
})
export class EstudianteComponent {
  estudiantes: Estudiante[] = [];
  carreras: Carrera[] = [];
  newEstudiante: Estudiante = new Estudiante();
  selectedEstudiante: Estudiante | null = null;
  isEditing: boolean = false; // Modo edición o creación
  estudiantesPaginados: Estudiante[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  modalReserva: any;

  constructor(
    private estudianteService: EstudianteService,
    private carreraService: CarreraService,
    private paginationService: PaginationService
  ) { }

  ngOnInit(): void {
    this.cargarEstudiantes();
    this.cargarCarreras();
  }

  cargarEstudiantes(): void {
    this.estudianteService.getEstudiantes().subscribe((data) => {
        this.estudiantes = data; // Actualiza la lista de estudiantes
      });
  }

  cargarCarreras(): void {
    this.carreraService.getCarreras().subscribe( (data) => {
        this.carreras = data;
      });
  }
  openAddEstudianteModal(): void {
    this.newEstudiante = new Estudiante();
    this.newEstudiante.carrera = new Carrera();
    this.isEditing = false;
    this.showModal('addEstudianteModal');
  }

  openEditEstudianteModal(estudiante: Estudiante): void {
    this.newEstudiante = { ...estudiante };
    this.isEditing = true;
    this.showModal('addEstudianteModal');
  }


  openPreviewEstudianteModal(estudiante: Estudiante): void {
      this.selectedEstudiante = estudiante;
      this.showModal('previewEstudianteModal');
    }

    guardarEstudiante(): void {
      if (!this.newEstudiante.carrera || !this.newEstudiante.carrera.idCarrera) {
        alert('Debe seleccionar una carrera para el estudiante.');
        return;
      }

      if (this.isEditing) {
        this.editarEstudiante();
      } else {
        this.agregarEstudiante();
      }
    }

    agregarEstudiante(): void {
      this.estudianteService.agregarEstudiante(this.newEstudiante).subscribe(() => {
        this.cargarEstudiantes();
        this.closeModal('addEstudianteModal');
      });
    }

    editarEstudiante(): void {
      this.estudianteService.editarEstudiante(this.newEstudiante).subscribe(() => {
        this.cargarEstudiantes();
        this.closeModal('addEstudianteModal');
      });
    }


  getCarreraNombre(idCarrera: number): string {
    const carrera = this.carreras.find(c => c.idCarrera === idCarrera);
    return carrera?.nombreCarrera ?? 'Sin Carrera';
  }

  eliminarEstudiante(id: number): void {
    this.estudianteService.eliminarEstudiante(id).subscribe(() => this.cargarEstudiantes());
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
  actualizarPaginacion(): void {
    this.estudiantesPaginados = this.paginationService.paginate(this.estudiantes, this.currentPage, this.itemsPerPage);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.actualizarPaginacion();
  }
}
