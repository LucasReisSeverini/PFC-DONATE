import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ControleAgendamentoService } from '../../services/agendamento/controle-agendamento.service';
import { AgendamentoDto } from '../../domain/dto/controle-agendamento.dto';

@Component({
  selector: 'app-controle-agendamento',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './controle-agendamento.component.html',
  styleUrls: ['./controle-agendamento.component.css'],
  providers: [ControleAgendamentoService]
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
      next: (res: AgendamentoDto[]) => this.agendamentos = res,
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
