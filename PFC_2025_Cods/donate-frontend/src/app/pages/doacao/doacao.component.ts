import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router'; // <--- importa aqui

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
  private http = inject(HttpClient);
  private router = inject(Router); // <--- injeta aqui

  doacaoForm!: FormGroup;
  bancosDeLeite: any[] = [];

  ngOnInit() {
    this.doacaoForm = this.fb.group({
      id_bancos_de_leite: [null, Validators.required],
      quantidade_ml: [null, [Validators.required, Validators.min(1)]],
      data_doacao: [null, Validators.required],
      hora_doacao: ['', Validators.required],  // novo campo hora
    });

    this.carregarBancosDeLeite();
  }

  carregarBancosDeLeite(): void {
    this.http.get<any[]>('http://localhost:3000/bancos-de-leite').subscribe({
      next: (data) => {
        console.log('Bancos de leite carregados:', data);
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

    const dados = {
      id_bancos_de_leite: this.doacaoForm.value.id_bancos_de_leite,
      quantidade_ml: this.doacaoForm.value.quantidade_ml,
      data_doacao: this.formatarData(this.doacaoForm.value.data_doacao),
    };

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post('http://localhost:3000/doacao/doacoes', dados, { headers }).subscribe({
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
