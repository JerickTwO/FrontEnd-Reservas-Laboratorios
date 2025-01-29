import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [TableModule, CommonModule],
  templateUrl: './empleados.component.html',
  styleUrl: './empleados.component.scss'
})
export class EmpleadosComponent {

}
