import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoacaoService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getBancosDeLeite(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/bancos/listar`);
  }

  agendarDoacao(dados: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/doacoes`, dados);
  }
}

