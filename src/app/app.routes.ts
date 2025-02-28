import { Routes } from '@angular/router';

import { AuthComponent } from './auth/iniciarSesion/auth.component';
import { ErrorComponent } from './error/error.component';
import { isNotAuthenticatedGuard } from './guards/is-not-authenticated-guard.guard';
import { isAuthenticatedGuard } from './guards/is-authenticated.guard';
import { ActualizarContrasenaComponent } from './auth/actualizarContrasena/actualizarContrasena.component';
import { EnterEmailComponent } from './auth/recovery/enter-email/enter-email.component';
import { VerifyCodeComponent } from './auth/recovery/verify-code/verify-code.component';
import { ResetPasswordComponent } from './auth/recovery/reset-password/reset-password.component';
// Nombre de rutas
const error: string = '404'; // 0
const login: string = 'login'; // 1
const actualizarPassw: string = 'actualizar-contrasena';
const recoveryEmail: string = 'recovery/email';
const verifyCode: string = 'recovery/verify-code';
const resetPassword: string = 'recovery/reset-password';


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
  {
    path: actualizarPassw,
    canActivate: [],
    component: ActualizarContrasenaComponent,
    data: {
      title: capitalizeFirstLetter(actualizarPassw),
    },
  },
  {
    path: recoveryEmail,
    component: EnterEmailComponent,
    data: {
      title: capitalizeFirstLetter("Verificación de Correo"),
    },
  },
  {
    path: verifyCode,
    component: VerifyCodeComponent,
    data: {
      title: capitalizeFirstLetter("Verificación de Código"),
    },
  },
  {
    path: resetPassword,
    component: ResetPasswordComponent,
    data: {
      title: capitalizeFirstLetter("Nueva Contraseña"),
    },
  },
  // {
  //   path: error,
  //   component: ErrorComponent,
  //   data: { title: capitalizeFirstLetter(error) },
  // },
  { path: '**', redirectTo: error },
];
