import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { DoacaoService } from '../../services/agendamento/doacao.service';
import { BancoService } from '../../services/banco/banco.service';
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
    MatButtonModule
  ],
  templateUrl: './doacao.component.html',
  styleUrls: ['./doacao.component.css'],
})
export class DoacaoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private doacaoService = inject(DoacaoService);
  private bancoService = inject(BancoService);

  doacaoForm!: FormGroup;
  bancosDeLeite: any[] = [];

  mostrarCalendario = false;
  dataSelecionada = '';
  mesAtual = new Date().getMonth();
  anoAtual = new Date().getFullYear();
  diasDoMes: (number | null)[] = [];
  diasDaSemana = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

  ngOnInit() {
    this.doacaoForm = this.fb.group({
      id_bancos_de_leite: [null, Validators.required],
      quantidade_ml: [null, [Validators.required, Validators.min(1)]],
      data_doacao: [null, Validators.required],
      hora_doacao: ['', Validators.required],
      rua: ['', Validators.required],       // novo
      numero: ['', Validators.required],    // novo
      bairro: ['', Validators.required],    // novo
      status_doacao: ['']
    });

    this.carregarBancosDeLeite();
    this.gerarCalendario();
  }

  carregarBancosDeLeite(): void {
    this.doacaoService.getBancosDeLeite().subscribe({
      next: (data) => this.bancosDeLeite = data,
      error: (err) => { console.error(err); alert('Erro ao carregar bancos de leite.'); }
    });
  }

  usarBancoMaisProximo(): void {
    if (!navigator.geolocation) {
      alert('Geolocalização não suportada pelo navegador.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        this.bancoService.buscarBancoMaisProximo(latitude, longitude).subscribe({
          next: (banco) => {
            if (banco) {
              this.doacaoForm.patchValue({ id_bancos_de_leite: banco.id });
              alert(`Banco mais próximo selecionado: ${banco.nome}`);
            } else {
              alert('Nenhum banco encontrado próximo a você.');
            }
          },
          error: (err) => {
            console.error(err);
            alert('Erro ao buscar banco mais próximo.');
          }
        });
      },
      (err) => {
        console.error(err);
        alert('Não foi possível obter sua localização.');
      }
    );
  }

  gerarCalendario(): void {
    const ultimoDia = new Date(this.anoAtual, this.mesAtual + 1, 0).getDate();
    let primeiroDiaSemana = new Date(this.anoAtual, this.mesAtual, 1).getDay();
    this.diasDoMes = [];

    for (let i = 0; i < primeiroDiaSemana; i++) {
      this.diasDoMes.push(null);
    }

    for (let i = 1; i <= ultimoDia; i++) {
      this.diasDoMes.push(i);
    }
  }

  selecionarData(dia: number): void {
    if (!dia) return;
    this.dataSelecionada = this.formatarDataExibicao(dia, this.mesAtual, this.anoAtual);
    this.doacaoForm.patchValue({ data_doacao: this.dataSelecionada });
    this.mostrarCalendario = false;
  }

  formatarDataExibicao(dia: number, mes: number, ano: number): string {
    const d = String(dia).padStart(2,'0');
    const m = String(mes + 1).padStart(2,'0');
    return `${d}/${m}/${ano}`;
  }

  mesAnterior(): void {
    this.mesAtual--;
    if (this.mesAtual < 0) { this.mesAtual = 11; this.anoAtual--; }
    this.gerarCalendario();
  }

  mesSeguinte(): void {
    this.mesAtual++;
    if (this.mesAtual > 11) { this.mesAtual = 0; this.anoAtual++; }
    this.gerarCalendario();
  }

  toggleCalendario(): void { this.mostrarCalendario = !this.mostrarCalendario; }

  agendarDoacao() {
    if (this.doacaoForm.invalid) {
      this.doacaoForm.markAllAsTouched();
      alert('Preencha todos os campos obrigatórios corretamente.');
      return;
    }

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('id');
    if (!token || !userId) {
      alert('Usuário não autenticado ou token inválido.');
      return;
    }

    const f = this.doacaoForm.value;
    const dados: DoacaoDto = {
      id_bancos_de_leite: f.id_bancos_de_leite,
      quantidade_ml: f.quantidade_ml,
      data_doacao: this.formatarDataISO(f.data_doacao),
      hora_doacao: f.hora_doacao,
      id_usuario: Number(userId),
      rua: f.rua,       // novo
      numero: f.numero, // novo
      bairro: f.bairro  // novo
    };

    this.doacaoService.agendarDoacao(dados).subscribe({
      next: () => {
        alert('Doação agendada com sucesso!');
        this.doacaoForm.reset();
        this.dataSelecionada = '';
      },
      error: (err) => {
        console.error(err);

        if (err.status === 409) {
          const mensagem = err.error ? err.error : 'Já existe um agendamento para essa data e horário nesse banco de leite.';
          alert(mensagem);
        } else {
          alert('Erro ao agendar doação.');
        }
      }
    });
  }

  private formatarDataISO(data: string): string {
    const [dia, mes, ano] = data.split('/');
    return `${ano}-${mes}-${dia}`;
  }

  voltarParaPainel(): void { this.router.navigate(['/painel']); }
}
