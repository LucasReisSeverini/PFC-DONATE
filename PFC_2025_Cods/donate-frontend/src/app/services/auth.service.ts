import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http'; // <-- Aqui está o HttpHeaders


interface LoginResponse {
  token: string;
  usuario: any; // Ajuste conforme necessário
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://localhost:3000/usuarios/login';
  private registerUrl = 'http://localhost:3000/usuarios/cadastro';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, senha: string, latitude?: number, longitude?: number): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, { email, senha, latitude, longitude }).pipe(
      tap((response: LoginResponse) => {
        if (response?.token) {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/painel']); // Redireciona para agendamento
        }
      })
    );
  }

  register(dados: any): Observable<any> {
    return this.http.post(this.registerUrl, dados);
  }

  getToken() {
    return localStorage.getItem('token'); // ou sessionStorage, dependendo de onde salvou
  }

getPerfil() {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any>('http://localhost:3000/usuarios/perfil/me', { headers });
}


  atualizarPerfil(dados: any) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.put('http://localhost:3000/usuarios/perfil/me', dados, { headers });
  }
}


