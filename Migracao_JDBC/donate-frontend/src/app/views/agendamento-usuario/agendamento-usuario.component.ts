import { Component, OnInit } from '@angular/core';
import { AgendamentoService } from '../../services/agendamento/agendamento.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeadearComponent } from '../headear/headear.component';

@Component({
  selector: 'app-agendamento-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, HeadearComponent],
  templateUrl: './agendamento-usuario.component.html',
  styleUrls: ['./agendamento-usuario.component.css']
})
export class AgendamentoUsuarioComponent implements OnInit {

  agendamentos: any[] = [];
  novaDataReagendamento: { [id: number]: string } = {};

  // filtros
  filtroBanco: string = '';
  filtroStatus: string = '';

  // ordenação
  ordenarData: 'recentes' | 'antigas' = 'recentes';

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
          nome_banco_leite: a.nomeBanco || 'Não informado',
          status: a.status || 'Pendente',
          quantidade_ml: a.quantidadeMl || 0,
          nome_doadora: a.nomeUsuario || 'Não informado',
          rua: a.rua || 'Não informado',
          numero: a.numero || 'Não informado',
          bairro: a.bairro || 'Não informado',
        }));
      },
      error: (err: any) => console.error('Erro ao carregar agendamentos:', err)
    });
  }

  agendamentosFiltrados(): any[] {
    return this.agendamentos
      .filter(a => {
        const banco = (a.nome_banco_leite || '').toLowerCase();
        const statusFiltro = (this.filtroStatus || '').toLowerCase();
        const statusAgendamento = (a.status || '').toLowerCase();
        return (!this.filtroBanco || banco.includes(this.filtroBanco.toLowerCase())) &&
               (!statusFiltro || statusAgendamento === statusFiltro);
      })
      .sort((a, b) => {
        const dataA = a.data_doacao ? a.data_doacao.getTime() : 0;
        const dataB = b.data_doacao ? b.data_doacao.getTime() : 0;
        return this.ordenarData === 'recentes' ? dataB - dataA : dataA - dataB;
      });
  }

  formatarData(data: Date | null): string {
    if (!data) return '';
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
  }

  cancelarAgendamento(id: number): void {
    if (confirm('Deseja realmente excluir este agendamento?')) {
      this.agendamentoService.cancelar(id).subscribe({
        next: () => this.carregarAgendamentos(),
        error: (err: any) => console.error('Erro ao excluir:', err)
      });
    }
  }

  recusarReagendamento(id: number): void {
    if (confirm('Deseja recusar este reagendamento?')) {
      this.agendamentoService.recusarAgendamento(id).subscribe({
        next: () => {
          const agendamento = this.agendamentos.find(a => a.id === id);
          if (agendamento) {
            agendamento.status = 'Recusado';
          }
        },
        error: (err: any) => console.error('Erro ao recusar:', err)
      });
    }
  }

  aceitarReagendamento(id: number): void {
    if (confirm('Deseja aceitar este reagendamento solicitado pelo profissional?')) {
      this.agendamentoService.aceitarAgendamento(id).subscribe({
        next: () => {
          const agendamento = this.agendamentos.find(a => a.id === id);
          if (agendamento) {
            agendamento.status = 'Aceito';
          }
        },
        error: (err: any) => console.error('Erro ao aceitar:', err)
      });
    }
  }

  solicitarReagendamento(id: number): void {
    const novaData = this.novaDataReagendamento[id];
    if (!novaData) {
      alert('Por favor, selecione uma nova data para reagendar.');
      return;
    }

    this.agendamentoService.reagendar(id, novaData).subscribe({
      next: (res: any) => {
        if (res) {
          const index = this.agendamentos.findIndex(a => a.id === id);
          if (index !== -1) {
            this.agendamentos[index] = {
              ...this.agendamentos[index],
              data_doacao: res.dataDoacao ? new Date(res.dataDoacao) : this.agendamentos[index].data_doacao,
              status: res.status || this.agendamentos[index].status
            };
          }
        }
        this.novaDataReagendamento[id] = '';
      },
      error: (err: any) => console.error('Erro ao solicitar reagendamento:', err)
    });
  }

  // Retorna a cor baseada no status do agendamento
  corStatus(status: string): string {
    if (!status) return 'gray';
    status = status.toLowerCase();
    if (status.includes('profissional')) return 'blue';
    if (status.includes('doadora')) return 'lightblue';
    if (status.includes('aceito')) return 'green';
    if (status.includes('recusado')) return 'red';
    if (status.includes('pendente')) return 'orange';
    return 'gray';
  }

  // Lógica de exibição de botões
  mostrarAceitar(status: string): boolean {
    return status.toLowerCase().includes('profissional');
  }

  mostrarReagendar(status: string): boolean {
    return status.toLowerCase().includes('doadora') || status.toLowerCase().includes('pendente') || status.toLowerCase().includes('profissional');
  }

  mostrarRecusar(status: string): boolean {
    return status.toLowerCase().includes('profissional');
  }

  voltar(): void {
    this.router.navigate(['/painel']);
  }
}
