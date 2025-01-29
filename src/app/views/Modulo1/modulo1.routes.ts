import { Routes } from '@angular/router';
import { Modulo1Component } from './modulo1.component';

import { HomeComponent } from './views/home/home.component';
import { LabsComponent } from './views/labs/labs.component';
import { ReservasComponent } from './views/reservas/reservas.component';
import { ProfileComponent } from './views/profile/profile.component';
import { ServiciosComponent } from './views/servicios/servicios.component';
import { ChatSoporteComponent } from './views/Admin/chat-soporte/chat-soporte.component';
import { ChatGlobalComponent } from './views/Admin/chat-global/chat-global.component';
import { VerificarTareasComponent } from './views/Admin/verificar-tareas/verificar-tareas.component';
import { EmpleadosComponent } from './views/Admin/empleados/empleados.component';
import { SolicitudEmpleoComponent } from './views/Admin/solicitud-empleo/solicitud-empleo.component';
import { ChatsEmpleadoComponent } from './views/Employee/chats-empleado/chats-empleado.component';
import { TareasCompletadasComponent } from './views/Employee/tareas-completadas/tareas-completadas.component';
import { CarteraComponent } from './views/Employee/cartera/cartera.component';
import { SoporteEmpleadoComponent } from './views/Employee/soporte-empleado/soporte-empleado.component';
import { ChatsClienteComponent } from './views/Client/chats-cliente/chats-cliente.component';
import { SoporteClienteComponent } from './views/Client/soporte-cliente/soporte.component';
import { isAuthenticatedGuard } from 'src/app/guards/is-authenticated.guard';
import { ServiciosAdminComponent } from './views/servicios-admin/servicios-admin.component';

const home: string = 'dashboard';
const labs: string = 'laboratorios';
const reservas: string = 'reservas';
const profile: string = 'perfil';
const servicios: string = 'servicios';
const serviciosAdmin: string = 'servicios-admin';

const admin: string = 'administrador/';
const chatGlobal: string = admin + 'chat-globa/:id';
const chatSoporte: string = admin + 'chat-soporte';
const verificarTareas: string = admin + 'verificar-tareas';
const empleados: string = admin + 'empleados';
const solicitudEmpleo: string = admin + 'solicitud-empleo';

const employee: string = 'jugador/';
const chatEmpleado: string = employee + 'chat/:id';
const tareasCompletadas: string = employee + 'tareas-completadas';
const cartera: string = employee + 'cartera';
const soporteEmpleado: string = employee + 'soporte';

const client: string = 'cliente/';
const chatCliente: string = client + 'chat/clietne/:id';
const soporteCliente: string = client + 'soporte';

export const routesArrayModulo1: string[] = [
  '/' + home,
  '/' + labs,
  '/' + reservas,
  '/' + profile,
  '/' + servicios,
  '/' + chatGlobal,
  '/' + chatSoporte,
  '/' + verificarTareas,
  '/' + empleados,
  '/' + solicitudEmpleo,
  '/' + chatEmpleado,
  '/' + tareasCompletadas,
  '/' + cartera,
  '/' + soporteEmpleado,
  '/' + chatCliente,
  '/' + soporteCliente,
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
        component: LabsComponent,
        data: {
          title: capitalizeFirstLetter(labs),
        },
      },
      {
        path: reservas,
        canActivate: [isAuthenticatedGuard],
        component: ReservasComponent,
        data: {
          title: capitalizeFirstLetter(reservas),
        },
      },
      {
        path: profile,
        canActivate: [isAuthenticatedGuard],
        component: ProfileComponent,
        data: {
          title: capitalizeFirstLetter(profile),
        },
      },
      // Compartidas
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
      // ADMINISTRADOR
      {
        path: chatGlobal,
        canActivate: [isAuthenticatedGuard],
        component: ChatGlobalComponent,
        data: {
          title: capitalizeFirstLetter(chatGlobal),
        },
      },
      {
        path: chatSoporte,
        component: ChatSoporteComponent,
        canActivate: [isAuthenticatedGuard],
        data: {
          title: capitalizeFirstLetter(chatSoporte),
        },
      },
      {
        path: verificarTareas,
        component: VerificarTareasComponent,
        canActivate: [isAuthenticatedGuard],
        data: {
          title: capitalizeFirstLetter(verificarTareas),
        },
      },
      {
        path: empleados,
        canActivate: [isAuthenticatedGuard],
        component: EmpleadosComponent,
        data: {
          title: capitalizeFirstLetter(empleados),
        },
      },
      {
        path: solicitudEmpleo,
        canActivate: [isAuthenticatedGuard],
        component: SolicitudEmpleoComponent,
        data: {
          title: capitalizeFirstLetter(solicitudEmpleo),
        },
      },
      // EMPLEADO
      {
        path: chatEmpleado,
        canActivate: [isAuthenticatedGuard],
        component: ChatsEmpleadoComponent,
        data: {
          title: capitalizeFirstLetter(chatEmpleado),
        },
      },
      {
        path: tareasCompletadas,
        component: TareasCompletadasComponent,
        canActivate: [isAuthenticatedGuard],
        data: {
          title: capitalizeFirstLetter(tareasCompletadas),
        },
      },
      {
        path: cartera,
        canActivate: [isAuthenticatedGuard],
        component: CarteraComponent,
        data: {
          title: capitalizeFirstLetter(cartera),
        },
      },
      {
        path: soporteEmpleado,
        canActivate: [isAuthenticatedGuard],
        component: SoporteEmpleadoComponent,
        data: {
          title: capitalizeFirstLetter(soporteEmpleado),
        },
      },
      // CLIENTE
      {
        path: chatCliente,
        canActivate: [isAuthenticatedGuard],
        component: ChatsClienteComponent,
        data: {
          title: capitalizeFirstLetter(chatCliente),
        },
      },
      {
        path: soporteCliente,
        canActivate: [isAuthenticatedGuard],
        component: SoporteClienteComponent,
        data: {
          title: capitalizeFirstLetter(soporteCliente),
        },
      },
    ],
  },
];
