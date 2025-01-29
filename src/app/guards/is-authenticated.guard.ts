import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { UsuarioService } from '../core/services/usuario.service';
import { SocketService } from '../core/services/socket.service';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const socketService = inject(SocketService);

  const token = localStorage.getItem('token');

  if (token) {
    if (!socketService.isConnectedSocket()) {
      socketService.connect(token);
    }
    return true; // Permite el acceso si hay un token
  } else {
    router.navigate(['./login'], {
      queryParams: { returnUrl: state.url },
    });
    return false; // Redirige al login si no hay un token
  }
};

