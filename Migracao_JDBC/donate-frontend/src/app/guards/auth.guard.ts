import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = localStorage.getItem('token'); // verifica login

    if (!token) {
      // não logado
      this.router.navigate(['/login']);
      return false;
    }

    // decodifica o token JWT
    let userRole = '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userRole = payload.role;
    } catch (err) {
      console.error('Token inválido', err);
      this.router.navigate(['/login']);
      return false;
    }

    // checa se a rota exige roles específicas
    const allowedRoles = route.data['allowedRoles'] as string[];
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      alert('Você não tem permissão para acessar esta página.');
      this.router.navigate(['/painel']); // redireciona para tela segura
      return false;
    }

    return true; // logado e com role permitido
  }
}
