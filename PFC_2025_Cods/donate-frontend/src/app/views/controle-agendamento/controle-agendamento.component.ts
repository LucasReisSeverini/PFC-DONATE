import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ControleAgendamentoService } from '../../services/agendamento/controle-agendamento.service';
import { AgendamentoDto } from '../../domain/dto/controle-agendamento.dto';

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
  filtroReceptora: string = '';
  filtroStatus: string = '';

  // ordenação por data
  ordenarData: 'recentes' | 'antigas' = 'recentes';

  constructor(private controleAgendamentoService: ControleAgendamentoService) {}

  ngOnInit(): void {
    this.carregarAgendamentos();
  }

  carregarAgendamentos() {
    this.controleAgendamentoService.listarAgendamentos().subscribe({
      next: (res: any[]) => {
        this.agendamentos = res.map(a => ({
          id: a.id,
          tipo: 'entrega',
          bancoDeLeite: a.bancoDeLeite?.id || null,
          data_agendamento: a.dataDoacao || '',
          horario: '',
          status: a.status || '',
          quantidade_ml: a.quantidadeMl,
          nome_doadora: a.usuario?.doadora ? a.usuario.nome : '',
          nome_receptora: a.usuario?.receptora ? a.usuario.nome : '',
          observacoes: ''
        })) as AgendamentoDto[];
      },
      error: (err: any) => console.error('Erro ao carregar agendamentos', err)
    });
  }

  agendamentosFiltrados(): AgendamentoDto[] {
    // Aplicar filtros
    let filtrados = this.agendamentos.filter(a =>
      (!this.filtroDoadora || a.nome_doadora.toLowerCase().includes(this.filtroDoadora.toLowerCase())) &&
      (!this.filtroReceptora || a.nome_receptora.toLowerCase().includes(this.filtroReceptora.toLowerCase())) &&
      (!this.filtroStatus || a.status.toLowerCase() === this.filtroStatus.toLowerCase())
    );

    // Ordenar por data, protegendo contra datas inválidas
    filtrados.sort((a, b) => {
      const dataA = new Date(a.data_agendamento).getTime() || 0;
      const dataB = new Date(b.data_agendamento).getTime() || 0;
      return this.ordenarData === 'recentes' ? dataB - dataA : dataA - dataB;
    });

    return filtrados;
  }

  aceitar(id: number) {
    this.controleAgendamentoService.aceitarAgendamento(id)
      .subscribe(() => this.carregarAgendamentos());
  }

  recusar(id: number) {
    this.controleAgendamentoService.recusarAgendamento(id)
      .subscribe(() => this.carregarAgendamentos());
  }

  reagendar(id: number) {
    const novaData = this.novaDataReagendamento[id];
    if (!novaData) return;

    this.controleAgendamentoService.reagendarAgendamento(id, novaData)
      .subscribe(() => {
        this.carregarAgendamentos();
        this.novaDataReagendamento[id] = '';
      });
  }
}
