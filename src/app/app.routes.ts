import { Routes } from '@angular/router';

import { AuthComponent } from './auth/auth.component';
import { ErrorComponent } from './error/error.component';
import { isNotAuthenticatedGuard } from './guards/is-not-authenticated-guard.guard';

// Nombre de rutas
const error: string = '404'; // 0
const login: string = 'login'; // 1


export const routesArray: string[] = ['/' + error, '/' + login];

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const routes: Routes = [
  {
    path: login,
    component: AuthComponent,
    canActivate: [isNotAuthenticatedGuard],
    data: { title: capitalizeFirstLetter(login) },
  },
  // {
  //   path: error,
  //   component: ErrorComponent,
  //   data: { title: capitalizeFirstLetter(error) },
  // },
  { path: '**', redirectTo: error },
];
