import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
    { id: 1, nome: 'Banco de Leite de Belo Horizonte', cidade: 'Belo Horizonte' },
    { id: 2, nome: 'Banco de Leite de Uberlândia', cidade: 'Uberlândia' },
    { id: 3, nome: 'Banco de Leite de Juiz de Fora', cidade: 'Juiz de Fora' }
  ];

  private fb = inject(FormBuilder);

  constructor() {
    this.agendamentoForm = this.fb.group({
      tipo: ['entrega', Validators.required],
      bancoDeLeite: [''],
      data: ['', Validators.required],
      horario: ['', Validators.required],
      observacoes: ['']
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.agendamentoForm.valid) {
      console.log('Agendamento realizado:', this.agendamentoForm.value);
      alert('Agendamento realizado com sucesso!');
    }
  }
}
