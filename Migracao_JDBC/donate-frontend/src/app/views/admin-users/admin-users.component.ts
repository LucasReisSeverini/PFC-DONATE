import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { UserService } from '../../services/usuario/user.service';
import { UsuarioDto } from '../../domain/dto/usuario.dto';
import { HeadearComponent } from '../headear/headear.component';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, HeadearComponent],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router); // <-- injeção do Router

  users: UsuarioDto[] = [];
  loading = false;
  errorMsg = '';

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (data: UsuarioDto[]) => {
        this.users = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.errorMsg = 'Erro ao carregar usuários.';
        this.loading = false;
      }
    });
  }

  setRole(user: UsuarioDto, role: 'admin' | 'doadora' | 'receptora' | 'profissional') {
    const isAdmin = role === 'admin';
    const isDoadora = role === 'doadora';
    const isReceptora = role === 'receptora';
    const isProfissional = role === 'profissional';

    this.userService
      .setUserRole(user.id, isAdmin, isDoadora, isReceptora, isProfissional)
      .subscribe({
        next: () => this.fetchUsers(),
        error: (err: any) => console.error(err)
      });
  }

  deleteUser(user: UsuarioDto): void {
    if (confirm(`Deseja realmente excluir ${user.nome}?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => this.fetchUsers(),
        error: (err: any) => console.error(err)
      });
    }
  }

  voltarPainel() {
    this.router.navigate(['/painel']); // agora funciona
  }
}
