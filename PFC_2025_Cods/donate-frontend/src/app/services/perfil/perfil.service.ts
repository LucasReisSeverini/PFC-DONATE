import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PerfilDto } from '../../domain/dto/perfil.dto';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  constructor(private http: HttpClient) {}

  // Aqui SEM o header manual, o interceptor adiciona o token automaticamente
getPerfil(): Observable<PerfilDto> {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token não encontrado.');
  }

  const payloadBase64 = token.split('.')[1];
  const payloadJson = atob(payloadBase64);
  const payload = JSON.parse(payloadJson);

  const email = payload.sub;
  if (!email) {
    throw new Error('E-mail não encontrado no token.');
  }

  // Aqui você passa o e-mail como query param: ?email=...
  return this.http.get<PerfilDto>(
    `http://localhost:8080/usuarios/email?email=${encodeURIComponent(email)}`
  );
}



  // Também sem header manual
  atualizarPerfil(dados: any): Observable<any> {
    console.log('Requisição atualizarPerfil() chamada com dados:', dados);
    return this.http.put('http://localhost:3000/usuarios/perfil/me', dados);
  }
}
