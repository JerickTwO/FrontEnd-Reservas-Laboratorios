import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { PeriodoService } from 'src/app/core/services/periodo.service';
import { Periodo } from 'src/app/models/periodo.model';

@Component({
  selector: 'app-periodo',
  standalone: true,
  templateUrl: './periodo.component.html',
  imports: [FormsModule, CommonModule],
})
export class PeriodoComponent {
  periodos: Periodo[] = [];
  periodo: Periodo = new Periodo();
  isEditing = false;
  currentId: number | null = null;
  nombreDuplicado = false;

  constructor(private periodoService: PeriodoService) {}

  ngOnInit(): void {
    this.obtenerPeriodos();
  }

  obtenerPeriodos(): void {
    this.periodoService.getPeriodos().subscribe((data) => {
      this.periodos = data;
    });
  }

  validarNombre(): void {
    if (this.periodo.nombrePeriodo.trim() === '') {
      this.nombreDuplicado = false;
      return;
    }

    this.periodoService
      .verificarNombreDuplicado(this.periodo.nombrePeriodo)
      .subscribe((existe) => {
        this.nombreDuplicado = existe;
      });
  }

  async guardar(): Promise<void> {
    this.validarNombre();
    console.log(this.nombreDuplicado);
    
    if (this.nombreDuplicado) {
      Swal.fire({
        icon: 'error',
        title: 'Nombre Duplicado',
        text: 'El nombre del periodo ya está en uso. Por favor, elija otro nombre.',
        confirmButtonColor: '#d33',
      });
      return;
    }
  
    if (this.periodo.fechaFin < this.periodo.fechaInicio) {
      Swal.fire({
        icon: 'error',
        title: 'Fechas Incorrectas',
        text: 'La fecha de fin no puede ser anterior a la fecha de inicio.',
        confirmButtonColor: '#d33',
      });
      return;
    }
    try {
      if (this.isEditing) {
        await this.periodoService
          .editarPeriodo(this.currentId!, this.periodo)
          .toPromise();
        Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'El periodo ha sido actualizado correctamente.',
          confirmButtonColor: '#3085d6',
        });
      } else {
        await this.periodoService.agregarPeriodo(this.periodo).toPromise();
        Swal.fire({
          icon: 'success',
          title: 'Guardado',
          text: 'El periodo ha sido guardado correctamente.',
          confirmButtonColor: '#3085d6',
        });
      }
      this.obtenerPeriodos();
      this.resetForm();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Nombre ya existente. Inténtelo nuevamente.',
        confirmButtonColor: '#d33',
      });
    }
  }
  
  editar(id: number): void {
    this.periodoService.getPeriodoById(id).subscribe((data) => {
      this.periodo = data;
      this.currentId = id;
      this.isEditing = true;
    });
  }

  eliminar(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.periodoService.eliminarPeriodo(id).subscribe(() => {
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'El periodo ha sido eliminado.',
            confirmButtonColor: '#3085d6',
          });
          this.obtenerPeriodos();
        });
      }
    });
  }
  cambiarEstado(id: number, estado: boolean): void {
    this.periodoService.cambiarEstadoPeriodo(id, estado).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'Estado Cambiado',
        text: `El periodo ha sido ${estado ? 'activado' : 'desactivado'}.`,
        confirmButtonColor: '#3085d6',  
      }).then(() => {
        location.reload();
      });
    });
  }

  resetForm(): void {
    this.periodo = new Periodo();
    this.isEditing = false;
    this.currentId = null;
    this.nombreDuplicado = false;
  }
}