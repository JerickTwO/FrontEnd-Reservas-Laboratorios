import { Routes } from '@angular/router';
import { Modulo1Component } from './modulo1.component';

import { HomeComponent } from './views/home/home.component';
import { LaboratorioComponent } from './views/laboratorio/laboratorio.component';
import { ReservaComponent } from './views/reserva/reserva.component';
import { MateriaComponent } from './views/materia/materia.component';
import { AdminComponent } from './views/admin/admin.component';
import { DocenteComponent } from './views/docente/docente.component';
import { UsuarioComponent } from './views/usuario/usuario.component';
import { isAuthenticatedGuard } from 'src/app/guards/is-authenticated.guard';
import { DepartamentosComponent } from './views/departamentos/departamentos.component';
import { CarrerasComponent } from './views/carreras/carreras.component';
import { ClaseComponent } from './views/clases/clases.component';
import { PeriodoComponent } from './views/periodo/periodo.component';
import { Horario1Component } from './views/horario1/horarios.component';
// import { Horario2Component } from './views/horario2/horarios.component';
// import { Horario3Component } from './views/horario3/horarios.component';
// import { Horario4Component } from './views/horario4/horarios.component';
// import { Horario5Component } from './views/horario5/horarios.component';
// import { Horario6Component } from './views/horario6/horarios.component';


const home: string = 'dashboard';
const laboratorio: string = 'laboratorio';
const reserva: string = 'reserva';
const materia: string = 'materia';
const profile: string = 'perfil';
const admin: string = 'admin'
const docente: string = 'docentes';
const usuario: string = 'usuarios';
const carreras: string = 'carreras';
const departamentos: string = 'departamentos';
const clases: string = 'clases'
const periodos: string = 'periodos'
const horarios: string = 'horarios/1'
const horario1: string = 'horarios/1'
const horario2: string = 'horarios/2'
const horario3: string = 'horarios/3'
const horario4: string = 'horarios/4'
const horario5: string = 'horarios/5'
const horario6: string = 'horarios/6'
export const routesArrayModulo1: string[] = [
  '/' + home,
  '/' + laboratorio,
  '/' + reserva,
  '/' + materia,
  '/' + profile,
  '/' + admin,
  '/' + docente,
  '/' + usuario,
  '/' + carreras,
  '/' + departamentos,
  '/' + clases,
  '/' + periodos,
  '/' + horarios,
  '/' + horario1,
  '/' + horario2,
  '/' + horario3,
  '/' + horario4,
  '/' + horario5,
  '/' + horario6,
];

// function obtenerLaboratorios(laboratorioService: LaboratorioService): void {
//   laboratorioService.getLaboratorios().subscribe(
//     (laboratorios) => {
//       console.log('Laboratorios:', laboratorios);
//     },
//     (error) => {
//       console.error('Error al obtener laboratorios:', error);
//     }
//   );
// }

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
        path: usuario,
        canActivate: [isAuthenticatedGuard],
        component: UsuarioComponent,
        data: {
          title: capitalizeFirstLetter(usuario),
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
      // {
      //   path: horarios,
      //   canActivate: [isAuthenticatedGuard],
      //   component: HorariosComponent,
      //   data: {
      //     title: capitalizeFirstLetter(`Horario ${horarios}`),
      //   },
      // },
      {
        path: horario1,
        canActivate: [isAuthenticatedGuard],
        component: Horario1Component,
        data: {
          title: capitalizeFirstLetter(`Horario ${horario1}`),
        },
      },
      // {
      //   path: horario2,
      //   canActivate: [isAuthenticatedGuard],
      //   component: Horario2Component,
      //   data: {
      //     title: capitalizeFirstLetter(`Horario ${horario2}`),
      //   },
      // }, {
      //   path: horario3,
      //   canActivate: [isAuthenticatedGuard],
      //   component: Horario3Component,
      //   data: {
      //     title: capitalizeFirstLetter(`Horario ${horario3}`),
      //   },
      // }, {
      //   path: horario4,
      //   canActivate: [isAuthenticatedGuard],
      //   component: Horario4Component,
      //   data: {
      //     title: capitalizeFirstLetter(`Horario ${horario4}`),
      //   },
      // }, {
      //   path: horario5,
      //   canActivate: [isAuthenticatedGuard],
      //   component: Horario5Component,
      //   data: {
      //     title: capitalizeFirstLetter(`Horario ${horario5}`),
      //   },
      // }, {
      //   path: horario6,
      //   canActivate: [isAuthenticatedGuard],
      //   component: Horario6Component,
      //   data: {
      //     title: capitalizeFirstLetter(`Horario ${horario6}`),
      //   },
      // },


      // {
      //   path: 'horario/:id',
      //   canActivate: [isAuthenticatedGuard],
      //   component: HorariosComponent,
      //   data: {
      //     title: capitalizeFirstLetter(horarios),
      //   }
      // },
    ],
  },
]

