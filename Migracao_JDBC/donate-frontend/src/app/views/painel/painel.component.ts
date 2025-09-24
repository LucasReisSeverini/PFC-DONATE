import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { HeadearComponent } from '../headear/headear.component';

@Component({
  selector: 'app-painel',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatExpansionModule,
    MatMenuModule,
    HeadearComponent
  ],
  templateUrl: './painel.component.html',
  styleUrls: ['./painel.component.css']
})
export class PainelComponent implements OnInit {
  roleUsuario: string | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    // Recupera a role do usuário
    this.roleUsuario = localStorage.getItem('role');
  }

  /** Navega para Doação ou Controle de Agendamentos conforme role */
  irParaDoacaoOuControle() {
    if (this.roleUsuario === 'PROFISSIONAL') {
      this.router.navigate(['/controle-agendamento']);
    } else {
      this.router.navigate(['/doacao']);
    }
  }

  /** Navega para Banco de Leite mais próximo */
  irParaBancoProximo() {
    this.router.navigate(['/banco-proximo']);
  }

  /** Navega para Eventos ou Gerenciamento de Eventos conforme role */
  irParaEventosOuGerenciar() {
    if (this.roleUsuario === 'PROFISSIONAL') {
      this.router.navigate(['/gerenciar-eventos']);
    } else {
      this.router.navigate(['/eventos']);
    }
  }

  /** Realiza logout */
  sair() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}
