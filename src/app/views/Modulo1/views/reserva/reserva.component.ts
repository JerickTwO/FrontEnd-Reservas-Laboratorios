import { Component, OnInit } from '@angular/core';
import { ReservaService } from 'src/app/core/services/reserva.service';
import { Reserva } from 'src/app/models/reserva.model';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { PaginationComponent } from '../pagination/pagination.component';
@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [PaginationComponent],
  templateUrl: './reserva.component.html',
})
export class ReservaComponent implements OnInit {
  reservas: Reserva[] = [];
  reservasPaginadas: Reserva[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;

  constructor(private reservaService: ReservaService, private paginationService: PaginationService) { }

  ngOnInit(): void {
    this.obtenerReservas();
  }

  trackById(index: number, item: Reserva): number {
    return item.idReserva;
  }

  obtenerReservas(): void {
    this.reservaService.getReservas().subscribe({
      next: (data) => {
        this.reservas = data;
        this.totalPages = Math.ceil(this.reservas.length / this.itemsPerPage);
        this.actualizarPaginacion();
      },
      error: (error) => console.error('Error al obtener reservas', error),
    });
  }

  actualizarPaginacion(): void {
    this.reservasPaginadas = this.paginationService.paginate(this.reservas, this.currentPage, this.itemsPerPage);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.actualizarPaginacion();
  }
}