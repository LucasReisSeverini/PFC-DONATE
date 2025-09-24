import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('token');

    // 🔓 libera acesso para rotas públicas
    const publicRoutes = ['/painel', '/eventos', '/banco-proximo', '/login', '/cadastro', '/recuperar-senha'];
    if (publicRoutes.includes(state.url)) {
      return true;
    }

    // 🔒 rotas protegidas: exige token
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    // valida token e extrai role
    let userRole = '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userRole = payload.role;
    } catch (err) {
      console.error('Token inválido', err);
      this.router.navigate(['/login']);
      return false;
    }

    // checa roles exigidas
    const allowedRoles = route.data['allowedRoles'] as string[];
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      alert('Você não tem permissão para acessar esta página.');
      this.router.navigate(['/painel']);
      return false;
    }

    return true; // tudo ok
  }
}
