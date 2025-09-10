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
import { RegisterDto } from '../../../domain/dto/register.dto';

// Interface para cidades com estado
interface CidadeComEstado extends Cidade {
  estado: {
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
  cidadeControl = new FormControl('');
  cidades: CidadeComEstado[] = [];
  cidadesFiltradas$: Observable<CidadeComEstado[]> = new Observable();

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private cidadeService = inject(CidadeService);

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
      confirmarSenha: ['', Validators.required],
      perfil: ['', Validators.required],
      latitude: [null],
      longitude: [null],
      id_cidade: [null]
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
        pos => this.registerForm.patchValue({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        err => console.warn('Não foi possível obter a localização.', err)
      );
    }
  }

  carregarCidades(): void {
    this.cidadeService.getCidades().subscribe({
      next: (dados: any[]) => {
        // Mapeia para incluir o estado, caso venha apenas o id_estado
        this.cidades = dados.map(c => ({
          ...c,
          estado: c.estado ?? { id: 0, nome: '', sigla: '' }
        }));
      },
      error: (err) => {
        console.error('Erro ao carregar cidades', err);
        alert('Erro ao carregar cidades do servidor.');
      }
    });
  }

  filtrarCidades(value: string): CidadeComEstado[] {
    const filtro = value.toLowerCase();
    return this.cidades.filter(c => c.nome.toLowerCase().includes(filtro));
  }

  onCidadeSelecionada(event: any): void {
    const cidadeSelecionada = this.cidades.find(c => c.nome === event.option.value);
    if (cidadeSelecionada) {
      this.registerForm.patchValue({ id_cidade: cidadeSelecionada.id });
      this.cidadeNaoSelecionadaErro = false;
    }
  }

  senhasIguaisValidator(form: FormGroup) {
    const senha = form.get('senha')?.value;
    const confirmarSenha = form.get('confirmarSenha')?.value;
    return senha !== confirmarSenha ? { senhasDiferentes: true } : null;
  }

  onSubmit(): void {
    this.cpfOuEmailExistenteErro = false;
    this.cidadeNaoSelecionadaErro = false;
    this.perfilNaoSelecionadoErro = false;

    if (!this.registerForm.value.perfil) {
      this.perfilNaoSelecionadoErro = true;
      alert('Selecione o tipo de usuário.');
      return;
    }
    if (!this.registerForm.value.id_cidade) {
      this.cidadeNaoSelecionadaErro = true;
      alert('Selecione uma cidade.');
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
        id_cidade: f.id_cidade,
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
