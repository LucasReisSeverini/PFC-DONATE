import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { EventosService } from '../../services/eventos/eventos.service';
import { MunicipioService, Municipio } from '../../services/municipio/municipio.service';
import { CommonModule } from '@angular/common';

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
  municipios: Municipio[] = []; // alterado para Municipio

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private eventosService = inject(EventosService);
  private municipioService = inject(MunicipioService);

  constructor() {
    this.eventoForm = this.fb.group({
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      data: ['', Validators.required],
      tipo: ['evento', Validators.required],
      id_municipio: [null, Validators.required] // envia id_municipio para o backend
    });
  }

  ngOnInit(): void {
    this.carregarMunicipios();
  }

  carregarMunicipios() {
    this.municipioService.getMunicipios().subscribe({
      next: (res: Municipio[]) => {
        this.municipios = res;
      },
      error: (err: any) => console.error('Erro ao carregar municípios', err)
    });
  }

  salvarEvento() {
    if (this.eventoForm.valid) {
      const formValue = this.eventoForm.value;

      const novoEvento = {
        titulo: formValue.titulo,
        descricao: formValue.descricao,
        data: formValue.data,
        tipo: formValue.tipo,
        id_municipio: Number(formValue.id_municipio)
      };

      console.log('Objeto enviado para o backend:', novoEvento);

      this.eventosService.adicionarEvento(novoEvento as any).subscribe({
        next: res => {
          console.log('Evento salvo no banco:', res);
          alert('Evento/Notícia adicionada com sucesso!');
          this.eventoForm.reset({ tipo: 'evento' });
        },
        error: err => {
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
