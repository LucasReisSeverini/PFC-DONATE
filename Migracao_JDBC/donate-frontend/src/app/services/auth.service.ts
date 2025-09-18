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
    return this.http.post<LoginResponse>(this.loginUrl, { email, senha, latitude, longitude }).pipe(
      tap((response: LoginResponse) => {
        if (response?.token) {
          localStorage.setItem('token', response.token);

          // Decodifica o token para pegar o id e salvar no localStorage
          const payloadBase64 = response.token.split('.')[1];
          const payloadJson = atob(payloadBase64);
          const payload = JSON.parse(payloadJson);

          if (payload.id) {
            localStorage.setItem('id', payload.id.toString());
            console.log('ID salvo no localStorage:', payload.id);
          } else {
            console.warn('ID do usuário não está presente no token.');
          }

          this.router.navigate(['/painel']); // Redireciona para painel
        } else {
          console.warn('Token não foi retornado no login!');
        }
      })
    );
  }

  register(dados: any): Observable<any> {
    return this.http.post(this.registerUrl, dados);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  // Aqui SEM o header manual, o interceptor adiciona o token automaticamente
  getPerfil() {
    console.log('Requisição getPerfil() chamada');
    return this.http.get<any>('http://localhost:8080/usuarios/email');
  }
}
