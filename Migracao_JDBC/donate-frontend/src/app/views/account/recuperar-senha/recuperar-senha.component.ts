import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RecuperarSenhaService } from '../../../services/recuperar-senha/recuperar-senha.service';
import { HeadearComponent } from '../../headear/headear.component';

@Component({
  selector: 'app-recuperar-senha',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, HeadearComponent],
  templateUrl: './recuperar-senha.component.html',
  styleUrls: ['./recuperar-senha.component.css']
})
export class RecuperarSenhaComponent {
  email: string = '';
  codigo: string = '';
  novaSenha: string = '';
  codigoEnviado: boolean = false;
  mensagem: string = '';

  private recuperarSenhaService = inject(RecuperarSenhaService);
  private router = inject(Router);

  enviarCodigo() {
    if (!this.email) {
      this.mensagem = 'Informe seu e-mail.';
      return;
    }

    this.recuperarSenhaService.enviarCodigo(this.email).subscribe({
      next: (res: any) => {
        this.codigoEnviado = res.sucesso;
        this.mensagem = res.mensagem;
      },
      error: () => {
        this.mensagem = 'Erro ao enviar código. Tente novamente.';
      }
    });
  }

  resetarSenha() {
    if (!this.codigo || !this.novaSenha) {
      this.mensagem = 'Informe o código e a nova senha.';
      return;
    }

    this.recuperarSenhaService.resetarSenha(this.email, this.codigo, this.novaSenha)
      .subscribe({
        next: (res: any) => {
          this.mensagem = res.mensagem;  // usa a mensagem retornada pelo backend
          if (res.sucesso) {
            this.codigoEnviado = false;
            this.email = '';
            this.codigo = '';
            this.novaSenha = '';
          }
        },
        error: () => {
          this.mensagem = 'Erro ao redefinir senha. Tente novamente mais tarde.';
        }
      });
  }

  voltarLogin() {
    this.router.navigate(['/login']);
  }
}
