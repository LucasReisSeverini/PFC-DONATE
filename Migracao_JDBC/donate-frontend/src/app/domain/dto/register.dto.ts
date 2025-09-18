export interface RegisterDto {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  senha: string;
  confirmarSenha?: string;  // pode ser omitido na hora de enviar, só no formulário
  doadora?: boolean;
  receptora?: boolean;
  profissional?: boolean;
  latitude?: number | null;
  longitude?: number | null;
  id_municipio?: number | null;
}
