import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { EventosService } from '../../services/eventos/eventos.service';
import { CidadeService } from '../../services/cidade/cidade.service';
import { CommonModule } from '@angular/common';

// Interface local para cidades com estado
interface CidadeComEstado {
  id: number;
  nome: string;
  estado: {
    id: number;
    nome: string;
    sigla: string;
  };
}

@Component({
  selector: 'app-adicionar-evento',
  templateUrl: './adicionar-evento.component.html',
  styleUrls: ['./adicionar-evento.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    CommonModule
  ]
})
export class AdicionarEventoComponent implements OnInit {
  eventoForm: FormGroup;
  cidades: CidadeComEstado[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private eventosService: EventosService,
    private cidadeService: CidadeService
  ) {
    this.eventoForm = this.fb.group({
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      data: ['', Validators.required],
      tipo: ['evento', Validators.required],
      idCidade: [null, Validators.required] // mantemos idCidade para envio
    });
  }

  ngOnInit(): void {
    this.carregarCidades();
  }

  carregarCidades() {
    this.cidadeService.getCidades().subscribe({
      next: (res: any[]) => {
        // mapeia para garantir que estado está definido e tem sigla
        this.cidades = res.map(c => ({
          id: c.id,
          nome: c.nome,
          estado: {
            id: c.estado?.id ?? 0,
            nome: c.estado?.nome ?? '',
            sigla: c.estado?.sigla ?? ''
          }
        }));
      },
      error: (err: any) => console.error('Erro ao carregar cidades', err)
    });
  }

  salvarEvento() {
    if (this.eventoForm.valid) {
      const formValue = this.eventoForm.value;

      // Prepara objeto para enviar ao backend
      const novoEvento = {
        titulo: formValue.titulo,
        descricao: formValue.descricao,
        data: formValue.data,
        tipo: formValue.tipo,
        idCidade: Number(formValue.idCidade) // envia apenas o id da cidade
      };

      console.log('Objeto enviado para o backend:', novoEvento);

      this.eventosService.adicionarEvento(novoEvento as any).subscribe({
        next: (res: any) => {
          console.log('Evento salvo no banco:', res);
          alert('Evento/Notícia adicionada com sucesso!');
          this.eventoForm.reset({ tipo: 'evento' });
        },
        error: (err: any) => {
          console.error('Erro ao salvar evento:', err);
          alert('Erro ao salvar evento. Tente novamente.');
        }
      });
    } else {
      alert('Preencha todos os campos corretamente.');
    }
  }

  voltar() {
    this.router.navigate(['/painel']);
  }
}
