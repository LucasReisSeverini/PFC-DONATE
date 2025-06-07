import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BancoService } from '../../services/banco/banco.service';
import { HttpClientModule } from '@angular/common/http';
import { MapComponent } from '../map/map.component';
import { RouterModule } from '@angular/router';
import { BancoProximoDto } from '../../domain/dto/banco-proximo.dto';

@Component({
  selector: 'app-banco-proximo',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MapComponent, RouterModule],
  templateUrl: './banco-proximo.component.html',
  styleUrls: ['./banco-proximo.component.css']
  // removi providers: [BancoService]
})
export class BancoProximoComponent implements OnInit {
  banco: BancoProximoDto | null = null;
  erro: string | null = null;

  constructor(private bancoService: BancoService) {}

  ngOnInit(): void {
    this.pegarLocalizacao();
  }

  pegarLocalizacao() {
    this.erro = null;
    this.banco = null;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Latitude:', latitude, 'Longitude:', longitude);

          this.bancoService.buscarBancoMaisProximo(latitude, longitude).subscribe({
            next: (data: BancoProximoDto | null) => {
              if (data) {
                this.banco = {
                  ...data,
                  coordenadas: {
                    lat: +data.latitude,
                    lng: +data.longitude
                  }
                };
              } else {
                this.erro = 'Nenhum banco de leite encontrado.';
              }
            },
            error: (err) => {
              this.erro = err.error?.error || 'Erro ao buscar banco mais próximo';
              console.error('Erro na requisição do banco:', err);
            }
          });
        },
        (error) => {
          this.erro = 'Erro ao obter a localização.';
          console.error('Erro ao obter localização:', error);
        }
      );
    } else {
      this.erro = 'Geolocalização não suportada pelo navegador.';
    }
  }
}
