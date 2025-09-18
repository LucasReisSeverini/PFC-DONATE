import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface do município conforme o backend
export interface Municipio {
  id: number;
  nome: string;
  unidadeFederativa: {
    id: number;
    nome: string;
    sigla: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class MunicipioService {
  private apiUrl = 'http://localhost:8080/municipio';

  constructor(private http: HttpClient) {}

  // ==================== GET ====================
  getMunicipios(): Observable<Municipio[]> {
    return this.http.get<Municipio[]>(this.apiUrl);
  }

  getMunicipioById(id: number): Observable<Municipio> {
    return this.http.get<Municipio>(`${this.apiUrl}/${id}`);
  }

  // ==================== POST ====================
  createMunicipio(municipio: Omit<Municipio, 'id'>): Observable<number> {
    return this.http.post<number>(this.apiUrl, municipio);
  }

  // ==================== PUT ====================
  updateMunicipio(id: number, municipio: Omit<Municipio, 'id'>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, municipio);
  }

  // ==================== DELETE ====================
  deleteMunicipio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
