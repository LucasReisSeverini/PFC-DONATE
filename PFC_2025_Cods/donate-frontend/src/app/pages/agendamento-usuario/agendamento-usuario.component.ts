import { Component, OnInit } from '@angular/core';
import { AgendamentoService } from '../../services/agendamento.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // <-- Importar FormsModule
import { Router } from '@angular/router'; // Importa Router para navegar

@Component({
  selector: 'app-agendamento-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],  // <-- Adicionar FormsModule aqui
  templateUrl: './agendamento-usuario.component.html',
  styleUrls: ['./agendamento-usuario.component.css']
})
export class AgendamentoUsuarioComponent implements OnInit {

  agendamentos: any[] = [];
  novaDataReagendamento: { [id: number]: string } = {};  // Armazena datas do input

  constructor(
    private agendamentoService: AgendamentoService,
    private router: Router  // Injetar Router para navegar
  ) {}

  ngOnInit(): void {
    this.carregarAgendamentos();
  }

  carregarAgendamentos(): void {
    this.agendamentoService.listarDoUsuario().subscribe({
      next: (res: any[]) => {
        this.agendamentos = res.map(a => ({
          ...a,
          data_doacao: a.data_doacao ? new Date(a.data_doacao) : null
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
        this.novaDataReagendamento[id] = ''; // limpa o input
      },
      error: (err: any) => console.error('Erro ao reagendar:', err)
    });
  }

  voltar(): void {
    this.router.navigate(['/painel']);
  }
}
