import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ControleAgendamentoService } from '../../services/agendamento/controle-agendamento.service';
import { BancoService } from '../../services/banco/banco.service';

export interface AgendamentoDto {
  id: number;
  tipo: string;
  bancoDeLeite: string;
  data_agendamento: string;
  horario: string;
  status: string;
  quantidade_ml: number;
  nome_doadora: string;
  observacoes: string;

  // Campos de endereço vindo da tabela doacao
  rua?: string;
  numero?: string;
  bairro?: string;
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
  agendamentosOriginais: AgendamentoDto[] = [];
  novaDataReagendamento: { [id: number]: string } = {};

  filtroDoadora: string = '';
  filtroBanco: string = '';
  filtroStatus: string = '';
  ordenarData: 'recentes' | 'antigas' = 'recentes';

  constructor(
    private controleAgendamentoService: ControleAgendamentoService,
    private bancoService: BancoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarAgendamentos();
  }

  voltarHome() {
    this.router.navigate(['/painel']);
  }

  carregarAgendamentos() {
    this.controleAgendamentoService.listarAgendamentos().subscribe({
      next: (res: any[]) => {
        this.agendamentos = res.map(a => ({
          id: a.id,
          tipo: 'entrega',
          bancoDeLeite: a.bancoDeLeite?.nome || '-',
          data_agendamento: a.dataDoacao || '',
          horario: '',
          status: a.status || 'Pendente',
          quantidade_ml: a.quantidadeMl || 0,
          nome_doadora: a.usuario?.doadora ? a.usuario.nome : '-',
          observacoes: a.observacoes || '',
          // ENDEREÇO VINDO DO AGENDAMENTO (tabela doacao)
          rua: a.rua || '-',
          numero: a.numero || '-',
          bairro: a.bairro || '-'
        })) as AgendamentoDto[];
        this.agendamentosOriginais = [...this.agendamentos];
      },
      error: (err: any) => console.error('Erro ao carregar agendamentos', err)
    });
  }

  agendamentosFiltrados(): AgendamentoDto[] {
    return this.agendamentos
      .filter(a => {
        const bancoNome = (a.bancoDeLeite || '').toLowerCase();
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

  agendamentosProximos(): void {
    if (!navigator.geolocation) {
      alert('Geolocalização não suportada pelo navegador.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        this.bancoService.buscarBancoMaisProximo(latitude, longitude).subscribe({
          next: (banco: any) => {
            if (banco) {
              this.agendamentos = this.agendamentosOriginais.filter(a =>
                a.bancoDeLeite === banco.nome
              );
              if (this.agendamentos.length === 0) {
                alert('Nenhum agendamento encontrado para o banco mais próximo.');
              } else {
                alert(`Filtrando agendamentos para o banco mais próximo: ${banco.nome}`);
              }
            } else {
              alert('Nenhum banco encontrado próximo a você.');
            }
          },
          error: (err) => { console.error(err); alert('Erro ao buscar banco mais próximo.'); }
        });
      },
      (err) => { console.error(err); alert('Não foi possível obter sua localização.'); }
    );
  }

  mostrarTodosAgendamentos() {
    this.agendamentos = [...this.agendamentosOriginais];
  }
}
