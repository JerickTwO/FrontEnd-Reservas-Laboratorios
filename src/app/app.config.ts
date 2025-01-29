import { LOCALE_ID, ApplicationConfig } from '@angular/core';

import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { MessageService } from 'primeng/api';
import { provideNgxMask } from 'ngx-mask';


import { routes } from './app.routes';
import { routesModulo1 } from './views/Modulo1/modulo1.routes';
import { isAuthenticatedGuard } from './guards/is-authenticated.guard';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideRouter(routesModulo1),
    { provide: LOCALE_ID, useValue: 'es' },
    provideHttpClient(withInterceptors([])),
    provideAnimations(),
    MessageService,
    provideNgxMask()
  ]
};
