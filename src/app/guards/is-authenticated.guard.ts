import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { UsuarioService } from '../core/services/usuario.service';
import { SocketService } from '../core/services/socket.service';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const usuarioService = inject(UsuarioService);
  const router = inject(Router);
  const socketService = inject(SocketService);
  return usuarioService.validarToken().pipe(
    tap((isAuthenticated) => {
      if (isAuthenticated) {
        if (!socketService.isConnectedSocket()) {
          socketService.connect(localStorage.getItem('token') || '');
        }
      } else {
        router.navigate(['./login'], {
          queryParams: { returnUrl: state.url },
        });
      }
    })
  );
};
