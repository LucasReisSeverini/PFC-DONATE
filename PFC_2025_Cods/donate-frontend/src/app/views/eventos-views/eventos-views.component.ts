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
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.carregarCidades();
  }

  // Primeiro carregamos as cidades
  carregarCidades() {
    this.cidadeService.getCidades().subscribe({
      next: (res) => {
        this.cidades = res;
        this.carregarEventos();
      },
      error: (err) => console.error('Erro ao carregar cidades:', err)
    });
  }

  // Depois carregamos os eventos e associamos a cidade pelo id
  carregarEventos() {
    this.eventosService.listarEventos().subscribe({
      next: (res) => {
        this.eventos = res.map(e => ({
          ...e,
          cidadeNome: this.cidades.find(c => c.id === e.idCidade)?.nome
        }));
      },
      error: (err) => console.error('Erro ao carregar eventos:', err)
    });
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
