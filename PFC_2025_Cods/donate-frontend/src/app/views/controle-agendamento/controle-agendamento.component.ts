import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { ControleAgendamentoService } from '../../services/agendamento/controle-agendamento.service';

// Ajustamos o DTO direto aqui para incluir cidade
export interface AgendamentoDto {
  id: number;
  tipo: string;
  bancoDeLeite: string;
  cidade?: string; // <-- ADICIONADO
  data_agendamento: string;
  horario: string;
  status: string;
  quantidade_ml: number;
  nome_doadora: string;
  observacoes: string;
}

@Component({
  selector: 'app-controle-agendamento',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './controle-agendamento.component.html',
  styleUrls: ['./controle-agendamento.component.css']
})
export class ControleAgendamentoComponent implements OnInit {
  agendamentos: AgendamentoDto[] = [];
  novaDataReagendamento: { [id: number]: string } = {};

  // filtros
  filtroDoadora: string = '';
  filtroBanco: string = '';
  filtroStatus: string = '';

  // ordenação por data
  ordenarData: 'recentes' | 'antigas' = 'recentes';

  constructor(
    private controleAgendamentoService: ControleAgendamentoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarAgendamentos();
  }

  // Navegar de volta ao Painel
  voltarHome() {
    this.router.navigate(['/painel']); // Rota ajustada
  }

  carregarAgendamentos() {
    this.controleAgendamentoService.listarAgendamentos().subscribe({
      next: (res: any[]) => {
        this.agendamentos = res.map(a => ({
          id: a.id,
          tipo: 'entrega',
          bancoDeLeite: a.bancoDeLeite?.nome || '',
          cidade: a.bancoDeLeite?.cidade?.nome || '', // <-- PEGANDO A CIDADE
          data_agendamento: a.dataDoacao || '',
          horario: '',
          status: a.status || '',
          quantidade_ml: a.quantidadeMl,
          nome_doadora: a.usuario?.doadora ? a.usuario.nome : '',
          observacoes: ''
        })) as AgendamentoDto[];
      },
      error: (err: any) => console.error('Erro ao carregar agendamentos', err)
    });
  }

  agendamentosFiltrados(): AgendamentoDto[] {
    return this.agendamentos
      .filter(a => {
        const bancoNome = String(a.bancoDeLeite || '').toLowerCase();
        const nomeDoadora = (a.nome_doadora || '').toLowerCase();
        const status = (a.status || '').toLowerCase();

        return (!this.filtroDoadora || nomeDoadora.includes(this.filtroDoadora.toLowerCase())) &&
               (!this.filtroBanco || bancoNome.includes(this.filtroBanco.toLowerCase())) &&
               (!this.filtroStatus || status === this.filtroStatus.toLowerCase());
      })
      .sort((a, b) => {
        const dataA = new Date(a.data_agendamento).getTime() || 0;
        const dataB = new Date(b.data_agendamento).getTime() || 0;
        return this.ordenarData === 'recentes' ? dataB - dataA : dataA - dataB;
      });
  }

  formatarData(data: string): string {
    if (!data) return '';
    const d = new Date(data);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();
    const horas = String(d.getHours()).padStart(2, '0');
    const minutos = String(d.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
  }

  aceitar(id: number) {
    this.controleAgendamentoService.aceitarAgendamento(id).subscribe({
      next: () => {
        const ag = this.agendamentos.find(a => a.id === id);
        if (ag) ag.status = 'Aceito';
      },
      error: (err) => console.error('Erro ao aceitar agendamento', err)
    });
  }

  recusar(id: number) {
    this.controleAgendamentoService.recusarAgendamento(id).subscribe({
      next: () => {
        const ag = this.agendamentos.find(a => a.id === id);
        if (ag) ag.status = 'Recusado';
      },
      error: (err) => console.error('Erro ao recusar agendamento', err)
    });
  }

  reagendar(id: number) {
    const novaData = this.novaDataReagendamento[id];
    if (!novaData) {
      alert('Selecione uma nova data/hora antes de reagendar.');
      return;
    }

    this.controleAgendamentoService.reagendarAgendamento(id, novaData).subscribe({
      next: () => {
        const ag = this.agendamentos.find(a => a.id === id);
        if (ag) {
          ag.data_agendamento = novaData;
          ag.status = 'Reagendamento Solicitado';
        }
        this.novaDataReagendamento[id] = '';
      },
      error: (err) => console.error('Erro ao reagendar agendamento', err)
    });
  }
}
