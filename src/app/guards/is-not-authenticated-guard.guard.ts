import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from '../core/services/usuario.service';
import { inject } from '@angular/core';
import { map, tap } from 'rxjs/operators';

export const isNotAuthenticatedGuard: CanActivateFn = (route, state) => {
  console.log('isNotAuthenticatedGuard');

  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    return true; // Permite el acceso si no hay un token
  } else {
    router.navigate(['/dashboard']);
    return false; // Redirige si el usuario ya está autenticado
  }
};

