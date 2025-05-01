import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-painel',
    imports: [CommonModule, RouterModule, MatButtonModule],
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
