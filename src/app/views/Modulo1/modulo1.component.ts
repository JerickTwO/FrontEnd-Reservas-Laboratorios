import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterOutlet } from '@angular/router';
import { routesArrayModulo1 } from './modulo1.routes';
import { SidebarService } from './services/sidebar.service';
import { NavbarComponent } from './designs/navbar/navbar.component';
import { ToastModule } from 'primeng/toast';
import { SidebarComponent } from './designs/sidebar/sidebar.component';
import { NgClass } from '@angular/common';
import { LaboratorioService } from 'src/app/core/services/laboratorio.service';

@Component({
  selector: 'modulo1-root',
  templateUrl: './modulo1.component.html',
  styleUrls: ['./modulo1.component.scss'],
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent, NgClass, ToastModule]
})
export class Modulo1Component implements OnInit {
  laboratorios: any[] = []; // Variable para almacenar los laboratorios

  // Titulos
  title = 'Reserva Laboratorios';
  title_component = '';

  // Timer
  timeRemaining: number | null = null;

  // Sidebar
  sidebarHidden: boolean = true;
  routesArray: string[] = [];

  constructor(
    private titleService: Title,
    private sidebarService: SidebarService,
    private laboratorioService: LaboratorioService,
    private router: Router
  ) {
    // Suscribirse a eventos de cambio de navegación
    this.router.events.subscribe((event) => {
      this.updateTitle();
    });

  }

  ngOnInit(): void {
    // 
    this.routesArray = routesArrayModulo1;

    // Actualizar el título cuando se carga la página por primera vez
    this.updateTitle();

    // Obtener el valor de 'sidebar' del localStorage
    this.sidebarHidden = this.sidebarService.checkSidebarStorage();

    // Cambiar nombre de dividers a -
    this.sidebarService.changeNameDividers(this.sidebarHidden);
    
    if (this.laboratorios.length === 0) {
      this.obtenerLaboratorios();
    }
  }


  // Función para actualizar el título de la página
  updateTitle() {
    const path: string = window.location.pathname;
    let newPath: string;

    // Verificar si la ruta incluye "/base-angular"
    const index = path.indexOf('/base-angular');

    if (index !== -1) {
      // Obtener la parte de la ruta después de "/base-angular"
      newPath = path.substring(index + '/base-angular'.length);
    } else {
      // Si no hay "/base-angular" en la ruta, simplemente usar la ruta completa
      newPath = path;
    }

    // Titulo de componente
    if (this.routesArray.includes(newPath)) {
      const parts: string[] = newPath.split('/');
      const lastPart: string = parts[parts.length - 1];
      const newTitle: string = this.formatTitle(lastPart) || 'Default Title'; // Se asegura de que el título no esté vacío

      // Decorador de titulo de componente
      if (this.title_component !== newTitle) {
        this.title_component = newTitle;
        this.titleService.setTitle(this.title_component);
        document.documentElement.style.setProperty('--title-length', this.title_component.length.toString());
      }
    }
  }

  // Capitalizar la primera letra de una cadena y reemplazar guiones con espacios
  formatTitle(text: string): string {
    const titleWithoutDash = text.replace(/-/g, ' ');
    return this.capitalizeFirstLetter(titleWithoutDash);
  }

  // Convertir primera en mayuscula
  capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
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

  ngAfterViewInit() {
    this.adjustViewsMinHeight();
    window.addEventListener('resize', () => this.adjustViewsMinHeight());
  }
  adjustViewsMinHeight() {
    const viewsElement = document.querySelector('.views') as HTMLElement;
    if (viewsElement) {
      const windowHeight = window.innerHeight;
      const currentTop = viewsElement.getBoundingClientRect().top;
      const minHeight = Math.max(windowHeight - currentTop - 45, 0);
      viewsElement.style.minHeight = `${minHeight}px`;
    }
  }
}
