import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { Observable, map, startWith } from 'rxjs';
import { MatRadioModule } from '@angular/material/radio';
import { CidadeService, Cidade } from '../../../services/cidade/cidade.service';
import { RegisterDto } from '../../../domain/dto/register.dto'; //DTO importado

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatRadioModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  cidadeControl = new FormControl('');
  cidades: Cidade[] = [];
  cidadesFiltradas$: Observable<Cidade[]> = new Observable();

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private cidadeService = inject(CidadeService);

  // Flags de erro para CPF/email e validações de cidade/perfil
  cpfOuEmailExistenteErro = false;
  cidadeNaoSelecionadaErro = false;
  perfilNaoSelecionadoErro = false;

  constructor() {
    this.registerForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      cpf: ['', Validators.required],
      senha: ['', Validators.required],
      confirmarSenha: ['', Validators.required],  // Campo para confirmar senha
      perfil: ['', Validators.required],
      latitude: [null],
      longitude: [null],
      id_cidade: [null]  // Opcional
    }, { validators: this.senhasIguaisValidator });
  }

  ngOnInit(): void {
    this.getLocation();
    this.carregarCidades();

    this.cidadesFiltradas$ = this.cidadeControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filtrarCidades(value || ''))
    );
  }

  getLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.registerForm.patchValue({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        error => {
          console.warn('Não foi possível obter a localização. Continuando sem latitude/longitude.', error);
        }
      );
    } else {
      console.warn('Geolocalização não suportada pelo navegador. Continuando sem latitude/longitude.');
    }
  }

  carregarCidades(): void {
    this.cidadeService.getCidades().subscribe({
      next: (dados: Cidade[]) => {
        this.cidades = dados;
      },
      error: (err) => {
        console.error('Erro ao carregar cidades', err);
        alert('Erro ao carregar cidades do servidor.');
      }
    });
  }

  filtrarCidades(value: string): Cidade[] {
    const filtro = value.toLowerCase();
    return this.cidades.filter(cidade => cidade.nome.toLowerCase().includes(filtro));
  }

  onCidadeSelecionada(event: any): void {
    const cidadeSelecionada = this.cidades.find(c => c.nome === event.option.value);
    if (cidadeSelecionada) {
      this.registerForm.patchValue({ id_cidade: cidadeSelecionada.id });
      this.cidadeNaoSelecionadaErro = false; // limpa erro ao selecionar cidade
    }
  }

  senhasIguaisValidator(form: FormGroup) {
    const senha = form.get('senha')?.value;
    const confirmarSenha = form.get('confirmarSenha')?.value;
    return senha !== confirmarSenha ? { senhasDiferentes: true } : null;
  }

  onSubmit(): void {
    // Reseta flags de erro
    this.cpfOuEmailExistenteErro = false;
    this.cidadeNaoSelecionadaErro = false;
    this.perfilNaoSelecionadoErro = false;

    // Validação manual para perfil e cidade
    if (!this.registerForm.value.perfil) {
      this.perfilNaoSelecionadoErro = true;
      alert('Por favor, selecione o tipo de usuário.');
      return;
    }
    if (!this.registerForm.value.id_cidade) {
      this.cidadeNaoSelecionadaErro = true;
      alert('Por favor, selecione uma cidade.');
      return;
    }

    if (this.registerForm.valid) {
      // Monta o DTO para enviar
      const formValue = this.registerForm.value;
      const formData: RegisterDto = {
        nome: formValue.nome,
        email: formValue.email,
        telefone: formValue.telefone,
        cpf: formValue.cpf,
        senha: formValue.senha,
        latitude: formValue.latitude,
        longitude: formValue.longitude,
        id_cidade: formValue.id_cidade,
        doadora: formValue.perfil === 'doadora',
        receptora: formValue.perfil === 'receptora',
        profissional: formValue.perfil === 'profissional'
      };

      console.log('Enviando dados para o backend:', formData);

      this.authService.register(formData).subscribe({
        next: () => {
          alert('Cadastro realizado com sucesso!');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error(err);
          if (err.error?.message?.includes('CPF') || err.error?.message?.includes('Email')) {
            this.cpfOuEmailExistenteErro = true;
            alert('CPF ou Email já cadastrado.');
          } else {
            alert('Erro ao cadastrar. Verifique os dados.');
          }
        }
      });
    } else {
      if (this.registerForm.errors?.['senhasDiferentes']) {
        alert('A senha não coincidem.');
      } else {
        alert('Preencha todos os campos obrigatórios corretamente.');
      }
    }
  }
}
