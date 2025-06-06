import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    console.log(`[AuthInterceptor] Interceptando requisição para: ${req.url}`);

    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(`[AuthInterceptor] Header Authorization:`, authReq.headers.get('Authorization'));
      return next.handle(authReq);
    }

    console.log(`[AuthInterceptor] Sem token, enviando requisição original para: ${req.url}`);
    return next.handle(req);
  }
}
