import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AgendamentoDto } from '../../domain/dto/controle-agendamento.dto';

@Injectable({
  providedIn: 'root'
})
export class ControleAgendamentoService {
  private apiUrl = 'http://localhost:8080/doacoes';

  constructor(private http: HttpClient) {}

  listarAgendamentos(): Observable<AgendamentoDto[]> {
    return this.http.get<AgendamentoDto[]>(this.apiUrl);
  }

  aceitarAgendamento(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/aceitar`, {});
  }

  reagendarAgendamento(id: number, novaData: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/reagendar`, { novaData });
  }

  recusarAgendamento(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/recusar`, {});
  }
}
