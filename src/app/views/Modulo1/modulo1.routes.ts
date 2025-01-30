import { Routes } from '@angular/router';
import { Modulo1Component } from './modulo1.component';

import { HomeComponent } from './views/home/home.component';
import { LaboratorioComponent } from './views/laboratorio/laboratorio.component';
import { ReservaComponent } from './views/reserva/reserva.component';
import { ServiciosComponent } from './views/servicios/servicios.component';
import { isAuthenticatedGuard } from 'src/app/guards/is-authenticated.guard';
import { ServiciosAdminComponent } from './views/servicios-admin/servicios-admin.component';

const home: string = 'dashboard';
const labs: string = 'laboratorios';
const reservas: string = 'reservas';
const profile: string = 'perfil';
const servicios: string = 'servicios';
const serviciosAdmin: string = 'servicios-admin';

export const routesArrayModulo1: string[] = [
  '/' + home,
  '/' + labs,
  '/' + reservas,
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
        path: labs,
        canActivate: [isAuthenticatedGuard],
        component: LaboratorioComponent,
        data: {
          title: capitalizeFirstLetter(labs),
        },
      },
      {
        path: reservas,
        canActivate: [isAuthenticatedGuard],
        component: ReservaComponent,
        data: {
          title: capitalizeFirstLetter(reservas),
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
