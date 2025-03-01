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
import Swal from 'sweetalert2';

@Component({
  selector: 'app-materia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clases.component.html',
  styleUrls: ['./clases.component.scss'],
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
  clasesPeriodoActivo: Clase[] = [];
  public franjasPermitidas: { horaInicio: string; horaFin: string }[] = [];

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
    const modalElement = document.getElementById('claseModal');
    if (modalElement) {
      this.modalClase = new Modal(modalElement, {
        backdrop: true,
        keyboard: true,
      });
      modalElement.addEventListener('hidden.bs.modal', () => {
        this.isEditing = false;
        this.newClase = this.resetNuevaClaseData();
      });
    }

    this.cargarDatosIniciales();
  }

  cargarDatosIniciales(): void {
    this.isLoading = true;
    this.cargarClasesConPeriodoActivo();
    this.cargarMaterias();
    this.cargarDocentes();
    this.cargarLaboratorios();
  }

  cargarLaboratorios(): void {
    this.laboratorioService.getLaboratorios().subscribe({
      next: (data) => {
        this.laboratorios = data;
      },
      error: (err) => console.error('Error al cargar laboratorios:', err),
    });
  }
  
  cargarClases() {
    this.clasesService.getClases().subscribe(
      (data) => {
        this.clases = data;
        this.cargarClasesConPeriodoActivo();
      },
      (error) => {
        console.error('Error cargando clases', error);
      }
    );
  }
  
  cargarClasesConPeriodoActivo() {
    this.clasesService.obtenerClasesPeriodo().subscribe(
      (data) => {
        this.clasesPeriodoActivo = data;
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
    this.modalClase?.show();
  }

  openEditClaseModal(clase: Clase) {
    this.isEditing = true;
    this.newClase = { ...clase }; // Hacemos una copia del objeto para editarlo
    this.modalClase?.show();
  }

  guardarClase() {
    if (this.isLoading) return;

    this.isLoading = true;

    if (!this.newClase.periodo || !this.newClase.periodo.idPeriodo) {
      this.newClase.periodo = new Periodo();
    }

    if (this.isEditing) {
      this.clasesService
        .editarClase(this.newClase.idClase, this.newClase)
        .subscribe({
          next: () => {
            Swal.fire(
              'Clase Actualizada',
              'La clase se actualizó correctamente',
              'success'
            );
            this.cargarClases();
            this.cerrarModal();
          },
          error: (error) => {
            console.error('Error editando clase', error);
            Swal.fire('Error', 'No se pudo actualizar la clase.', 'error');
            this.isLoading = false;
          },
          complete: () => {
            this.isLoading = false;
          },
        });
    } else {
      this.clasesService.agregarClase(this.newClase).subscribe({
        next: () => {
          Swal.fire(
            'Clase Creada',
            'La clase se creó correctamente',
            'success'
          );
          this.cargarClases();
          this.cerrarModal();
        },
        error: (error) => {
          console.error('Error agregando clase', error);
          Swal.fire('Error', 'No se pudo crear la clase.', 'error');
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    }
  }

  eliminarClase(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clasesService.eliminarClase(id).subscribe(
          () => {
            Swal.fire(
              'Eliminada',
              'La clase ha sido eliminada.',
              'success'
            );
            this.cargarClases();
          },
          (error) => {
            console.error('Error eliminando clase', error);
            Swal.fire(
              'Error',
              'No se pudo eliminar la clase.',
              'error'
            );
          }
        );
      }
    });
  }

  cerrarModal(): void {
    this.modalClase?.hide();
    this.newClase = this.resetNuevaClaseData();
    this.isEditing = false;
  }

  trackById(index: number, item: Clase): number {
    return item.idClase;
  }

  private resetNuevaClaseData(): Clase {
    return {
      idClase: 0,
      materia: new Materia(),
      docente: new Docente(),
      laboratorio: new Laboratorio(),
      periodo: new Periodo(),
      horaInicio: '',
      horaFin: '',
      dia: DiaEnum.LUNES,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    };
  }

  private validarClase(clase: Clase): boolean {
    return clase.materia.idMateria > 0 && clase.docente.idDocente > 0;
  }

  onLaboratorioChange(): void {
    const labId = Number(this.newClase.laboratorio.idLaboratorio);
    console.log('ID del laboratorio seleccionado:', labId);

    const selectedLab = this.laboratorios.find(
      (lab) => lab.idLaboratorio === labId
    );
    console.log('Laboratorio encontrado:', selectedLab);

    if (selectedLab && selectedLab.franjasHorario) {
      this.franjasPermitidas = selectedLab.franjasHorario.map((franja) => {
        const [horaInicio, horaFin] = franja.split('-');
        console.info('Franja horaria:', horaInicio, horaFin);
        return { horaInicio, horaFin };
      });
    } else {
      console.error(
        'No se encontró el laboratorio o no tiene franjas horarias'
      );
      this.franjasPermitidas = [];
    }

    this.newClase.horaInicio = '';
    this.newClase.horaFin = '';
  }
}
