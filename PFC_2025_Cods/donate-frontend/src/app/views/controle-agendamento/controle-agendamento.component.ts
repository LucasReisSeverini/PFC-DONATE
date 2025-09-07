import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ControleAgendamentoService } from '../../services/agendamento/controle-agendamento.service';
import { AgendamentoDto } from '../../domain/dto/controle-agendamento.dto';

@Component({
  selector: 'app-controle-agendamento',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './controle-agendamento.component.html',
  styleUrls: ['./controle-agendamento.component.css']
  // Removido providers para usar a instância global (interceptada)
})
export class ControleAgendamentoComponent implements OnInit {
  agendamentos: AgendamentoDto[] = [];
  novaDataReagendamento: { [id: number]: string } = {};

  constructor(private controleAgendamentoService: ControleAgendamentoService) {}

  ngOnInit(): void {
    this.carregarAgendamentos();
  }

  carregarAgendamentos() {
    this.controleAgendamentoService.listarAgendamentos().subscribe({
      next: (res: any[]) => {
        this.agendamentos = res.map(a => ({
          id: a.id,
          tipo: 'entrega', // ou 'retirada' se você tiver essa info
          bancoDeLeite: a.bancoDeLeite?.id || null,
          data_agendamento: a.dataDoacao || '', // mapeando do JSON
          horario: '', // se não tiver hora separada
          status: a.status,
          quantidade_ml: a.quantidadeMl,
          nome_doadora: a.usuario?.doadora ? a.usuario.nome : '',
          nome_receptora: a.usuario?.receptora ? a.usuario.nome : '',
          observacoes: ''
        })) as AgendamentoDto[];
      },
      error: (err: any) => console.error('Erro ao carregar agendamentos', err)
    });
  }




  aceitar(id: number) {
    this.controleAgendamentoService.aceitarAgendamento(id).subscribe(() => this.carregarAgendamentos());
  }

  recusar(id: number) {
    this.controleAgendamentoService.recusarAgendamento(id).subscribe(() => this.carregarAgendamentos());
  }

  reagendar(id: number) {
    const novaData = this.novaDataReagendamento[id];
    if (!novaData) return;

    this.controleAgendamentoService.reagendarAgendamento(id, novaData).subscribe(() => {
      this.carregarAgendamentos();
      this.novaDataReagendamento[id] = '';
    });
  }
}
