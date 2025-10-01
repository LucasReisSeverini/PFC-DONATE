import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BancoLeite {
  id?: number;
  nome: string;
  endereco: string;
  telefone: string;
  latitude?: number;
  longitude?: number;
  idMunicipio: number;
}

@Injectable({
  providedIn: 'root'
})
export class BancoService {
  private readonly apiUrl = 'http://localhost:8080/bancos';

  constructor(private http: HttpClient) {}

  // Buscar o banco mais próximo
  buscarBancoMaisProximo(lat: number, lng: number): Observable<any> {
    const params = { latitude: lat, longitude: lng };
    return this.http.get<any>(`${this.apiUrl}/proximo`, { params });
  }

  // Cadastrar novo banco de leite
  adicionarBanco(banco: BancoLeite): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/add`, banco);
  }

  // Listar todos os bancos de leite
  listarTodos(): Observable<BancoLeite[]> {
    return this.http.get<BancoLeite[]>(`${this.apiUrl}/listar`);
  }
}
