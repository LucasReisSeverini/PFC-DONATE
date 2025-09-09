import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { EventosService, Evento } from '../../services/eventos/eventos.service';

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
    MatButtonModule
  ]
})
export class AdicionarEventoComponent {
  eventoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private eventosService: EventosService
  ) {
    this.eventoForm = this.fb.group({
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      data: ['', Validators.required],
      tipo: ['evento', Validators.required] // padrão 'evento'
    });
  }

  salvarEvento() {
    if (this.eventoForm.valid) {
      const novoEvento: Evento = this.eventoForm.value;

      this.eventosService.adicionarEvento(novoEvento).subscribe({
        next: (res) => {
          console.log('Evento salvo no banco:', res);
          alert('Evento/Notícia adicionada com sucesso!');
          this.eventoForm.reset({ tipo: 'evento' }); // reseta o formulário
        },
        error: (err) => {
          console.error('Erro ao salvar evento:', err);
          alert('Erro ao salvar evento. Tente novamente.');
        }
      });
    } else {
      alert('Preencha todos os campos corretamente.');
    }
  }

  voltar() {
    this.router.navigate(['/painel']); // navega de volta para o painel
  }
}
