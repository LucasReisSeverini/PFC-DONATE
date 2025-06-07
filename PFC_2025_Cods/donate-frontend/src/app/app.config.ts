// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { materialImports } from './material';
import { authTokenInterceptor } from './interceptor/authToken.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authTokenInterceptor])),
    provideRouter(routes),
    provideAnimationsAsync(),
    ...materialImports,
  ]
};
