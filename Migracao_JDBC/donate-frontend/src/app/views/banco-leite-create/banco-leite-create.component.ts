import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HeadearComponent } from '../headear/headear.component';
import { BancoService } from '../../services/banco/banco.service';
import { MunicipioService, Municipio } from '../../services/municipio/municipio.service';

@Component({
  selector: 'app-banco-leite-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeadearComponent],
  templateUrl: './banco-leite-create.component.html',
  styleUrls: ['./banco-leite-create.component.css']
})
export class BancoLeiteCreateComponent implements OnInit {

  bancoForm!: FormGroup;
  municipios: Municipio[] = [];

  mensagem: string = '';
  sucesso: boolean = true;

  constructor(
    private fb: FormBuilder,
    private bancoService: BancoService,
    private municipioService: MunicipioService
  ) {}

  ngOnInit(): void {
    this.bancoForm = this.fb.group({
      nome: ['', Validators.required],
      endereco: ['', Validators.required],
      telefone: ['', Validators.required],
      latitude: [null],
      longitude: [null],
      idMunicipio: [null, Validators.required]
    });

    this.carregarMunicipios();
  }

  carregarMunicipios() {
    this.municipioService.getMunicipios().subscribe({
      next: (data: Municipio[]) => this.municipios = data,
      error: (err: any) => console.error('Erro ao carregar municípios', err)
    });
  }

  cadastrarBanco() {
    const formValue = this.bancoForm.value;

    // 🔹 Payload adaptado para o backend
    const payload: any = {
      nome: formValue.nome,
      endereco: formValue.endereco,
      telefone: formValue.telefone,
      latitude: formValue.latitude,
      longitude: formValue.longitude,
      id_municipio: formValue.idMunicipio
    };

    this.bancoService.adicionarBanco(payload).subscribe({
      next: (res: number) => {
        this.mensagem = 'Banco de Leite cadastrado com sucesso!';
        this.sucesso = true;
        this.bancoForm.reset();
      },
      error: (err: any) => {
        this.mensagem = 'Erro ao cadastrar Banco de Leite!';
        this.sucesso = false;
        console.error(err);
      }
    });
  }

  voltar() {
    window.history.back();
  }
}
