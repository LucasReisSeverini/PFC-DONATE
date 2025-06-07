import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ControleAgendamentoService {
  private apiUrl = 'http://localhost:3000/controle-agendamento';

  constructor(private http: HttpClient) {}

  listarAgendamentos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  aceitarAgendamento(id: number) {
    return this.http.post(`${this.apiUrl}/${id}/aceitar`, {});
  }

  reagendarAgendamento(id: number, novaData: string) {
    return this.http.put(`${this.apiUrl}/${id}/reagendar`, { novaData });
  }

  recusarAgendamento(id: number) {
    return this.http.post(`${this.apiUrl}/${id}/recusar`, {});
  }
}
