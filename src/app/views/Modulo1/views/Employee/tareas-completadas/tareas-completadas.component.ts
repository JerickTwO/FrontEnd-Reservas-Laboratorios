import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { OrderService } from 'src/app/core/services/order.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { OrderUser } from 'src/app/interfaces/orden.interface';

@Component({
  selector: 'app-tareas-completadas',
  standalone: true,
  imports: [TabViewModule, DialogModule, CommonModule],
  templateUrl: './tareas-completadas.component.html',
  styleUrl: './tareas-completadas.component.scss'
})
export class TareasCompletadasComponent implements OnInit {

  visible: boolean = false;
  orderFinis: OrderUser[] = [];
  listCompletedOrders: OrderUser[] = [];
  currentOrder: OrderUser | undefined;
  duration: string = '';

  constructor(
    private router: Router,
     private orderService: OrderService,
     private usuarioService: UsuarioService,
    ) {}

  ngOnInit(): void {
    this.getOrdersForEmployee();
  }

  showDialog() {
    this.visible = true;
  }

  getOrdersForEmployee(): void {
    this.orderService.getOrdersForEmployee(
      this.usuarioService.uid
    ).subscribe((orders) => {
      console.log(orders);

      this.listCompletedOrders = orders.map((order) => {
        return {
          ...order,
          duration: this.getDuration(
            order.date_start_chat || '',
            order.date_finish_chat || ''
          ),
        };
      });
    });
  }

  getDuration(start: string, finish: string): string {
    const dateStart = new Date(start);
    const dateFinish = new Date(finish);
    const duration = dateFinish.getTime() - dateStart.getTime();
    const hours = Math.floor(duration / 3600000);
    const minutes = Math.floor((duration % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  }

  navigateToPage(order_item_id: number): void {
    this.router.navigate(['administrador/chat-globa', order_item_id]);
  }

}
