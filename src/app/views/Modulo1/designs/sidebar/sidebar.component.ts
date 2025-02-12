import { Component, Input, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';

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
  activeLink: string = '';
  usuario!: Usuario; // Define el tipo correcto para el usuario
  userRole: string | undefined;
  submenuOpen = false;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    // Suscribirse al observable del usuario para obtener el rol cuando esté disponible
    this.usuarioService.usuario$.subscribe((usuario) => {
      if (usuario) {
        this.userRole = usuario.rol.nombre; // Obtener el rol desde el usuario
        console.log('Rol del usuario:', this.userRole); // Verificar si el rol se asigna correctamente
      }
    });
  }

  toggleSubmenu() {
    this.submenuOpen = !this.submenuOpen;
  }
}
