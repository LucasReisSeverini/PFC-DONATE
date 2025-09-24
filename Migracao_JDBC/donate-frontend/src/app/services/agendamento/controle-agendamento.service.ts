import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AgendamentoDto } from '../../domain/dto/controle-agendamento.dto';

@Injectable({
  providedIn: 'root'
})
export class ControleAgendamentoService {
  private apiUrl = 'http://localhost:8080/doacoes';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  listarAgendamentos(): Observable<AgendamentoDto[]> {
    return this.http.get<AgendamentoDto[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  aceitarAgendamento(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/aceitar`, {}, { headers: this.getAuthHeaders() });
  }

  recusarAgendamento(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/recusar`, {}, { headers: this.getAuthHeaders() });
  }

  reagendarAgendamento(id: number, novaData: string): Observable<void> {
    // Mandar como string simples igual ao AgendamentoService
    return this.http.put<void>(`${this.apiUrl}/${id}/reagendar`, `"${novaData}"`, { headers: this.getAuthHeaders() });
  }
}
