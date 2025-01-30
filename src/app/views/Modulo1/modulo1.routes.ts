import { Routes } from '@angular/router';
import { Modulo1Component } from './modulo1.component';

import { HomeComponent } from './views/home/home.component';
import { LaboratorioComponent } from './views/laboratorio/laboratorio.component';
import { ReservaComponent } from './views/reserva/reserva.component';
import { MateriaComponent } from './views/materia/materia.component';
import { ServiciosComponent } from './views/servicios/servicios.component';
import { isAuthenticatedGuard } from 'src/app/guards/is-authenticated.guard';
import { ServiciosAdminComponent } from './views/servicios-admin/servicios-admin.component';

const home: string = 'dashboard';
const laboratorio: string = 'laboratorio';
const reserva: string = 'reserva';
const materia: string = 'materia';
const profile: string = 'perfil';
const servicios: string = 'servicios';
const serviciosAdmin: string = 'servicios-admin';

export const routesArrayModulo1: string[] = [
  '/' + home,
  '/' + laboratorio,
  '/' + reserva,
  '/' + materia,
  '/' + profile,
  '/' + servicios,
  '/' + serviciosAdmin,
];

// Convertir primera en mayuscula
function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const routesModulo1: Routes = [
  {
    path: '',

    component: Modulo1Component,

    children: [
      {
        path: '',
        redirectTo: home,
        pathMatch: 'full',
      },
      // GENERAL
      {
        path: home,
        component: HomeComponent,
        canActivate: [isAuthenticatedGuard],
        data: {
          title: capitalizeFirstLetter(home),
        },
      },
      {
        path: laboratorio,
        canActivate: [isAuthenticatedGuard],
        component: LaboratorioComponent,
        data: {
          title: capitalizeFirstLetter(laboratorio),
        },
      },
      {
        path: reserva,
        canActivate: [isAuthenticatedGuard],
        component: ReservaComponent,
        data: {
          title: capitalizeFirstLetter(reserva),
        },
      },
      {
        path: materia,
        canActivate: [isAuthenticatedGuard],
        component: MateriaComponent,
        data: {
          title: capitalizeFirstLetter(materia),
        },
      },
      {
        path: servicios,
        canActivate: [isAuthenticatedGuard],
        component: ServiciosComponent,
        data: {
          title: capitalizeFirstLetter(servicios),
        },
      },
      {
        path: serviciosAdmin,
        canActivate: [isAuthenticatedGuard],
        component: ServiciosAdminComponent,
        data: {
          title: capitalizeFirstLetter(serviciosAdmin),
        },
      },
    ],
  },
];
