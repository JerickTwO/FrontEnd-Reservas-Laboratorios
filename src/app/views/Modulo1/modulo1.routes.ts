import { Routes } from '@angular/router';
import { Modulo1Component } from './modulo1.component';

import { HomeComponent } from './views/home/home.component';
import { LaboratorioComponent } from './views/laboratorio/laboratorio.component';
import { ReservaComponent } from './views/reserva/reserva.component';
import { MateriaComponent } from './views/materia/materia.component';
import { AdminComponent } from './views/admin/admin.component';
import { DocenteComponent } from './views/docente/docente.component';
import { EstudianteComponent } from './views/estudiante/estudiante.component';
import { isAuthenticatedGuard } from 'src/app/guards/is-authenticated.guard';
import { DepartamentosComponent } from './views/departamentos/departamentos.component';
import { CarrerasComponent } from './views/carreras/carreras.component';
import { HorariosComponent } from './views/horarios/horarios.component';
import { ClaseComponent } from './views/clases/clases.component';
import { PeriodoComponent } from './views/periodo/periodo.component';

const home: string = 'dashboard';
const laboratorio: string = 'laboratorio';
const reserva: string = 'reserva';
const materia: string = 'materia';
const profile: string = 'perfil';
const admin: string = 'admin'
const docente: string = 'docentes';
const estudiante: string = 'estudiantes';
const carreras: string = 'carreras';
const departamentos: string = 'departamentos';
const clases: string = 'clases'
const periodos: string = 'periodos'
const horarios: string = 'horarios'
export const routesArrayModulo1: string[] = [
  '/' + home,
  '/' + laboratorio,
  '/' + reserva,
  '/' + materia,
  '/' + profile,
  '/' + admin,
  '/' + docente,
  '/' + estudiante,
  '/' + carreras,
  '/' + departamentos,
  '/' + clases,
  '/' + periodos,
  '/' + horarios,
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
        path: admin,
        canActivate: [isAuthenticatedGuard],
        component: AdminComponent,
        data: {
          title: capitalizeFirstLetter(admin),
        },
      },
      {
        path: docente,
        canActivate: [isAuthenticatedGuard],
        component: DocenteComponent,
        data: {
          title: capitalizeFirstLetter(docente),
        },
      },
      {
        path: estudiante,
        canActivate: [isAuthenticatedGuard],
        component: EstudianteComponent,
        data: {
          title: capitalizeFirstLetter(estudiante),
        },
      },
      {
        path: departamentos,
        canActivate: [isAuthenticatedGuard],
        component: DepartamentosComponent,
        data: {
          title: capitalizeFirstLetter(departamentos),
        },
      },
      {
        path: carreras,
        canActivate: [isAuthenticatedGuard],
        component: CarrerasComponent,
        data: {
          title: capitalizeFirstLetter(carreras),
        },
      },
      {
        path: clases,
        canActivate: [isAuthenticatedGuard],
        component: ClaseComponent,
        data: {
          title: capitalizeFirstLetter(clases),
        },
      },
      {
        path: periodos,
        canActivate: [isAuthenticatedGuard],
        component: PeriodoComponent,
        data: {
          title: capitalizeFirstLetter(periodos),
        },
      },
      {
      path: horarios,
        canActivate: [isAuthenticatedGuard],
        component: HorariosComponent,
        data: {
          title: capitalizeFirstLetter(horarios),
        },
      },
    ],
  },
];
