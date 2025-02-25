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
import { DiaEnum, Laboratorio } from 'src/app/models/laboratorio.model';
import { LaboratorioService } from 'src/app/core/services/laboratorio.service';

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
  laboratorios: Laboratorio[] = [];
  newClase: Clase = this.resetNuevaClaseData();
  isEditing: boolean = false;
  modalClase: Modal | null = null;
  isLoading: boolean = false;
  franjasPermitidas = [
    { horaInicio: '07:00:00', horaFin: '08:00:00' },
    { horaInicio: '08:00:00', horaFin: '09:00:00' },
    { horaInicio: '09:00:00', horaFin: '10:00:00' },
    { horaInicio: '10:00:00', horaFin: '11:00:00' },
    { horaInicio: '11:00:00', horaFin: '12:00:00' },
    { horaInicio: '12:00:00', horaFin: '13:00:00' },
    { horaInicio: '13:00:00', horaFin: '14:00:00' },
    { horaInicio: '14:00:00', horaFin: '15:00:00' },
  ];
  dias: DiaEnum[] = [
    DiaEnum.LUNES,
    DiaEnum.MARTES,
    DiaEnum.MIERCOLES,
    DiaEnum.JUEVES,
    DiaEnum.VIERNES,
  ];

  constructor(
    private clasesService: ClasesService,
    private materiaService: MateriaService,
    private docenteService: DocenteService,
    private laboratorioService: LaboratorioService
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
    this.cargarLaboratorios();
  }

  cargarLaboratorios(): void {
    this.laboratorioService.getLaboratorios().subscribe({
      next: (data) => {
        this.laboratorios = data;
        console.log('Laboratorios:', data);
      },
      error: (err) => console.error('Error al cargar laboratorios:', err),
    });
  }
  cargarClases() {
    this.isLoading = true;
    this.clasesService.getClases().subscribe(
      (data) => {
        this.clases = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error cargando clases', error);
        this.isLoading = false;
      }
    );
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

  openAddClaseModal() {
    this.isEditing = false;
    this.newClase = new Clase();
  }

  openEditClaseModal(clase: Clase) {
    this.isEditing = true;
    this.newClase = { ...clase }; // Hacemos una copia del objeto para editarlo
  }

  guardarClase() {
    if (!this.newClase.periodo || !this.newClase.periodo.idPeriodo) {
      this.newClase.periodo = new Periodo();
    }
  
    if (this.isEditing) {
      this.clasesService
        .editarClase(this.newClase.idClase, this.newClase)
        .subscribe(
          () => this.cargarClases(),
          (error) => console.error('Error editando clase', error)
        );
    } else {
      this.clasesService.agregarClase(this.newClase).subscribe(
        () => this.cargarClases(),
        (error) => console.error('Error agregando clase', error)
      );
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
    this.clasesService
      .editarClase(this.newClase.idClase, this.newClase)
      .subscribe({
        next: () => {
          this.cerrarModal();
          this.recargarPagina(); // <-- Recarga la página después de editar
        },
        error: (err) => console.error('Error al editar clase:', err),
      });
  }

  eliminarClase(id: number) {
    this.clasesService.eliminarClase(id).subscribe(
      () => {
        this.cargarClases(); // Recargamos las clases
      },
      (error) => {
        console.error('Error eliminando clase', error);
      }
    );
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
      laboratorio: new Laboratorio(), // Inicializa laboratorio aquí
      periodo: new Periodo(),
      horaInicio: '',
      horaFin: '',
      dia: DiaEnum.LUNES, // o cualquier valor por defecto
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    };
  }
  

  private validarClase(clase: Clase): boolean {
    return clase.materia.idMateria > 0 && clase.docente.idDocente > 0;
  }

  private recargarPagina(): void {
    window.location.reload();
  }
}
