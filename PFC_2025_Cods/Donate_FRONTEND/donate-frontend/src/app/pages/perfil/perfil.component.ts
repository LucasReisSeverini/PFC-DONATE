import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
    selector: 'app-perfil',
    imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
    templateUrl: './perfil.component.html',
    styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  perfilForm: FormGroup;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.perfilForm = this.fb.group({
      nome: [''],
      email: [{ value: '', disabled: true }],
      telefone: [''],
      senha_antiga: [''],
      nova_senha: ['']
    });
  }

  ngOnInit(): void {
    this.carregarDadosUsuario();
  }

  carregarDadosUsuario(): void {
    this.authService.getPerfil().subscribe({
      next: (usuario) => {
        this.perfilForm.patchValue({
          nome: usuario.nome,
          email: usuario.email,
          telefone: usuario.telefone
        });
      },
      error: (err) => {
        console.error('Erro ao carregar dados do usuário:', err);
      }
    });
  }

salvarAlteracoes(): void {
  if (this.perfilForm.valid) {
    const dados = this.perfilForm.getRawValue();

    // Verifica se a senha antiga foi fornecida, caso a nova senha seja informada
    if (dados.nova_senha && !dados.senha_antiga) {
      alert('Por favor, forneça sua senha antiga para alterar a senha!');
      return;
    }

    this.authService.atualizarPerfil(dados).subscribe({
      next: () => {
        alert('Perfil atualizado com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao atualizar perfil:', err);
        alert('Erro ao atualizar perfil!');
      }
    });
  }
}


  irParaPainel(): void {
    this.router.navigate(['/painel']);
  }
}
