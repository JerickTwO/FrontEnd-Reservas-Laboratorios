import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('token');

  if (token) {
    return true; // Permite el acceso si hay un token
  } else {
    router.navigate(['./login'], {
      queryParams: { returnUrl: state.url },
    });
    return false; // Redirige al login si no hay un token
  }
};

