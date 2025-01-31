import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Modulo1Component } from './views/Modulo1/modulo1.component';
import { Injector } from '@angular/core';
import { UsuarioService } from './core/services/usuario.service';

export let AppInjector: Injector;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet, Modulo1Component],
})
export class AppComponent implements OnInit {
  // Titulos
  title = 'Gestión Académica';
  title_componentBase = '';

  constructor(
    private injector: Injector,
    private routerBase: Router,
    private activatedRouteBase: ActivatedRoute,
    private titleServiceBase: Title,
  ) {
    AppInjector = this.injector;
  }

  ngOnInit(): void {
    this.routerBase.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.title_componentBase =
          this.getRouteDataBase(this.activatedRouteBase.root, 'title') ||
          'Default Title';

        // Encuentra la posición del último "/"
        const lastIndex = this.title_componentBase.lastIndexOf('/');

        // Extrae el texto después del último "/"
        const extractedTitle =
          lastIndex !== -1
            ? this.title_componentBase.substring(lastIndex + 1)
            : this.title_componentBase;

        // Formatea el texto extraído (capitaliza la primera letra y reemplaza guiones con espacios)
        const formattedTitle = this.formatTitle(extractedTitle);

        // Establece el título en la pestaña del navegador
        this.titleServiceBase.setTitle(formattedTitle);

        // Url de la ruta
        document.documentElement.style.setProperty(
          '--title-length',
          formattedTitle.length.toString()
        );
      }
    });
  }

  // Navegacion
  getRouteDataBase(route: ActivatedRoute, key: string): any {
    if (route.firstChild) {
      const childData = this.getRouteDataBase(route.firstChild, key);
      return childData instanceof Observable ? null : childData;
    }
    return (
      route && route.snapshot && route.snapshot.data && route.snapshot.data[key]
    );
  }

  // Convertir primera en mayuscula
  capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Capitalizar la primera letra de una cadena y reemplazar guiones con espacios
  formatTitle(text: string): string {
    const titleWithoutDash = text.replace(/-/g, ' ');
    return this.capitalizeFirstLetter(titleWithoutDash);
  }

  // connectSocket() {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     this.socketService.connect(token);
  //   }
  // }
}
