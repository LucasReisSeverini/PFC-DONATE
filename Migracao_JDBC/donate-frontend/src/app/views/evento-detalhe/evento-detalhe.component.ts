import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

export interface Evento {
  titulo: string;
  descricao: string;
  data: string;
  tipo: 'evento' | 'noticia';
  cidadeNome?: string; // <-- Adiciona a cidade opcional
}

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.css'],
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule]
})
export class EventoDetalheComponent {
  constructor(
    public dialogRef: MatDialogRef<EventoDetalheComponent>,
    @Inject(MAT_DIALOG_DATA) public evento: Evento
  ) {}

  fechar(): void {
    this.dialogRef.close();
  }
}
