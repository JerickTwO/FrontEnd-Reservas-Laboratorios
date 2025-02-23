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

  guardar(): void {
    this.validarNombre();
    if (this.nombreDuplicado) {
      Swal.fire({
        icon: 'error',
        title: 'Nombre Duplicado',
        text: 'El nombre del periodo ya está en uso. Por favor, elija otro nombre.',
        confirmButtonColor: '#d33',
      });
      return;
    }

    if (this.isEditing) {
      this.periodoService
        .editarPeriodo(this.currentId!, this.periodo)
        .subscribe(() => {
          Swal.fire({
            icon: 'success',
            title: 'Actualizado',
            text: 'El periodo ha sido actualizado correctamente.',
            confirmButtonColor: '#3085d6',
          });
          this.obtenerPeriodos();
          this.resetForm();
        });
    } else {
      this.periodoService.agregarPeriodo(this.periodo).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Guardado',
          text: 'El periodo ha sido guardado correctamente.',
          confirmButtonColor: '#3085d6',
        });
        this.obtenerPeriodos();
        this.resetForm();
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
      });
      this.obtenerPeriodos();
    });
  }

  resetForm(): void {
    this.periodo = new Periodo();
    this.isEditing = false;
    this.currentId = null;
    this.nombreDuplicado = false;
  }
}
