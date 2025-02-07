import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';
import { DepartamentoService } from 'src/app/core/services/departamento.service';
import { Departamento } from 'src/app/models/departamento.model';

@Component({
  selector: 'app-departamentos',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './departamentos.component.html',
  styleUrl: './departamentos.component.scss'
})
export class DepartamentosComponent {
  departamentos: Departamento[] = [];
  newDepartamento: Departamento = new Departamento();
  selectedDepartamento: Departamento | null = null;

  constructor(private departamentoService: DepartamentoService) { }

  ngOnInit(): void {
    this.cargarDepartamentos();
  }

  cargarDepartamentos(): void {
    this.departamentoService.getDepartamentos().subscribe({
      next: (data) => {
        this.departamentos = data;
      },
      error: (err) => console.error('Error al cargar departamentos:', err),
    });
  }

  openAddDepartamentoModal(): void {
    this.newDepartamento = new Departamento();
    this.openModal('addDepartamentoModal');
  }

  openEditDepartamentoModal(departamento: Departamento): void {
    this.newDepartamento = { ...departamento };
    this.openModal('editDepartamentoModal');
  }

  openPreviewDepartamentoModal(departamento: Departamento): void {
    this.selectedDepartamento = { ...departamento };
    this.openModal('previewDepartamentoModal');
  }

  agregarDepartamento(): void {
    this.departamentoService.agregarDepartamento(this.newDepartamento).subscribe({
      next: () => {
        this.cargarDepartamentos();
        this.closeModal('addDepartamentoModal');
      },
      error: (err) => console.error('Error al agregar departamento:', err),
    });
  }

  editarDepartamento(): void {
    this.departamentoService.editarDepartamento(this.newDepartamento).subscribe({
      next: () => {
        this.cargarDepartamentos();
        this.closeModal('editDepartamentoModal');
      },
      error: (err) => console.error('Error al editar departamento:', err),
    });
  }

  eliminarDepartamento(id: number): void {
    if (confirm('¿Estás seguro de eliminar este departamento?')) {
      this.departamentoService.eliminarDepartamento(id).subscribe({
        next: () => {
          this.cargarDepartamentos();
        },
        error: (err) => console.error('Error al eliminar departamento:', err),
      });
    }
  }

  onCellClicked(event: any): void {
    const action = event.event.target.getAttribute('data-action');
    const departamento = event.data;

    if (action === 'edit') {
      this.openEditDepartamentoModal(departamento);
    } else if (action === 'delete') {
      this.eliminarDepartamento(departamento.id);
    }
  }

  openModal(modalId: string): void {
    const modalElement = document.getElementById(modalId) as HTMLElement;
    if (modalElement) {
      const modalInstance = new Modal(modalElement);
      modalInstance.show();
    }
  }

  closeModal(modalId: string): void {
    const modalElement = document.getElementById(modalId) as HTMLElement;
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement);
      modalInstance?.hide();
    }
  }
}
