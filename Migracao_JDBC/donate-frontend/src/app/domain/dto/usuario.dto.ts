export interface UsuarioDto {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  admin: boolean;
  doadora: boolean;
  receptora: boolean;
  profissional: boolean;
}
