import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgZone } from '@angular/core'; // ✅ Importando NgZone

@Component({
    selector: 'app-login',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private ngZone = inject(NgZone); // ✅ Injetando NgZone

  constructor() {
    this.loginForm = this.fb.group({
      email: [''],
      senha: [''],
      latitude: [null],
      longitude: [null]
    });
  }

  ngOnInit(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.loginForm.patchValue({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
        }
      );
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, senha, latitude, longitude } = this.loginForm.value;

      this.authService.login(email, senha, latitude, longitude).subscribe({
        next: (res: any) => {
          if (res.token) {
            localStorage.setItem('token', res.token); // 🔒 Salvando token corretamente

            alert('Login realizado com sucesso!');

            // ✅ Redirecionando corretamente com Angular detectando a mudança
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
