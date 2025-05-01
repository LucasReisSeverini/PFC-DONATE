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
    return this.http.post<any>('http://localhost:3000/bancos/proximos', {
      latitude: lat,
      longitude: lng
    });
  }
}
