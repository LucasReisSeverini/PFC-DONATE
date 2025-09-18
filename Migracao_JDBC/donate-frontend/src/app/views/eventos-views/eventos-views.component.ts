import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

import { EventosService, Evento } from '../../services/eventos/eventos.service';
import { MunicipioService, Municipio } from '../../services/municipio/municipio.service';
import { EventoDetalheComponent } from '../evento-detalhe/evento-detalhe.component';
import { BancoService } from '../../services/banco/banco.service';

// Interface ajustada conforme o backend
interface Banco {
  id: number;
  nome: string;
  id_municipio: number;
  latitude?: number;
  longitude?: number;
  endereco?: string;
  municipio?: string;
  estado?: string;
  telefone?: string;
  distancia?: number;
}

@Component({
  selector: 'app-eventos-views',
  templateUrl: './eventos-views.component.html',
  styleUrls: ['./eventos-views.component.css'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatDialogModule]
})
export class EventosViewsComponent implements OnInit {
  eventos: (Evento & { municipioNome?: string })[] = [];
  municipios: Municipio[] = [];

  constructor(
    private eventosService: EventosService,
    private municipioService: MunicipioService,
    private bancoService: BancoService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.carregarMunicipios();
  }

  carregarMunicipios() {
    this.municipioService.getMunicipios().subscribe({
      next: (res: Municipio[]) => {
        this.municipios = res;
        console.log('Municípios carregados:', this.municipios);
        this.carregarEventos();
      },
      error: (err: any) => console.error('Erro ao carregar municípios:', err)
    });
  }

  carregarEventos() {
    this.eventosService.listarEventos().subscribe({
      next: (res: Evento[]) => {
        this.eventos = res.map(e => ({
          ...e,
          municipioNome: this.municipios.find(m => m.id === e.id_municipio)?.nome
        }));
        console.log('Eventos carregados:', this.eventos);
      },
      error: (err: any) => console.error('Erro ao carregar eventos:', err)
    });
  }

  eventosProximos(): void {
    if (!navigator.geolocation) {
      alert('Geolocalização não suportada pelo navegador.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        console.log('Localização atual:', { latitude, longitude });

        this.bancoService.buscarBancoMaisProximo(latitude, longitude).subscribe({
          next: (banco: Banco | null) => {
            console.log('Banco mais próximo encontrado:', banco);
            if (banco) {
              const municipioId = banco.id_municipio;
              console.log('ID do município do banco:', municipioId);

              this.eventosService.listarEventos().subscribe({
                next: (res: Evento[]) => {
                  this.eventos = res
                    .filter(e => e.id_municipio === municipioId)
                    .map(e => ({
                      ...e,
                      municipioNome: this.municipios.find(m => m.id === e.id_municipio)?.nome
                    }));

                  console.log('Eventos filtrados pelo município:', this.eventos);

                  if (this.eventos.length === 0) {
                    alert('Nenhum evento encontrado próximo à sua localização.');
                  }
                },
                error: (err: any) => console.error('Erro ao carregar eventos:', err)
              });
            } else {
              alert('Nenhum banco de leite encontrado próximo a você.');
            }
          },
          error: (err: any) => {
            console.error('Erro ao buscar banco mais próximo:', err);
            alert('Erro ao buscar banco mais próximo.');
          }
        });
      },
      (err) => {
        console.error('Erro ao obter localização:', err);
        alert('Não foi possível obter sua localização.');
      }
    );
  }

  abrirDetalhe(evento: Evento) {
    this.dialog.open(EventoDetalheComponent, {
      width: '90vw',
      height: '90vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'full-screen-dialog',
      data: evento
    });
  }

  voltarPainel() {
    this.router.navigate(['/painel']);
  }
}
