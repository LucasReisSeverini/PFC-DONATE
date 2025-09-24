import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PerfilService } from '../../../services/perfil/perfil.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { PerfilDto } from '../../../domain/dto/perfil.dto';
import { HeadearComponent } from '../../headear/headear.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, HeadearComponent],
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

    // Aplica máscara no telefone enquanto digita
    this.perfilForm.get('telefone')?.valueChanges.subscribe(() => this.formatTelefone());

    // Impede espaços nos campos de senha
    this.perfilForm.get('senhaAntiga')?.valueChanges.subscribe(val => {
      if (val?.includes(' ')) {
        this.perfilForm.get('senhaAntiga')?.setValue(val.replace(/\s/g, ''), { emitEvent: false });
      }
    });

    this.perfilForm.get('novaSenha')?.valueChanges.subscribe(val => {
      if (val?.includes(' ')) {
        this.perfilForm.get('novaSenha')?.setValue(val.replace(/\s/g, ''), { emitEvent: false });
      }
    });
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

  formatTelefone(): void {
    let tel: string = this.perfilForm.get('telefone')?.value || '';
    tel = tel.replace(/\D/g, '').slice(0, 11);

    if (tel.length === 0) {
      this.perfilForm.get('telefone')?.setValue('', { emitEvent: false });
      return;
    }

    if (tel.length <= 2) {
      tel = `(${tel}`;
    } else if (tel.length <= 7) {
      tel = `(${tel.slice(0, 2)}) ${tel.slice(2)}`;
    } else {
      tel = `(${tel.slice(0, 2)}) ${tel.slice(2, 7)}-${tel.slice(7)}`;
    }

    this.perfilForm.get('telefone')?.setValue(tel, { emitEvent: false });
  }

  salvarAlteracoes(): void {
    if (this.perfilForm.valid) {
      const dados: PerfilDto = this.perfilForm.getRawValue();

      // Validação do telefone antes de enviar
      const telefoneValido = dados.telefone?.replace(/\D/g, '').length === 11;
      if (!telefoneValido) {
        alert('Telefone inválido.');
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
          if (err.error) {
            // Mostra a mensagem enviada pelo backend
            alert(err.error);
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
