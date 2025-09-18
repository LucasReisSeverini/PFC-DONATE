import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Evento atualizado para incluir idCidade
export interface Evento {
  id?: number;
  titulo: string;
  descricao: string;
  data: string;
  tipo: 'evento' | 'noticia';
  id_municipio: number; // <-- adicionado
}

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  private baseUrl = 'http://localhost:8080/eventos';

  constructor(private http: HttpClient) { }

  listarEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseUrl}`);
  }

  adicionarEvento(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(`${this.baseUrl}`, evento);
  }

  excluirEvento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  atualizarEvento(evento: Evento): Observable<Evento> {
    return this.http.put<Evento>(`${this.baseUrl}/${evento.id}`, evento);
  }

  buscarEventoPorId(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.baseUrl}/${id}`);
  }
}
