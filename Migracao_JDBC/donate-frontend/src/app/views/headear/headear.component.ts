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
  roleUsuario: string | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    // Recupera a role do usuário armazenada no localStorage
    this.roleUsuario = localStorage.getItem('role');
  }

  sair() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}
