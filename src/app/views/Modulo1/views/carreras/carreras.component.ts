import { Component } from '@angular/core';
import { CarreraService } from 'src/app/core/services/carrera.service';
import { Carrera } from 'src/app/models/carrera.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-carreras',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './carreras.component.html',
  styleUrl: './carreras.component.scss'
})
export class CarrerasComponent {
  carreras: Carrera[] = []; // Lista de carreras
  newCarrera: Carrera = new Carrera(); // Objeto para agregar o editar
  selectedCarrera: Carrera | null = null; // Carrera seleccionada para vista previa
  errorMessage: string = ''; // Mensaje de error para el usuario

  constructor(private carreraService: CarreraService) {}

  ngOnInit(): void {
    this.cargarCarreras(); // Cargar todas las carreras al iniciar
  }

  /**
   * Cargar todas las carreras desde el backend
   */
  cargarCarreras(): void {
    this.carreraService.getCarreras().subscribe(
      (data) => {
        this.carreras = data;
        this.errorMessage = ''; // Limpiar mensajes de error
      },
      (error) => {
        console.error('Error al cargar carreras:', error);
        this.errorMessage = 'Ocurrió un error al cargar las carreras. Intenta nuevamente.';
      }
    );
  }

  /**
   * Abrir el modal para agregar una nueva carrera
   */
  openAddCarreraModal(): void {
    this.newCarrera = new Carrera(); // Limpiar el objeto de nueva carrera
    this.errorMessage = ''; // Limpiar mensajes de error
    this.showModal('addCarreraModal');
  }

  /**
   * Abrir el modal para editar una carrera existente
   * @param carrera Carrera seleccionada
   */
  openEditCarreraModal(carrera: Carrera): void {
    this.newCarrera = { ...carrera }; // Clonar la carrera seleccionada
    this.errorMessage = ''; // Limpiar mensajes de error
    this.showModal('editCarreraModal');
  }

  /**
   * Abrir el modal para vista previa de una carrera
   * @param carrera Carrera seleccionada
   */
  openPreviewCarreraModal(carrera: Carrera): void {
    this.selectedCarrera = carrera;
    this.showModal('previewCarreraModal');
  }

  /**
   * Agregar una nueva carrera
   */
  agregarCarrera(): void {
    if (!this.newCarrera.nombreCarrera || this.newCarrera.nombreCarrera.trim() === '') {
      this.errorMessage = 'El nombre de la carrera es obligatorio.';
      return;
    }

    this.carreraService.agregarCarrera(this.newCarrera).subscribe(
      (response) => {
        console.log('Carrera agregada con éxito:', response);
        this.cargarCarreras();
        this.closeModal('addCarreraModal');
      },
      (error) => {
        console.error('Error al agregar carrera:', error);
        this.errorMessage = 'Ocurrió un error al agregar la carrera. Intenta nuevamente.';
      }
    );
  }

  /**
   * Editar una carrera existente
   */
  editarCarrera(): void {
    if (!this.newCarrera.idCarrera) {
      this.errorMessage = 'El ID de la carrera es obligatorio para actualizar.';
      return;
    }

    if (!this.newCarrera.nombreCarrera || this.newCarrera.nombreCarrera.trim() === '') {
      this.errorMessage = 'El nombre de la carrera es obligatorio.';
      return;
    }

    this.carreraService.editarCarrera(this.newCarrera.idCarrera, this.newCarrera).subscribe(
      (response) => {
        console.log('Carrera actualizada con éxito:', response);
        this.cargarCarreras();
        this.closeModal('editCarreraModal');
      },
      (error) => {
        console.error('Error al actualizar carrera:', error);
        this.errorMessage = 'Ocurrió un error al actualizar la carrera. Intenta nuevamente.';
      }
    );
  }

  /**
   * Eliminar una carrera
   * @param idCarrera ID de la carrera a eliminar
   */
  eliminarCarrera(idCarrera: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta carrera?')) {
      this.carreraService.eliminarCarrera(idCarrera).subscribe(
        () => {
          console.log('Carrera eliminada con éxito');
          this.cargarCarreras();
        },
        (error) => {
          console.error('Error al eliminar carrera:', error);
          this.errorMessage = 'Ocurrió un error al eliminar la carrera. Intenta nuevamente.';
        }
      );
    }
  }

  /**
   * Mostrar un modal
   * @param modalId ID del modal
   */
  showModal(modalId: string): void {
    const modalElement = document.getElementById(modalId) as HTMLElement;
    if (modalElement) {
      const modalInstance = new Modal(modalElement);
      modalInstance.show();
    }
  }

  /**
   * Cerrar un modal
   * @param modalId ID del modal
   */
  closeModal(modalId: string): void {
    const modalElement = document.getElementById(modalId) as HTMLElement;
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement);
      modalInstance?.hide();
    }
  }
}
