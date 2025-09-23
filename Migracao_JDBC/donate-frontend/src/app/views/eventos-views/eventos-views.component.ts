import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms'; // <--- IMPORTADO FormsModule

import { EventosService, Evento } from '../../services/eventos/eventos.service';
import { MunicipioService, Municipio } from '../../services/municipio/municipio.service';
import { EventoDetalheComponent } from '../evento-detalhe/evento-detalhe.component';
import { BancoService } from '../../services/banco/banco.service';

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
  imports: [CommonModule, MatCardModule, MatButtonModule, MatDialogModule, FormsModule] // FormsModule adicionado
})
export class EventosViewsComponent implements OnInit {
  eventos: (Evento & { municipioNome?: string })[] = [];
  eventosFiltrados: (Evento & { municipioNome?: string })[] = [];
  municipios: Municipio[] = [];

  // Filtros
  filtroMunicipio: number | null = null;
  filtroTipo: string = 'Todos';

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
        this.aplicarFiltros();
      },
      error: (err: any) => console.error('Erro ao carregar eventos:', err)
    });
  }

  aplicarFiltros() {
    this.eventosFiltrados = this.eventos.filter(e => {
      // Filtra por município
      const municipioOk = this.filtroMunicipio ? e.id_municipio === this.filtroMunicipio : true;

      // Filtra por tipo ignorando case e tratando "Todos"
      const tipoOk =
        this.filtroTipo.toLowerCase() === 'todos'
          ? true
          : e.tipo?.toLowerCase() === this.filtroTipo.toLowerCase();

      return municipioOk && tipoOk;
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

        this.bancoService.buscarBancoMaisProximo(latitude, longitude).subscribe({
          next: (banco: Banco | null) => {
            if (banco) {
              this.filtroMunicipio = banco.id_municipio;
              this.aplicarFiltros();
              if (this.eventosFiltrados.length === 0) {
                alert('Nenhum evento encontrado próximo à sua localização.');
              }
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
