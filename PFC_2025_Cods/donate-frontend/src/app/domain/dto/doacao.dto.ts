// src/app/domain/dto/doacao.dto.ts

export interface DoacaoDto {
  id_bancos_de_leite: number;
  quantidade_ml: number;
  data_doacao: string;  // formato 'YYYY-MM-DD'
  hora_doacao: string;  // string no formato 'HH:mm' ou o que você usa
}
