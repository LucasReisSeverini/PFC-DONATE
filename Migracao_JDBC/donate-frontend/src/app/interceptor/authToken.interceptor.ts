import { HttpInterceptorFn, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router); // injetando Router no interceptor funcional
  const token = localStorage.getItem('token');
  console.log(`[AuthInterceptor] Interceptando requisição para: ${req.url}`);

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(`[AuthInterceptor] Header Authorization:`, authReq.headers.get('Authorization'));
  } else {
    console.log(`[AuthInterceptor] Sem token, enviando requisição original para: ${req.url}`);
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.log('[AuthInterceptor] Token expirado, deslogando...');
        localStorage.removeItem('token'); // limpa token
        router.navigate(['/login']); // redireciona para login
      }
      return throwError(() => error);
    })
  );
};
