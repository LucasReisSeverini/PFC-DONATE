import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoacaoService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getBancosDeLeite(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/bancos-de-leite`);
  }

  agendarDoacao(dados: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.baseUrl}/doacao/doacoes`, dados, { headers });
  }
}
