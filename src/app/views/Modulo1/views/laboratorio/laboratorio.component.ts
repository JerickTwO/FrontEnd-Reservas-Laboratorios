import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { LaboratorioService } from 'src/app/core/services/laboratorio.service';
import { Laboratorio } from 'src/app/models/laboratorio.model';

@Component({
  selector: 'app-laboratorio',
  standalone: true,
  imports: [], // Importar NgFor y NgIf
  templateUrl: './laboratorio.component.html',
})
export class LabsComponent implements OnInit {
  laboratorios: Laboratorio[] = [];
  laboratoriosPaginados: Laboratorio[] = [];
  error: string | null = null;
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;

  constructor(private laboratorioService: LaboratorioService) {}

  ngOnInit(): void {
    this.obtenerLaboratorios();
  }

  obtenerLaboratorios(): void {
    this.laboratorioService.getLaboratorios().subscribe({
      next: (data) => {
        this.laboratorios = data;
        this.totalPages = Math.ceil(this.laboratorios.length / this.itemsPerPage);
        this.actualizarPaginacion();
        this.error = null;
      },
      error: (error) => {
        this.error = 'Error al obtener los laboratorios';
        console.error(error);
      },
    });
  }

  actualizarPaginacion(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.laboratoriosPaginados = this.laboratorios.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.actualizarPaginacion();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.actualizarPaginacion();
    }
  }
}
