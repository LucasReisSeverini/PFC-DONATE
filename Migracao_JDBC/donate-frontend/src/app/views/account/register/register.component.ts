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
import { MunicipioService } from '../../../services/municipio/municipio.service';
import { RegisterDto } from '../../../domain/dto/register.dto';

// Interface compatível com o backend
export interface MunicipioComUF {
  id: number;
  nome: string;
  unidadeFederativa: {
    id: number;
    nome: string;
    sigla: string;
  };
}

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
  municipioControl = new FormControl('');
  municipios: MunicipioComUF[] = [];
  municipiosFiltrados$: Observable<MunicipioComUF[]> = new Observable();

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private municipioService = inject(MunicipioService);

  cpfOuEmailExistenteErro = false;
  municipioNaoSelecionadoErro = false;
  perfilNaoSelecionadoErro = false;

  constructor() {
    this.registerForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      cpf: ['', Validators.required],
      senha: ['', Validators.required],
      confirmarSenha: ['', Validators.required],
      perfil: ['', Validators.required],
      latitude: [null],
      longitude: [null],
      id_municipio: [null, Validators.required]
    }, { validators: this.senhasIguaisValidator });
  }

  ngOnInit(): void {
    this.getLocation();
    this.carregarMunicipios();

    this.municipiosFiltrados$ = this.municipioControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filtrarMunicipios(value || ''))
    );
  }

  getLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => this.registerForm.patchValue({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        err => console.warn('Não foi possível obter a localização.', err)
      );
    }
  }

  carregarMunicipios(): void {
    this.municipioService.getMunicipios().subscribe({
      next: (dados: MunicipioComUF[]) => {
        this.municipios = dados; // Já está no formato correto
      },
      error: (err: any) => {
        console.error('Erro ao carregar municípios', err);
        alert('Erro ao carregar municípios do servidor.');
      }
    });
  }


  filtrarMunicipios(value: string): MunicipioComUF[] {
    const filtro = value.toLowerCase();
    return this.municipios.filter(m => m.nome.toLowerCase().includes(filtro));
  }

  onMunicipioSelecionado(event: any): void {
    const municipioSelecionado = this.municipios.find(m => m.nome === event.option.value);
    if (municipioSelecionado) {
      this.registerForm.patchValue({ id_municipio: municipioSelecionado.id });
      this.municipioNaoSelecionadoErro = false;
    }
  }

  senhasIguaisValidator(form: FormGroup) {
    const senha = form.get('senha')?.value;
    const confirmarSenha = form.get('confirmarSenha')?.value;
    return senha !== confirmarSenha ? { senhasDiferentes: true } : null;
  }

  onSubmit(): void {
    this.cpfOuEmailExistenteErro = false;
    this.municipioNaoSelecionadoErro = false;
    this.perfilNaoSelecionadoErro = false;

    if (!this.registerForm.value.perfil) {
      this.perfilNaoSelecionadoErro = true;
      alert('Selecione o tipo de usuário.');
      return;
    }

    if (!this.registerForm.value.id_municipio) {
      this.municipioNaoSelecionadoErro = true;
      alert('Selecione um município.');
      return;
    }

    if (this.registerForm.valid) {
      const f = this.registerForm.value;
      const dto: RegisterDto = {
        nome: f.nome,
        email: f.email,
        telefone: f.telefone,
        cpf: f.cpf,
        senha: f.senha,
        latitude: f.latitude,
        longitude: f.longitude,
        id_municipio: f.id_municipio,
        doadora: f.perfil === 'doadora',
        receptora: f.perfil === 'receptora',
        profissional: f.perfil === 'profissional'
      };

      this.authService.register(dto).subscribe({
        next: () => { alert('Cadastro realizado com sucesso!'); this.router.navigate(['/login']); },
        error: err => {
          console.error(err);
          if (err.error?.message?.includes('CPF') || err.error?.message?.includes('Email')) {
            this.cpfOuEmailExistenteErro = true;
            alert('CPF ou Email já cadastrado.');
          } else alert('Erro ao cadastrar.');
        }
      });
    } else {
      if (this.registerForm.errors?.['senhasDiferentes']) alert('As senhas não coincidem.');
      else alert('Preencha todos os campos corretamente.');
    }
  }
}
