import { Component, OnInit } from '@angular/core';
import { Clase } from 'src/app/models/clase.model';
import { Materia } from 'src/app/models/materia.model';
import { Docente } from 'src/app/models/docente.model';
import { Periodo } from 'src/app/models/periodo.model';
import { MateriaService } from 'src/app/core/services/materia.service';
import { DocenteService } from 'src/app/core/services/docente.service';
import { Modal } from 'bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClasesService } from 'src/app/core/services/clases.service';
import { PeriodoService } from 'src/app/core/services/periodo.service';
import { DiaEnum } from 'src/app/models/laboratorio.model';

@Component({
  selector: 'app-materia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clases.component.html',
})
export class ClaseComponent implements OnInit {
  clases: Clase[] = [];
  materias: Materia[] = [];
  docentes: Docente[] = [];
  periodos: Periodo[] = [];
  newClase: Clase = this.resetNuevaClaseData();
  isEditing: boolean = false;
  modalClase: Modal | null = null;
  isLoading: boolean = false;

  constructor(
    private clasesService: ClasesService,
    private materiaService: MateriaService,
    private docenteService: DocenteService,
    private periodoService: PeriodoService
  ) {}

  ngOnInit(): void {
    this.cargarDatosIniciales();

    const modalElement = document.getElementById('claseModal');
    if (modalElement) {
      this.modalClase = new Modal(modalElement, { backdrop: 'static' });
    }
  }

  cargarDatosIniciales(): void {
    this.isLoading = true;
    this.cargarClases();
    this.cargarMaterias();
    this.cargarDocentes();
    this.cargarPeriodos();
  }

  cargarClases(): void {
    this.clasesService.getClases().subscribe({
      next: (data) => {
        this.clases = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar clases:', err);
        this.isLoading = false;
      },
    });
  }

  cargarMaterias(): void {
    this.materiaService.getMaterias().subscribe({
      next: (data) => (this.materias = data),
      error: (err) => console.error('Error al cargar materias:', err),
    });
  }

  cargarDocentes(): void {
    this.docenteService.getDocentes().subscribe({
      next: (data) => (this.docentes = data),
      error: (err) => console.error('Error al cargar docentes:', err),
    });
  }

  cargarPeriodos(): void {
    this.periodoService.getPeriodos().subscribe({
      next: (data) => (this.periodos = data),
      error: (err) => console.error('Error al cargar periodos:', err),
    });
  }

  openAddClaseModal(): void {
    this.newClase = this.resetNuevaClaseData();
    this.isEditing = false;
    if (this.modalClase) this.modalClase.show();
  }

  guardarClase(): void {
    if (!this.validarClase(this.newClase)) {
      console.warn('Datos inválidos para guardar la clase.');
      return;
    }

    this.newClase.materia.idMateria = Number(this.newClase.materia.idMateria);
    this.newClase.docente.idDocente = Number(this.newClase.docente.idDocente);
    this.newClase.periodo.idPeriodo = Number(this.newClase.periodo.idPeriodo);

    if (this.isEditing) {
      this.editarClase();
    } else {
      this.agregarClase();
    }
  }

  agregarClase(): void {
    this.clasesService.agregarClase(this.newClase).subscribe({
      next: () => {
        this.cerrarModal();
        this.recargarPagina(); // <-- Nueva función para recargar la página
      },
      error: (err) => console.error('Error al agregar clase:', err),
    });
  }

  editarClase(): void {
    this.clasesService.editarClase(this.newClase.idClase, this.newClase).subscribe({
      next: () => {
        this.cerrarModal();
        this.recargarPagina(); // <-- Recarga la página después de editar
      },
      error: (err) => console.error('Error al editar clase:', err),
    });
  }

  eliminarClase(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta clase?')) {
      this.clasesService.eliminarClase(id).subscribe({
        next: () => this.recargarPagina(),
        error: (err) => console.error('Error al eliminar clase:', err),
      });
    }
  }

  openEditClaseModal(clase: Clase): void {
    this.newClase = { ...clase };
    this.isEditing = true;
    if (this.modalClase) this.modalClase.show();
  }

  cerrarModal(): void {
    if (this.modalClase) {
      this.modalClase.hide();
      this.modalClase = null;
    }
    this.isEditing = false;
    this.newClase = this.resetNuevaClaseData();
  }

  trackById(index: number, item: Clase): number {
    return item.idClase;
  }

  private resetNuevaClaseData(): Clase {
    return {
      idClase: 0,
      materia: new Materia(),
      docente: new Docente(),
      periodo: new Periodo(),
      horaInicio: '',
      horaFin: '',
      dia: DiaEnum.LUNES, // or any default value from DiaEnum
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    };
  }

  private validarClase(clase: Clase): boolean {
    return (
      clase.materia.idMateria > 0 &&
      clase.docente.idDocente > 0 &&
      clase.periodo.idPeriodo > 0
    );
  }

  private recargarPagina(): void {
    window.location.reload();
  }
}
