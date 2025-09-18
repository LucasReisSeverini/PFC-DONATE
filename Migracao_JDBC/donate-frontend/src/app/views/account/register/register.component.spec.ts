import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-register',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  constructor() {
    this.registerForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      cpf: ['', Validators.required],
      senha: ['', Validators.required],
      perfil: ['', Validators.required], // ✅ somente esse para o perfil
      latitude: [null],
      longitude: [null],
      id_cidade: [null]
    });


  }

  ngOnInit(): void {
    this.getGeolocation();
  }

  getGeolocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.registerForm.patchValue({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Erro ao obter localização:', error);
        }
      );
    } else {
      console.warn('Geolocalização não suportada no navegador');
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const dados = this.registerForm.value;

      this.authService.register(dados).subscribe({
        next: () => {
          alert('Cadastro realizado com sucesso!');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error(err);
          alert('Erro ao cadastrar. Verifique os dados.');
        }
      });
    }
  }
}
