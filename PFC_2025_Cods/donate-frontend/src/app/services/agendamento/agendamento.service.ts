import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  private apiUrl = 'http://localhost:3000/meus-agendamentos';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  listarDoUsuario(): Observable<any> {
    return this.http.get(`${this.apiUrl}/meus-agendamentos`);
  }

  cancelar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/cancelar`);
  }

  reagendar(id: number, novaData: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/reagendar`, { novaData });
  }

}
