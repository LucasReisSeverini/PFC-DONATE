import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu'; // ✅ Import necessário para o menu

@Component({
  selector: 'app-painel',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatExpansionModule,
    MatMenuModule // ✅ Incluído para habilitar o menu
  ],
  templateUrl: './painel.component.html',
  styleUrls: ['./painel.component.css']
})
export class PainelComponent implements OnInit {
  roleUsuario: string | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    // Recupera a role do usuário armazenada no localStorage
    this.roleUsuario = localStorage.getItem('role');
  }

  irParaAgendamento() {
    this.router.navigate(['/agendamento']);
  }

  irParaBancoProximo() {
    this.router.navigate(['/banco-proximo']);
  }

  sair() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}
