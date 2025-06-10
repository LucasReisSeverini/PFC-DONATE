import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Router } from '@angular/router';
import { DoacaoService } from '../../services/agendamento/doacao.service';

// Importando o DTO
import { DoacaoDto } from '../../domain/dto/doacao.dto';

@Component({
  selector: 'app-doacao',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './doacao.component.html',
  styleUrls: ['./doacao.component.css'],
})
export class DoacaoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private doacaoService = inject(DoacaoService);

  doacaoForm!: FormGroup;
  bancosDeLeite: any[] = [];

  ngOnInit() {
    this.doacaoForm = this.fb.group({
      id_bancos_de_leite: [null, Validators.required],
      quantidade_ml: [null, [Validators.required, Validators.min(1)]],
      data_doacao: [null, Validators.required],
      hora_doacao: ['', Validators.required],
    });

    this.carregarBancosDeLeite();
  }

  carregarBancosDeLeite(): void {
    this.doacaoService.getBancosDeLeite().subscribe({
      next: (data) => {
        this.bancosDeLeite = data;
      },
      error: (err) => {
        console.error('Erro ao buscar bancos de leite:', err);
        alert('Erro ao carregar bancos de leite.');
      },
    });
  }

  agendarDoacao() {
    if (this.doacaoForm.invalid) {
      alert('Preencha todos os campos corretamente.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Você precisa estar logado para agendar uma doação.');
      return;
    }

    const userId = localStorage.getItem('id');
    if (!userId) {
      alert('Usuário não autenticado.');
      return;
    }

    const formValue = this.doacaoForm.value;

    const dados: DoacaoDto = {
      id_bancos_de_leite: formValue.id_bancos_de_leite,
      quantidade_ml: formValue.quantidade_ml,
      data_doacao: this.formatarData(formValue.data_doacao),
      hora_doacao: formValue.hora_doacao,
      id_usuario: Number(userId), // adiciona o id do usuário aqui
    };

    this.doacaoService.agendarDoacao(dados).subscribe({
      next: () => {
        alert('Doação agendada com sucesso!');
        this.doacaoForm.reset();
      },
      error: (err) => {
        console.error('Erro ao agendar doação:', err);
        alert('Erro ao agendar doação.');
      },
    });
  }

  private formatarData(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  voltarParaPainel(): void {
    this.router.navigate(['/painel']);
  }
}
