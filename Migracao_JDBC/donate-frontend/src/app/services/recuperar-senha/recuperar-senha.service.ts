import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecuperarSenhaService {

  private baseUrl = 'http://localhost:8080/recuperar-senha'; // Ajuste se necessário

  constructor(private http: HttpClient) { }

  // 1️⃣ Enviar código de verificação
  enviarCodigo(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/enviar-codigo`, { email });
  }

  // 2️⃣ Validar código
  validarCodigo(email: string, codigo: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/validar-codigo`, { email, codigo });
  }

  // 3️⃣ Resetar senha
  resetarSenha(email: string, codigo: string, novaSenha: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/resetar-senha`, { email, codigo, novaSenha });
  }
}
