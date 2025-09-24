import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormControl
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { Observable, map, startWith } from 'rxjs';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MunicipioService } from '../../../services/municipio/municipio.service';
import { RegisterDto } from '../../../domain/dto/register.dto';
import { HeadearComponent } from '../../headear/headear.component';

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
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatRadioModule,
    MatCheckboxModule,
    HeadearComponent
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  municipioControl = new FormControl('');
  politicaControl = new FormControl(false, Validators.requiredTrue);
  municipios: MunicipioComUF[] = [];
  municipiosFiltrados$: Observable<MunicipioComUF[]> = new Observable();
  mensagemErro: string = '';
  submitAttempted = false;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private municipioService = inject(MunicipioService);

  municipioNaoSelecionadoErro = false;
  perfilNaoSelecionadoErro = false;

  constructor() {
    this.registerForm = this.fb.group(
      {
        nome: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        telefone: ['', [Validators.required, Validators.minLength(14)]], // máscara (xx) xxxxx-xxxx
        cpf: ['', [Validators.required, Validators.minLength(14)]], // máscara xxx.xxx.xxx-xx
        senha: ['', Validators.required],
        confirmarSenha: ['', Validators.required],
        perfil: ['', Validators.required],
        latitude: [null],
        longitude: [null],
        id_municipio: [null, Validators.required]
      },
      { validators: this.senhasIguaisValidator }
    );
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
        pos =>
          this.registerForm.patchValue({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          }),
        err => console.warn('Não foi possível obter a localização.', err)
      );
    }
  }

  carregarMunicipios(): void {
    this.municipioService.getMunicipios().subscribe({
      next: (dados: MunicipioComUF[]) => (this.municipios = dados),
      error: err => {
        console.error('Erro ao carregar municípios', err);
        this.mensagemErro = 'Erro ao carregar municípios do servidor.';
      }
    });
  }

  filtrarMunicipios(value: string): MunicipioComUF[] {
    const filtro = value.toLowerCase();
    return this.municipios.filter(m => m.nome.toLowerCase().includes(filtro));
  }

  onMunicipioSelecionado(event: any): void {
    const municipioSelecionado = this.municipios.find(
      m => m.nome === event.option.value
    );
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

  formatTelefone(): void {
    let tel: string = this.registerForm.get('telefone')?.value || '';
    tel = tel.replace(/\D/g, '').slice(0, 11);

    if (tel.length === 0) {
      this.registerForm.get('telefone')?.setValue('', { emitEvent: false });
      return;
    }

    if (tel.length <= 2) {
      tel = `(${tel}`;
    } else if (tel.length <= 7) {
      tel = `(${tel.slice(0, 2)}) ${tel.slice(2)}`;
    } else {
      tel = `(${tel.slice(0, 2)}) ${tel.slice(2, 7)}-${tel.slice(7)}`;
    }

    this.registerForm.get('telefone')?.setValue(tel, { emitEvent: false });
  }

  formatCpf(): void {
    let cpf: string = this.registerForm.get('cpf')?.value || '';
    cpf = cpf.replace(/\D/g, '').slice(0, 11);

    if (cpf.length === 0) {
      this.registerForm.get('cpf')?.setValue('', { emitEvent: false });
      return;
    }

    if (cpf.length <= 3) {
      cpf = cpf;
    } else if (cpf.length <= 6) {
      cpf = `${cpf.slice(0, 3)}.${cpf.slice(3)}`;
    } else if (cpf.length <= 9) {
      cpf = `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`;
    } else {
      cpf = `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`;
    }

    this.registerForm.get('cpf')?.setValue(cpf, { emitEvent: false });
  }

  getCpfForBackend(): string {
    return (this.registerForm.get('cpf')?.value || '').replace(/\D/g, '');
  }

  getTelefoneForBackend(): string {
    return (this.registerForm.get('telefone')?.value || '').replace(/\D/g, '');
  }

  onSubmit(): void {
    this.submitAttempted = true;
    this.mensagemErro = '';
    this.municipioNaoSelecionadoErro = false;
    this.perfilNaoSelecionadoErro = false;

    if (this.politicaControl.invalid) {
      this.mensagemErro = 'Você deve aceitar a política de uso de dados pessoais para se cadastrar.';
      return;
    }

    if (!this.registerForm.value.perfil) {
      this.perfilNaoSelecionadoErro = true;
      this.mensagemErro = 'Selecione o tipo de usuário.';
      return;
    }

    if (!this.registerForm.value.id_municipio) {
      this.municipioNaoSelecionadoErro = true;
      this.mensagemErro = 'Selecione um município válido.';
      return;
    }

    const telefoneValido = this.registerForm.get('telefone')?.value?.replace(/\D/g, '').length === 11;
    const cpfValido = this.registerForm.get('cpf')?.value?.replace(/\D/g, '').length === 11;

    if (!this.registerForm.valid || !telefoneValido || !cpfValido) {
      if (this.registerForm.errors?.['senhasDiferentes']) {
        this.mensagemErro = 'As senhas não coincidem.';
      } else if (!telefoneValido) {
        this.mensagemErro = 'Telefone inválido.';
      } else if (!cpfValido) {
        this.mensagemErro = 'CPF inválido.';
      } else {
        this.mensagemErro = 'Preencha todos os campos obrigatórios corretamente.';
      }
      return;
    }

    const f = this.registerForm.value;
    const dto: RegisterDto = {
      nome: f.nome,
      email: f.email,
      telefone: this.getTelefoneForBackend(),
      cpf: this.getCpfForBackend(),
      senha: f.senha,
      latitude: f.latitude,
      longitude: f.longitude,
      id_municipio: f.id_municipio,
      doadora: f.perfil === 'doadora',
      receptora: f.perfil === 'receptora',
      profissional: f.perfil === 'profissional'
    };

    this.authService.register(dto).subscribe({
      next: () => {
        alert('Cadastro realizado com sucesso!');
        this.router.navigate(['/login']);
      },
      error: err => {
        console.error(err);
        if (err.status === 409 && typeof err.error === 'string') {
          this.mensagemErro = err.error;
        } else {
          this.mensagemErro = 'Erro ao cadastrar. Tente novamente.';
        }
      }
    });
  }
}
