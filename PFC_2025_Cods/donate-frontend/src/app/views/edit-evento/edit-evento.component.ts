import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventosService, Evento } from '../../services/eventos/eventos.service';
import { CidadeService, Cidade } from '../../services/cidade/cidade.service';

@Component({
  selector: 'app-edit-evento',
  templateUrl: './edit-evento.component.html',
  styleUrls: ['./edit-evento.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class EditEventoComponent implements OnInit {
  eventoForm!: FormGroup;
  eventoId!: number;
  cidades: Cidade[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private eventosService: EventosService,
    private cidadeService: CidadeService
  ) {}

  ngOnInit(): void {
    this.eventoId = +this.route.snapshot.params['id'];

    this.eventoForm = this.fb.group({
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      data: ['', Validators.required],
      tipo: ['evento', Validators.required],
      idCidade: [null, Validators.required]  // <-- nova propriedade
    });

    this.carregarEvento();
    this.carregarCidades();
  }

  carregarEvento() {
    this.eventosService.buscarEventoPorId(this.eventoId).subscribe({
      next: (evento: Evento) => {
        this.eventoForm.patchValue(evento);
      },
      error: (err) => {
        console.error('Erro ao carregar evento:', err);
        alert('Não foi possível carregar o evento.');
        this.router.navigate(['/eventos']);
      }
    });
  }

  carregarCidades() {
    this.cidadeService.getCidades().subscribe({
      next: (res) => (this.cidades = res),
      error: (err) => console.error('Erro ao carregar cidades:', err)
    });
  }

  salvar() {
    if (this.eventoForm.invalid) return;

    const eventoAtualizado: Evento = {
      id: this.eventoId,
      ...this.eventoForm.value
    };

      // 👉 Console log para ver o que está sendo enviado
      console.log('Objeto enviado para o backend:', eventoAtualizado);

    this.eventosService.atualizarEvento(eventoAtualizado).subscribe({
      next: () => {
        alert('Evento atualizado com sucesso!');
        this.router.navigate(['/eventos']);
      },
      error: (err) => {
        console.error('Erro ao atualizar evento:', err);
        alert('Não foi possível atualizar o evento.');
      }
    });
  }

  voltarParaGerenciar() {
    this.router.navigate(['/gerenciar-eventos']);
  }
}
