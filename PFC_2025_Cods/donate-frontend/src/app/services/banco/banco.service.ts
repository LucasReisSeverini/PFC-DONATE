// src/app/services/banco.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BancoService {
  constructor(private http: HttpClient) {}

  buscarBancoMaisProximo(lat: number, lng: number): Observable<any> {
    const params = { latitude: lat, longitude: lng };
    return this.http.get<any>('http://localhost:8080/bancos/proximo', { params });
  }

}
