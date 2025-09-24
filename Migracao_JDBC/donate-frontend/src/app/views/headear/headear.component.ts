import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-headear',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatMenuModule
  ],
  templateUrl: './headear.component.html',
  styleUrls: ['./headear.component.css']
})
export class HeadearComponent implements OnInit {
  isLoggedIn = false;
  roleUsuario: string | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    this.updateUserStatus();
  }

  /** Atualiza o estado de login e role do usuário */
  private updateUserStatus() {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;

    if (this.isLoggedIn) {
      const role = localStorage.getItem('role');
      this.roleUsuario = role ? role : null;
    } else {
      this.roleUsuario = null;
    }
  }

  /** Realiza logout do usuário */
  sair() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.isLoggedIn = false;
    this.roleUsuario = null;
    this.router.navigate(['/login']);
  }
}
