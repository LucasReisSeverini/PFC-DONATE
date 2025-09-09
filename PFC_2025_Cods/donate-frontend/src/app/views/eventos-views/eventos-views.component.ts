import { Component, OnInit } from '@angular/core';
import { EventosService, Evento } from '../../services/eventos/eventos.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EventoDetalheComponent } from '../evento-detalhe/evento-detalhe.component';



@Component({
  selector: 'app-eventos-views',
  templateUrl: './eventos-views.component.html',
  styleUrls: ['./eventos-views.component.css'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatDialogModule]
})
export class EventosViewsComponent implements OnInit {
  eventos: Evento[] = [];
  roleUsuario: string = 'PROFISSIONAL'; // ou 'USUARIO'

  constructor(
    private eventosService: EventosService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.carregarEventos();
  }

  carregarEventos() {
    this.eventosService.listarEventos().subscribe({
      next: (res) => {
        this.eventos = res;
      },
      error: (err) => {
        console.error('Erro ao carregar eventos:', err);
      }
    });
  }

  adicionarEvento() {
    this.router.navigate(['/adicionar-evento']);
  }

  abrirDetalhe(evento: Evento) {
    this.dialog.open(EventoDetalheComponent, {
      width: '90vw',
      height: '90vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'full-screen-dialog', // <- mudou aqui
      data: evento
    });
  }
  voltarPainel() {
    this.router.navigate(['/painel']);
  }




}
