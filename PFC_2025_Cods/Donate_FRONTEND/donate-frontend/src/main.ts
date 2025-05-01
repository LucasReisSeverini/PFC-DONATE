import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { materialImports } from './app/material'; // ✅ Importando os módulos Angular Material

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideAnimationsAsync(),
    ...materialImports, provideAnimationsAsync() // ✅ Adicionando os módulos do Angular Material aqui
  ]
}).catch((err) => console.error(err));

