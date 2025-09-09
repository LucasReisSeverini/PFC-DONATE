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

  private apiUrl = 'http://localhost:8080/eventos'; // Endpoint do backend

  constructor(private http: HttpClient) { }

  // Listar todos os eventos/notícias
  listarEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.apiUrl);
  }

  // Adicionar um novo evento/notícia
  adicionarEvento(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(this.apiUrl, evento);
  }
}
