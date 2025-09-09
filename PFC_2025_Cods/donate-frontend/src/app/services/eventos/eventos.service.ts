import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Evento {
  id?: number;
  titulo: string;
  descricao: string;
  data: string;
  tipo: 'evento' | 'noticia';
}

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  private baseUrl = 'http://localhost:8080/eventos';

  constructor(private http: HttpClient) { }

  // Listar todos os eventos/notícias
  listarEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseUrl}`);
  }

  // Adicionar um novo evento/notícia
  adicionarEvento(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(`${this.baseUrl}`, evento);
  }

  // Excluir evento/notícia
  excluirEvento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Atualizar evento/notícia
  atualizarEvento(evento: Evento): Observable<Evento> {
    return this.http.put<Evento>(`${this.baseUrl}/${evento.id}`, evento);
  }

  // Buscar evento/notícia por ID
  buscarEventoPorId(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.baseUrl}/${id}`);
  }

}
