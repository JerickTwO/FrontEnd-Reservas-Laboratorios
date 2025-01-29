import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { OrderService } from 'src/app/core/services/order.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { Order } from 'src/app/interfaces/orden.interface';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CardModule, CommonModule, RouterModule],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.scss',
})
export class ServiciosComponent implements OnInit {
  tipo: string = 'Streaming';
  costo: number = 50;
  time: string = '13:00';
  estado: string = 'Progreso';
  employee: string = 'Junito Perez';

  ordenes: Order[] = [];

  constructor(
    private orderService: OrderService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders(): void {
    this.orderService.getOrders().subscribe((orders) => {
      this.ordenes = orders.filter((order) => order.orderAccepted === 0);
    });
  }

  acceptOrder(order: Order): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres aceptar esta orden?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, aceptar!',
      cancelButtonText: 'No, cancelar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.orderService
          .acceptOrder(order.order_item_id, this.usuarioService.usuario.id)
          .subscribe(() => {
            this.router.navigate(['/jugador/chat', order.order_item_id]);
          });
      }
    });
  }
}
