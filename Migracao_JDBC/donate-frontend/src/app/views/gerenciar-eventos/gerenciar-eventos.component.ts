import { Component, OnInit } from '@angular/core';
import { EventosService, Evento } from '../../services/eventos/eventos.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MunicipioService, Municipio } from '../../services/municipio/municipio.service';

@Component({
  selector: 'app-gerenciar-eventos',
  templateUrl: './gerenciar-eventos.component.html',
  styleUrls: ['./gerenciar-eventos.component.css'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule]
})
export class GerenciarEventosComponent implements OnInit {
  eventos: Evento[] = [];
  municipios: Municipio[] = [];
  roleUsuario: string = 'PROFISSIONAL';

  constructor(
    private eventosService: EventosService,
    private municipioService: MunicipioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarEventos();
    this.carregarMunicipios();
  }

  carregarEventos() {
    this.eventosService.listarEventos().subscribe({
      next: (res: Evento[]) => (this.eventos = res),
      error: (err: any) => console.error('Erro ao carregar eventos:', err)
    });
  }

  carregarMunicipios() {
    this.municipioService.getMunicipios().subscribe({
      next: (res: Municipio[]) => (this.municipios = res),
      error: (err: any) => console.error('Erro ao carregar municípios:', err)
    });
  }

  getMunicipioNome(id_municipio: number | null | undefined): string {
    if (!id_municipio) return 'Município não informado';
    const municipio = this.municipios.find(m => m.id === id_municipio);
    return municipio ? municipio.nome : 'Município não encontrado';
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
        error: (err: any) => console.error('Erro ao excluir evento:', err)
      });
    }
  }

  voltarParaPainel() {
    this.router.navigate(['/painel']);
  }
}
