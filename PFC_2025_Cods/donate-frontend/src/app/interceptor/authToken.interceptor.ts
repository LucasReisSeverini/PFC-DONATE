import { HttpInterceptorFn } from '@angular/common/http';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  console.log(`[AuthInterceptor] Interceptando requisição para: ${req.url}`);

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(`[AuthInterceptor] Header Authorization:`, authReq.headers.get('Authorization'));
    return next(authReq);
  }

  console.log(`[AuthInterceptor] Sem token, enviando requisição original para: ${req.url}`);
  return next(req);
};
