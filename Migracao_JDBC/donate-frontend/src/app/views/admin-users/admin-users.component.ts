import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { UserService } from '../../services/usuario/user.service';
import { UsuarioDto } from '../../domain/dto/usuario.dto';
import { HeadearComponent } from '../headear/headear.component';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, HeadearComponent],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);

  users: UsuarioDto[] = [];
  loading = false;
  errorMsg = '';

  // filtros
  filtroEmail: string = '';
  filtroCPF: string = '';
  filtroRole: 'admin' | 'doadora' | 'receptora' | 'profissional' | '' = '';

  ngOnInit(): void {
    this.fetchUsers();
  }

  /** Busca todos os usuários */
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

  /** Atualiza a role do usuário */
  setRole(user: UsuarioDto, role: 'admin' | 'doadora' | 'receptora' | 'profissional') {
    const isAdmin = role === 'admin';
    const isDoadora = role === 'doadora';
    const isReceptora = role === 'receptora';
    const isProfissional = role === 'profissional';

    this.userService.setUserRole(user.id, isAdmin, isDoadora, isReceptora, isProfissional)
      .subscribe({
        next: () => this.fetchUsers(),
        error: (err: any) => console.error(err)
      });
  }

  /** Exclui usuário */
  deleteUser(user: UsuarioDto): void {
    if (!confirm(`Deseja realmente excluir ${user.nome}?`)) return;

    this.userService.deleteUser(user.id).subscribe({
      next: () => this.fetchUsers(),
      error: (err: any) => console.error(err)
    });
  }

  /** Volta para o painel principal */
  voltarPainel(): void {
    this.router.navigate(['/painel']);
  }

  /** Lista de usuários filtrada por email, CPF e role */
  get usuariosFiltrados(): UsuarioDto[] {
    return this.users.filter(user =>
      (!this.filtroEmail || user.email?.toLowerCase().includes(this.filtroEmail.toLowerCase())) &&
      (!this.filtroCPF || user.cpf?.toLowerCase().includes(this.filtroCPF.toLowerCase())) &&
      (
        !this.filtroRole ||
        (this.filtroRole === 'admin' && user.admin) ||
        (this.filtroRole === 'doadora' && user.doadora) ||
        (this.filtroRole === 'receptora' && user.receptora) ||
        (this.filtroRole === 'profissional' && user.profissional)
      )
    );
  }
}
