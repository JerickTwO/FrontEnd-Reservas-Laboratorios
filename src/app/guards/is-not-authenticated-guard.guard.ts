import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from '../core/services/usuario.service';
import { inject } from '@angular/core';
import { map, tap } from 'rxjs/operators';

export const isNotAuthenticatedGuard: CanActivateFn = (route, state) => {
  console.log('isNotAuthenticatedGuard');

  const authService = inject(UsuarioService);
  const router = inject(Router);

  return authService.validarToken().pipe(
    map((isAuthenticated) => !isAuthenticated),
    tap((isNotAuthenticated) => {
      if (!isNotAuthenticated) {
        router.navigate(['/jugador/chat/1']);
      }
    })
  );
};
