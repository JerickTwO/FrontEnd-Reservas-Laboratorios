import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';

// Importa la configuración regional de Colombia
import localeEs from '@angular/common/locales/es-CO';
import { registerLocaleData } from '@angular/common';

import { appConfig } from './app/app.config';

// Registra la zona horaria de Bogotá
registerLocaleData(localeEs);

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));

