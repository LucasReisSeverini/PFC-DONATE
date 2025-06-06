import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

interface LoginResponse {
  token: string;
  usuario: any; // Ajuste conforme necessário
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://localhost:8080/auth/login'; // springboot
  private registerUrl = 'http://localhost:8080/usuarios/cadastro'; // springboot

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, senha: string, latitude?: number, longitude?: number): Observable<LoginResponse> {
//     console.log('Tentando login com:', { email, senha, latitude, longitude });

    return this.http.post<LoginResponse>(this.loginUrl, { email, senha, latitude, longitude }).pipe(
      tap((response: LoginResponse) => {
//         console.log('Resposta do login recebida:', response);

        if (response?.token) {
          localStorage.setItem('token', response.token);
//           console.log('Token salvo no localStorage:', localStorage.getItem('token'));
          this.router.navigate(['/painel']); // Redireciona para painel
        } else {
          console.warn('Token não foi retornado no login!');
        }
      })
    );
  }

  register(dados: any): Observable<any> {
//     console.log('Tentando registro com dados:', dados);
    return this.http.post(this.registerUrl, dados);
  }

  getToken() {
    const token = localStorage.getItem('token');
//     console.log('getToken() retornou:', token);
    return token;
  }

  // Aqui SEM o header manual, o interceptor adiciona o token automaticamente
  getPerfil() {
    console.log('Requisição getPerfil() chamada');
    return this.http.get<any>('http://localhost:8080/usuarios/email');
  }

  // Também sem header manual
  atualizarPerfil(dados: any) {
    console.log('Requisição atualizarPerfil() chamada com dados:', dados);
    return this.http.put('http://localhost:3000/usuarios/perfil/me', dados);
  }
}
