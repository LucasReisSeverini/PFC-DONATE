import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';

interface BancoDeLeite {
  id: number;
  nome: string;
  cidade: string;
}

@Component({
  selector: 'app-agendamento',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule
  ],
  templateUrl: './agendamento.component.html',
  styleUrls: ['./agendamento.component.css']
})
export class AgendamentoComponent implements OnInit {
  agendamentoForm: FormGroup;

  bancosDeLeite: BancoDeLeite[] = [
    { id: 1, nome: 'Banco de Leite Humano do Hospital Sofia Feldman', cidade: 'Belo Horizonte' },
    { id: 2, nome: 'Banco de Leite de Uberlândia', cidade: 'Uberlândia' },
    { id: 3, nome: 'Banco de Leite de Juiz de Fora', cidade: 'Juiz de Fora' }
  ];

  // Calendário manual em pt-BR
  mostrarCalendario: boolean = false;
  dataSelecionada: string = '';
  mesAtual: number = new Date().getMonth();
  anoAtual: number = new Date().getFullYear();
  diasDoMes: number[] = [];
  diasDaSemana: string[] = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  meses: string[] = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  private fb = inject(FormBuilder);

  constructor() {
    this.agendamentoForm = this.fb.group({
      tipo: ['entrega', Validators.required],
      bancoDeLeite: ['', Validators.required],
      endereco: [''],
      cidade: [''],
      estado: [''],
      data: ['', Validators.required],
      horario: ['', Validators.required],
      observacoes: [''],
      quantidade: ['', [Validators.required, Validators.min(50)]]
    });

    this.gerarCalendario();
  }

  ngOnInit(): void {}

  gerarCalendario(): void {
    const ultimoDia = new Date(this.anoAtual, this.mesAtual + 1, 0);
    this.diasDoMes = [];
    for (let i = 1; i <= ultimoDia.getDate(); i++) {
      this.diasDoMes.push(i);
    }
  }

  selecionarData(dia: number): void {
    const diaFormatado = dia.toString().padStart(2, '0');
    const mesFormatado = (this.mesAtual + 1).toString().padStart(2, '0');
    this.dataSelecionada = `${diaFormatado}/${mesFormatado}/${this.anoAtual}`;
    this.agendamentoForm.patchValue({ data: this.dataSelecionada });
    this.mostrarCalendario = false;
  }

  mesAnterior(): void {
    this.mesAtual--;
    if (this.mesAtual < 0) {
      this.mesAtual = 11;
      this.anoAtual--;
    }
    this.gerarCalendario();
  }

  mesSeguinte(): void {
    this.mesAtual++;
    if (this.mesAtual > 11) {
      this.mesAtual = 0;
      this.anoAtual++;
    }
    this.gerarCalendario();
  }

  toggleCalendario(): void {
    this.mostrarCalendario = !this.mostrarCalendario;
  }

  onSubmit(): void {
    if (this.agendamentoForm.valid) {
      const formValue = this.agendamentoForm.value;

      const agendamento = {
        ...formValue,
        bancoDeLeite: Number(formValue.bancoDeLeite) || null,
        data: this.dataSelecionada
      };

      console.log('Agendamento realizado:', agendamento);
      alert(`Agendamento realizado com sucesso!\nData: ${agendamento.data} às ${agendamento.horario}`);

      this.agendamentoForm.reset({ tipo: 'entrega' });
      this.dataSelecionada = '';
    }
  }
}
