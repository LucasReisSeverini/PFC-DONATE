export interface DoacaoDto {
  id_bancos_de_leite: number;
  quantidade_ml: number;
  data_doacao: string;
  hora_doacao: string;
  id_usuario: number;  // novo campo obrigatório para enviar o id
}
