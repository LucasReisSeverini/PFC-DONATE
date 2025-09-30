import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioDto } from '../../domain/dto/usuario.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/usuarios';

  constructor() {}

  // Pegar todos os usuários
  getAllUsers(): Observable<UsuarioDto[]> {
    return this.http.get<UsuarioDto[]>(`${this.baseUrl}`);
  }

  // Alterar role do usuário
  setUserRole(
    userId: number,
    admin: boolean,
    doadora: boolean,
    receptora: boolean,
    profissional: boolean
  ): Observable<void> {
    const params = {
      admin: String(admin),
      doadora: String(doadora),
      receptora: String(receptora),
      profissional: String(profissional)
    };
    return this.http.put<void>(`${this.baseUrl}/admin/${userId}/set-role`, null, { params });
  }

  // Deletar usuário
  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${userId}`);
  }
}
