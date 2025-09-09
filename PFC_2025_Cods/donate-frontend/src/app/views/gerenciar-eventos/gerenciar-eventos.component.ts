import { Component, OnInit } from '@angular/core';
import { EventosService, Evento } from '../../services/eventos/eventos.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gerenciar-eventos',
  templateUrl: './gerenciar-eventos.component.html',
  styleUrls: ['./gerenciar-eventos.component.css'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule]
})
export class GerenciarEventosComponent implements OnInit {
  eventos: Evento[] = [];
  roleUsuario: string = 'PROFISSIONAL';

  constructor(private eventosService: EventosService, private router: Router) {}

  ngOnInit(): void {
    this.carregarEventos();
  }

  carregarEventos() {
    this.eventosService.listarEventos().subscribe({
      next: (res) => (this.eventos = res),
      error: (err) => console.error('Erro ao carregar eventos:', err)
    });
  }

  adicionarEvento() {
    this.router.navigate(['/adicionar-evento']);
  }

  editarEvento(evento: Evento) {
    this.router.navigate(['editar-evento', evento.id]);
  }

  excluirEvento(evento: Evento) {
    if (evento.id && confirm('Deseja realmente excluir este evento?')) {
      this.eventosService.excluirEvento(evento.id).subscribe({
        next: () => this.carregarEventos(),
        error: (err) => console.error('Erro ao excluir evento:', err)
      });
    }
  }

  // Novo método para voltar à rota painel
  voltarParaPainel() {
    this.router.navigate(['/painel']);
  }
}
