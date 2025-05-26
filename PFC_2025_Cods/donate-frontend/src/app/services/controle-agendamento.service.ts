import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ControleAgendamentoService {
  private apiUrl = 'http://localhost:3000/controle-agendamento';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  listarAgendamentos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, this.getHeaders());
  }

  aceitarAgendamento(id: number) {
    return this.http.put(`${this.apiUrl}/aceitar/${id}`, {}, this.getHeaders());
  }

  reagendarAgendamento(id: number, novaData: string) {
    return this.http.put(`${this.apiUrl}/reagendar/${id}`, { novaData }, this.getHeaders());
  }

  recusarAgendamento(id: number) {
    return this.http.put(`${this.apiUrl}/recusar/${id}`, {}, this.getHeaders());
  }
}
