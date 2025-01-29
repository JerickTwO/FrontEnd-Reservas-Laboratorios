import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { FinanceService } from 'src/app/core/services/finance.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { Finance } from 'src/app/interfaces/finance.interface';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';


// Step 2: Register the locale data with Angular
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-cartera',
  standalone: true,
  imports: [CardModule, ButtonModule, TableModule,TagModule,DividerModule, CommonModule],
  templateUrl: './cartera.component.html',
  styleUrl: './cartera.component.scss'
})
export class CarteraComponent implements OnInit {

  financeList: Finance[] = [];

  date = new Date();
  total = 0;

  transacciones = [
    {
      id: 6,
      admin_id: 41,
      user_id: 41,
      order_id: 143,
      status: 1,
      quantity: "22.00",
      created_at: "2024-07-21T19:04:52.000Z"
    },
    {
      id: 7,
      admin_id: 41,
      user_id: 41,
      order_id: 143,
      status: 1,
      quantity: "22.00",
      created_at: "2024-07-21T19:36:27.000Z"
    }
  ];

  constructor(
    private financeService: FinanceService,
    private usuarioService: UsuarioService,
  ) { }

  ngOnInit(): void {
    this.getFinanceByUserId();
  }

  getFinanceByUserId(): void {
    this.financeService.getFinanceByUserId(
      this.usuarioService.uid
    ).subscribe((finances) => {
      this.financeList = finances;
      this.total = this.financeList.reduce((sum, finance) => sum + parseFloat(finance.quantity), 0);
    });
  }

  getStatusText(status: number): string {
    switch (status) {
      case 0:
        return 'Pendiente';
      case 1:
        return 'Completado';
      case 2:
        return 'Cancelado';
      default:
        return '';
    }
  }

  getStatus(status: number): string {
    switch (status) {
      case 1:
        return 'En balance / Por verificar';
      case 2:
        return 'Verificado';
      case 3:
        return 'Completado';
      default:
        return 'Desconocido';
    }
  }
}
