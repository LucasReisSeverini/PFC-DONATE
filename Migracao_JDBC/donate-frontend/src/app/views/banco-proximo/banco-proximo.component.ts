import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BancoService } from '../../services/banco/banco.service';
import { HttpClientModule } from '@angular/common/http';
import { MapComponent } from '../map/map.component';
import { RouterModule } from '@angular/router';
import { BancoProximoDto } from '../../domain/dto/banco-proximo.dto';
import { HeadearComponent } from '../headear/headear.component';

@Component({
  selector: 'app-banco-proximo',
  standalone: true,
  imports: [CommonModule, HeadearComponent, HttpClientModule, MapComponent, RouterModule],
  templateUrl: './banco-proximo.component.html',
  styleUrls: ['./banco-proximo.component.css']
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

  /**
   * Formata número de telefone em padrões brasileiros
   * Ex: 3534211234 -> (35) 3421-1234
   * Ex: 35999991234 -> (35) 99999-1234
   */
  formatarTelefone(numero?: string): string {
    if (!numero) return 'Não informado';

    const digits = numero.replace(/\D/g, '');

    if (digits.length === 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }

    if (digits.length === 11) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    }

    return numero; // fallback
  }
}
