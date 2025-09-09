import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

import { EventosService, Evento } from '../../services/eventos/eventos.service';
import { CidadeService, Cidade } from '../../services/cidade/cidade.service';
import { EventoDetalheComponent } from '../evento-detalhe/evento-detalhe.component';
import { BancoService } from '../../services/banco/banco.service';

// Interface ajustada conforme o backend
interface Banco {
  id: number;
  nome: string;
  id_cidade: number;
  latitude?: number;
  longitude?: number;
  endereco?: string;
  cidade?: string;
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
  eventos: (Evento & { cidadeNome?: string })[] = [];
  cidades: Cidade[] = [];

  constructor(
    private eventosService: EventosService,
    private cidadeService: CidadeService,
    private bancoService: BancoService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.carregarCidades();
  }

  carregarCidades() {
    this.cidadeService.getCidades().subscribe({
      next: (res) => {
        this.cidades = res;
        console.log('Cidades carregadas:', this.cidades);
        this.carregarEventos();
      },
      error: (err) => console.error('Erro ao carregar cidades:', err)
    });
  }

  carregarEventos() {
    this.eventosService.listarEventos().subscribe({
      next: (res) => {
        this.eventos = res.map(e => ({
          ...e,
          cidadeNome: this.cidades.find(c => c.id === e.idCidade)?.nome
        }));
        console.log('Eventos carregados:', this.eventos);
      },
      error: (err) => console.error('Erro ao carregar eventos:', err)
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
              const cidadeId = banco.id_cidade; // corrigido para id_cidade
              console.log('ID da cidade do banco:', cidadeId);

              this.eventosService.listarEventos().subscribe({
                next: (res) => {
                  this.eventos = res
                    .filter(e => e.idCidade === cidadeId)
                    .map(e => ({
                      ...e,
                      cidadeNome: this.cidades.find(c => c.id === e.idCidade)?.nome
                    }));

                  console.log('Eventos filtrados pela cidade:', this.eventos);

                  if (this.eventos.length === 0) {
                    alert('Nenhum evento encontrado próximo à sua localização.');
                  }
                },
                error: (err) => console.error('Erro ao carregar eventos:', err)
              });
            } else {
              alert('Nenhum banco de leite encontrado próximo a você.');
            }
          },
          error: (err) => {
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
