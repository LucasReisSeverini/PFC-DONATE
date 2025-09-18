import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PerfilService } from '../../../services/perfil/perfil.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { PerfilDto } from '../../../domain/dto/perfil.dto';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  perfilForm: FormGroup;

  private fb = inject(FormBuilder);
  private perfilService = inject(PerfilService);
  private router = inject(Router);

  constructor() {
    this.perfilForm = this.fb.group({
      nome: [''],
      email: [{ value: '', disabled: true }],
      telefone: [''],
      senhaAntiga: [''],
      novaSenha: ['']
    });
  }

  ngOnInit(): void {
    this.carregarDadosUsuario();
  }

  carregarDadosUsuario(): void {
    this.perfilService.getPerfil().subscribe({
      next: (usuario: PerfilDto) => {
        this.perfilForm.patchValue({
          nome: usuario.nome,
          email: usuario.email,
          telefone: usuario.telefone
        });
      },
      error: (err: any) => {
        console.error('Erro ao carregar dados do usuário:', err);
      }
    });
  }

  salvarAlteracoes(): void {
    if (this.perfilForm.valid) {
      const dados: PerfilDto = this.perfilForm.getRawValue();

      // Verifica se o usuário tentou mudar a senha
      if (dados.novaSenha && !dados.senhaAntiga) {
        alert('Por favor, forneça sua senha atual para alterar a senha.');
        return;
      }

      this.perfilService.atualizarPerfil(dados).subscribe({
        next: () => {
          alert('Perfil atualizado com sucesso!');
          // Limpa campos de senha após sucesso
          this.perfilForm.get('senhaAntiga')?.reset();
          this.perfilForm.get('novaSenha')?.reset();
        },
        error: (err: any) => {
          if (err.status === 403) {
            alert('Senha atual incorreta. Tente novamente.');
          } else {
            console.error('Erro ao atualizar perfil:', err);
            alert('Erro ao atualizar perfil!');
          }
        }
      });
    }
  }

  irParaPainel(): void {
    this.router.navigate(['/painel']);
  }
}
