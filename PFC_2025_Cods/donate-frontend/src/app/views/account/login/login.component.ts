import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgZone } from '@angular/core';
import { LoginDto } from '../../../domain/dto/login.dto';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private ngZone = inject(NgZone);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      const loginData: LoginDto = this.loginForm.value;

      this.authService.login(loginData.email, loginData.senha).subscribe({
        next: (res: any) => {
          if (res.token) {
            // Salva o token
            localStorage.setItem('token', res.token);

            // Decodifica o JWT para pegar a role
            try {
              const payload = JSON.parse(atob(res.token.split('.')[1]));
              if (payload.role) {
                localStorage.setItem('role', payload.role); // Salva a role
              }
            } catch (err) {
              console.error('Erro ao decodificar token:', err);
            }

            alert('Login realizado com sucesso!');

            this.ngZone.run(() => {
              this.router.navigate(['/painel']);
            });
          } else {
            alert('Erro ao logar: token não recebido');
          }
        },
        error: (err: any) => {
          console.error(err);
          alert('Email ou senha inválidos');
        }
      });
    }
  }
}
