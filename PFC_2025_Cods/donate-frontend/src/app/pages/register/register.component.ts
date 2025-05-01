import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { Observable, map, startWith } from 'rxjs';
import { MatRadioModule } from '@angular/material/radio';

interface Cidade {
  id: number;
  nome: string;
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
  cidades: Cidade[] = [];
  cidadesFiltradas$: Observable<Cidade[]> = new Observable();

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
      perfil: ['', Validators.required],
      latitude: [null],
      longitude: [null],
      id_cidade: [null, Validators.required]
    });
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
          // Continua sem localização, sem travar o cadastro
        }
      );
    } else {
      console.warn('Geolocalização não suportada pelo navegador. Continuando sem latitude/longitude.');
    }
  }

  carregarCidades(): void {
    this.cidades = [
      { id: 1, nome: 'Santa Rita do Sapucaí' },
      { id: 2, nome: 'Belo Horizonte' },
      { id: 3, nome: 'Uberlândia' },
      { id: 4, nome: 'Contagem' },
      { id: 5, nome: 'Juiz de Fora' },
      { id: 6, nome: 'Betim' },
      { id: 7, nome: 'Montes Claros' },
      { id: 8, nome: 'Ribeirão das Neves' },
      { id: 9, nome: 'Uberaba' },
      { id: 10, nome: 'Governador Valadares' },
      { id: 11, nome: 'Ipatinga' },
      { id: 12, nome: 'Sete Lagoas' },
      { id: 13, nome: 'Divinópolis' },
      { id: 14, nome: 'Poços de Caldas' },
      { id: 15, nome: 'Patos de Minas' },
      { id: 16, nome: 'Teófilo Otoni' },
      { id: 17, nome: 'Barbacena' },
      { id: 18, nome: 'Sabará' },
      { id: 19, nome: 'Pouso Alegre' },
      { id: 20, nome: 'Araguari' },
      { id: 21, nome: 'Passos' },
      { id: 22, nome: 'Itabira' },
      { id: 23, nome: 'Varginha' },
      { id: 24, nome: 'Conselheiro Lafaiete' },
      { id: 25, nome: 'Lavras' },
      { id: 26, nome: 'Pará de Minas' },
      { id: 27, nome: 'Alfenas' },
      { id: 28, nome: 'Nova Serrana' },
      { id: 29, nome: 'Ituiutaba' },
      { id: 30, nome: 'São João del Rei' }
    ];
  }

  filtrarCidades(value: string): Cidade[] {
    const filtro = value.toLowerCase();
    return this.cidades.filter(cidade => cidade.nome.toLowerCase().includes(filtro));
  }

  onCidadeSelecionada(event: any): void {
    const cidadeSelecionada = this.cidades.find(c => c.nome === event.option.value);
    if (cidadeSelecionada) {
      this.registerForm.patchValue({ id_cidade: cidadeSelecionada.id });
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formData = { ...this.registerForm.value };

      // Converte perfil para campos booleanos
      formData.doadora = formData.perfil === 'doadora';
      formData.receptora = formData.perfil === 'receptora';
      formData.profissional = formData.perfil === 'profissional';

      delete formData.perfil;

      console.log('Enviando dados para o backend:', formData);

      this.authService.register(formData).subscribe({
        next: () => {
          alert('Cadastro realizado com sucesso!');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error(err);
          alert('Erro ao cadastrar. Verifique os dados.');
        }
      });
    } else {
      alert('Preencha todos os campos obrigatórios corretamente.');
    }
  }
}
