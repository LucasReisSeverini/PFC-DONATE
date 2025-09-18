import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  private baseUrl = 'http://localhost:8080/doacoes';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  listarDoUsuario(): Observable<any> {
    const idUsuario = localStorage.getItem('id');
    return this.http.get(`${this.baseUrl}/usuario/${idUsuario}`, {
      headers: this.getAuthHeaders()
    });
  }

  cancelar(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  reagendar(id: number, novaData: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/reagendar`, `"${novaData}"`, {
      headers: this.getAuthHeaders()
    });
  }
}
