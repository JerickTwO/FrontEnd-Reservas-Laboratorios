import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { LaboratorioService } from 'src/app/core/services/laboratorio.service';
import { Laboratorio } from 'src/app/models/laboratorio.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TooltipModule, CommonModule],
})
export class SidebarComponent implements OnInit {
  @Input() title!: string;
  @Input() sidebarHidden!: boolean;
  @Input() routes!: string[];
  laboratorios: Laboratorio[];
  @Input() reservas: any[] = [];

  @Output() labSeleccionado = new EventEmitter<string>();
  @Output() opcionSeleccionada = new EventEmitter<string>();

  laboratorioSeleccionado: any | null = null;
  opcionActiva: string = '';
  activeLink: string = '';
  usuario!: Usuario; // Define el tipo correcto para el usuario
  userRole: string | undefined;
  submenuOpen = false;

  constructor(
    private usuarioService: UsuarioService,
    private laboratorioService: LaboratorioService
  ) {}

  ngOnInit(): void {
    this.obtenerLaboratorios();
    this.usuarioService.usuario$.subscribe((usuario) => {
      if (usuario) {
        this.userRole = usuario.rol.nombre;
        console.log('Rol del usuario:', this.userRole);
      }
    });
    if (this.laboratorios.length > 0) {
      this.laboratorioSeleccionado = this.laboratorios[0];
      this.labSeleccionado.emit(this.laboratorioSeleccionado.id);
    }
  }

  toggleSubmenu() {
    this.submenuOpen = !this.submenuOpen;
  }
  obtenerLaboratorios(): void {
    this.laboratorioService.getLaboratorios().subscribe(
      (laboratorios) => {
        this.laboratorios = laboratorios;
        console.log('Laboratorios:', laboratorios);
      },
      (error) => {
        console.error('Error al obtener laboratorios:', error);
      }
    );
  }
  seleccionarLaboratorio(lab: any) {
    this.laboratorioSeleccionado = lab;
    this.labSeleccionado.emit(lab.id);
  }

  seleccionarOpcion(opcionId: string) {
    this.opcionActiva = opcionId;
    this.opcionSeleccionada.emit(opcionId);
  }
}
