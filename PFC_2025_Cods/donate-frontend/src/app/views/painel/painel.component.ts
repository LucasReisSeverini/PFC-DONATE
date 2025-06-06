import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion'; // <<< Importar módulo de expansão

@Component({
  selector: 'app-painel',
  standalone: true, // Presumo que seja standalone, caso contrário ignore essa linha
  imports: [CommonModule, RouterModule, MatButtonModule, MatExpansionModule], // <<< Adicionado MatExpansionModule
  templateUrl: './painel.component.html',
  styleUrls: ['./painel.component.css']
})
export class PainelComponent {
  constructor(private router: Router) {}

  irParaAgendamento() {
    this.router.navigate(['/agendamento']);
  }

  irParaBancoProximo() {
    this.router.navigate(['/banco-proximo']);
  }

  sair() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
