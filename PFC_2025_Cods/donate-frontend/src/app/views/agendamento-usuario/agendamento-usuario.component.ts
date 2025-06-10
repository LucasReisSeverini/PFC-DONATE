import { Component, OnInit } from '@angular/core';
import { AgendamentoService } from '../../services/agendamento/agendamento.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agendamento-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agendamento-usuario.component.html',
  styleUrls: ['./agendamento-usuario.component.css']
})
export class AgendamentoUsuarioComponent implements OnInit {

  agendamentos: any[] = [];
  novaDataReagendamento: { [id: number]: string } = {};

  constructor(
    private agendamentoService: AgendamentoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarAgendamentos();
  }

  carregarAgendamentos(): void {
    this.agendamentoService.listarDoUsuario().subscribe({
      next: (res: any[]) => {
        this.agendamentos = res.map(a => ({
          id: a.id,
          data_doacao: a.dataDoacao ? new Date(a.dataDoacao) : null,
          nome_banco_leite: a.bancoDeLeite?.nome || 'Não informado',
          status: a.status
        }));
      },
      error: (err: any) => console.error('Erro ao carregar agendamentos:', err)
    });
  }

  cancelarAgendamento(id: number): void {
    if (confirm('Deseja realmente cancelar este agendamento?')) {
      this.agendamentoService.cancelar(id).subscribe({
        next: () => this.carregarAgendamentos(),
        error: (err: any) => console.error('Erro ao cancelar:', err)
      });
    }
  }

  reagendarComInput(id: number): void {
    const novaData = this.novaDataReagendamento[id];
    if (!novaData) {
      alert('Por favor, selecione uma nova data para reagendar.');
      return;
    }
    this.agendamentoService.reagendar(id, novaData).subscribe({
      next: () => {
        this.carregarAgendamentos();
        this.novaDataReagendamento[id] = '';
      },
      error: (err: any) => console.error('Erro ao reagendar:', err)
    });
  }

  voltar(): void {
    this.router.navigate(['/painel']);
  }
}
