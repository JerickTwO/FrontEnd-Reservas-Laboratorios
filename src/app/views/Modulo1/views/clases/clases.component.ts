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
import { Observable } from 'rxjs';

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
    this.clasesService.obtenerClasesPeriodo().subscribe({
      next: (data) => {
        console.log('Clases actualizadas recibidas:', data);

        // Traducción de días si vienen en inglés desde el backend
        const traduccionDias: { [key: string]: DiaEnum } = {
          MONDAY: DiaEnum.LUNES,
          TUESDAY: DiaEnum.MARTES,
          WEDNESDAY: DiaEnum.MIERCOLES,
          THURSDAY: DiaEnum.JUEVES,
          FRIDAY: DiaEnum.VIERNES,
        };

        this.clasesPeriodoActivo = data.map((clase) => ({
          ...clase,
          dia: traduccionDias[clase.dia] || clase.dia, // Traducción o valor por defecto
        }));

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando clases', error);
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

  openAddClaseModal() {
    this.modalClase?.show();
  }

  openEditClaseModal(clase: Clase) {
    this.isEditing = true;
    console.log('Clase original a editar:', clase);

    // Cargar las franjas horarias del laboratorio seleccionado
    const selectedLab = this.laboratorios.find(
      (lab) => lab.idLaboratorio === clase.laboratorio.idLaboratorio
    );
    console.log('Laboratorio seleccionado:', selectedLab);

    if (selectedLab && selectedLab.franjasHorario) {
      this.franjasPermitidas = selectedLab.franjasHorario.map((franja) => {
        const [horaInicio, horaFin] = franja.split('-');
        return { horaInicio, horaFin };
      });
    }

    // Formatear las horas para que coincidan con el formato de las franjas (HH:mm)
    const formatearHora = (hora: string) => {
      if (!hora) return '';
      // Si la hora tiene formato HH:mm:ss, convertir a HH:mm
      return hora.substring(0, 5);
    };

    // Hacemos una copia del objeto para editarlo
    this.newClase = {
      ...clase,
      horaInicio: formatearHora(clase.horaInicio),
      horaFin: formatearHora(clase.horaFin),
    };

    console.log('Clase preparada para editar:', this.newClase);
    this.modalClase?.show();
  }

  guardarClase() {
    if (this.isLoading) return;

    this.isLoading = true;

    if (!this.newClase.periodo || !this.newClase.periodo.idPeriodo) {
      this.newClase.periodo = new Periodo();
    }

    // Formatear las horas al formato que espera el backend (HH:mm:ss)
    const claseToSave = {
      ...this.newClase,
      horaInicio: this.newClase.horaInicio.includes(':')
        ? this.newClase.horaInicio.length === 5
          ? this.newClase.horaInicio + ':00'
          : this.newClase.horaInicio
        : this.newClase.horaInicio + ':00:00',
      horaFin: this.newClase.horaFin.includes(':')
        ? this.newClase.horaFin.length === 5
          ? this.newClase.horaFin + ':00'
          : this.newClase.horaFin
        : this.newClase.horaFin + ':00:00',
    };

    console.log('Guardando clase con valores:', claseToSave);

    if (this.isEditing) {
      this.clasesService
        .editarClase(claseToSave.idClase, claseToSave)
        .subscribe({
          next: (claseActualizada) => {
            // Primero cerramos el modal
            this.cerrarModal();

            // Luego recargamos los datos
            this.cargarClasesConPeriodoActivo();

            // Finalmente mostramos el mensaje de éxito
            setTimeout(() => {
              Swal.fire(
                'Clase Actualizada',
                'La clase se actualizó correctamente',
                'success'
              );
            }, 100);
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
      this.clasesService.agregarClase(claseToSave).subscribe({
        next: (nuevaClase) => {
          this.cerrarModal();
          this.cargarClasesConPeriodoActivo();
          setTimeout(() => {
            Swal.fire(
              'Clase Creada',
              'La clase se creó correctamente',
              'success'
            );
          }, 100);
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
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.clasesService.eliminarClase(id).subscribe(
          () => {
            this.clasesPeriodoActivo = this.clasesPeriodoActivo.filter(
              (c) => c.idClase !== id
            );
            Swal.fire('Eliminada', 'La clase ha sido eliminada.', 'success');
          },
          (error) => {
            console.error('Error eliminando clase', error);
            Swal.fire('Error', 'No se pudo eliminar la clase.', 'error');
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
