import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { MenuService } from 'src/app/views/Modulo1/services/menu-profile.service';
import { MenuProfileComponent } from '../../components/menu-profile/menu-profile.component';
import { NgClass, AsyncPipe } from '@angular/common';
import { NotificationService } from 'src/app/core/services/notification.service';
import { NotificationComponent } from '../../components/notification/notification.component';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [NgClass, MenuProfileComponent, AsyncPipe, NotificationComponent]
})
export class NavbarComponent implements OnInit {

  // DATOS DE LA SESION
  firstname_user: string | null = 'Administrador';
  lastname_user: string | null = 'Sistema';

  // Sidebar y rutas
  @Input() routes!: string[];

  // Button top
  showScrollButton: boolean = false;

  // Balance
  balance: number = 0.00;

  // Notificaciones
  countNotifications: number = 9;

  constructor(
    public menuService: MenuService,
    public notificationService: NotificationService,
    private usuarioService: UsuarioService
  ) {
  }

  ngOnInit(): void {
    // Detectar el scroll y mostrar/ocultar el botón
    window.addEventListener('scroll', () => {
      this.showScrollButton = window.pageYOffset > 100;
      this.toggleButtonOpacity(); // Llamar a la función para controlar la opacidad del botón
    });
  }

  // Mostrar / Ocultar menu de perfil
  toggleMenuProfile() {
    this.menuService.toggleMenuProfile();
  }

  // Función para volver hacia arriba
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Transición de boton top
  toggleButtonOpacity() {
    const button = document.getElementById('btn_top');
    if (button) {
      if (this.showScrollButton) {
        button.classList.add('visible');
      } else {
        button.classList.remove('visible');
      }
    }
  }

  //===================================================================
  // Logout
  //===================================================================

  logout() {
    this.usuarioService.logout();
  }
}
