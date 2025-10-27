import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HeadearComponent } from '../headear/headear.component';
import { MunicipioService, Municipio } from '../../services/municipio/municipio.service';

@Component({
  selector: 'app-municipio-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeadearComponent],
  templateUrl: './municipio-create.component.html',
  styleUrls: ['./municipio-create.component.css']
})
export class MunicipioCreateComponent implements OnInit {

  municipioForm!: FormGroup;
  mensagem: string = '';
  sucesso: boolean = false;

  // UFs fixas
  ufs = [
    { id: 1, sigla: 'MG', nome: 'Minas Gerais' },
    { id: 2, sigla: 'SP', nome: 'São Paulo' },
    { id: 3, sigla: 'AC', nome: 'Acre' },
    { id: 4, sigla: 'AL', nome: 'Alagoas' },
    { id: 5, sigla: 'AP', nome: 'Amapá' },
    { id: 6, sigla: 'AM', nome: 'Amazonas' },
    { id: 7, sigla: 'BA', nome: 'Bahia' },
    { id: 8, sigla: 'CE', nome: 'Ceará' },
    { id: 9, sigla: 'DF', nome: 'Distrito Federal' },
    { id: 10, sigla: 'ES', nome: 'Espírito Santo' },
    { id: 11, sigla: 'GO', nome: 'Goiás' },
    { id: 12, sigla: 'MA', nome: 'Maranhão' },
    { id: 13, sigla: 'MT', nome: 'Mato Grosso' },
    { id: 14, sigla: 'MS', nome: 'Mato Grosso do Sul' },
    { id: 15, sigla: 'PA', nome: 'Pará' },
    { id: 16, sigla: 'PB', nome: 'Paraíba' },
    { id: 17, sigla: 'PR', nome: 'Paraná' },
    { id: 18, sigla: 'PE', nome: 'Pernambuco' },
    { id: 19, sigla: 'PI', nome: 'Piauí' },
    { id: 20, sigla: 'RJ', nome: 'Rio de Janeiro' },
    { id: 21, sigla: 'RN', nome: 'Rio Grande do Norte' },
    { id: 22, sigla: 'RS', nome: 'Rio Grande do Sul' },
    { id: 23, sigla: 'RO', nome: 'Rondônia' },
    { id: 24, sigla: 'RR', nome: 'Roraima' },
    { id: 25, sigla: 'SC', nome: 'Santa Catarina' },
    { id: 26, sigla: 'SE', nome: 'Sergipe' },
    { id: 27, sigla: 'TO', nome: 'Tocantins' }
  ];

  constructor(private fb: FormBuilder, private municipioService: MunicipioService) {}

  ngOnInit(): void {
    this.municipioForm = this.fb.group({
      nome: ['', Validators.required],
      unidadeFederativa: this.fb.group({
        id: [null, Validators.required],
        sigla: [''],
        nome: ['']
      })
    });
  }

  cadastrarMunicipio() {
    const formValue = this.municipioForm.value;

    const ufSelecionada = this.ufs.find(u => u.id === formValue.unidadeFederativa.id);
    if (ufSelecionada) {
      formValue.unidadeFederativa.sigla = ufSelecionada.sigla;
      formValue.unidadeFederativa.nome = ufSelecionada.nome;
    }

    this.municipioService.cadastrarMunicipio(formValue).subscribe({
      next: res => {
        this.mensagem = 'Município cadastrado com sucesso!';
        this.sucesso = true;
        this.municipioForm.reset();
      },
      error: err => {
        console.error('Erro ao cadastrar município', err);
        this.mensagem = 'Erro ao cadastrar município!';
        this.sucesso = false;
      }
    });
  }

  voltar() {
    window.history.back();
  }
}
