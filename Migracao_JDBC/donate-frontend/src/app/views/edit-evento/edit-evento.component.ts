import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventosService, Evento } from '../../services/eventos/eventos.service';
import { MunicipioService, Municipio } from '../../services/municipio/municipio.service';

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
  municipios: Municipio[] = [];

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private eventosService = inject(EventosService);
  private municipioService = inject(MunicipioService);

  ngOnInit(): void {
    this.eventoId = +this.route.snapshot.params['id'];

    this.eventoForm = this.fb.group({
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      data: ['', Validators.required],
      tipo: ['evento', Validators.required],
      id_municipio: [null, Validators.required] // compatível com MunicipioService
    });

    this.carregarEvento();
    this.carregarMunicipios();
  }

  carregarEvento() {
    this.eventosService.buscarEventoPorId(this.eventoId).subscribe({
      next: (evento: Evento) => {
        this.eventoForm.patchValue(evento);
      },
      error: (err: any) => {
        console.error('Erro ao carregar evento:', err);
        alert('Não foi possível carregar o evento.');
        this.router.navigate(['/eventos']);
      }
    });
  }

  carregarMunicipios() {
    this.municipioService.getMunicipios().subscribe({
      next: (res: Municipio[]) => this.municipios = res,
      error: (err: any) => console.error('Erro ao carregar municípios:', err)
    });
  }

  salvar() {
    if (this.eventoForm.invalid) return;

    const eventoAtualizado: Evento = {
      id: this.eventoId,
      ...this.eventoForm.value
    };

    console.log('Objeto enviado para o backend:', eventoAtualizado);

    this.eventosService.atualizarEvento(eventoAtualizado).subscribe({
      next: () => {
        alert('Evento atualizado com sucesso!');
        this.router.navigate(['/gerenciar-eventos']);
      },
      error: (err: any) => {
        console.error('Erro ao atualizar evento:', err);
        alert('Não foi possível atualizar o evento.');
      }
    });
  }

  voltarParaGerenciar() {
    this.router.navigate(['/gerenciar-eventos']);
  }
}
