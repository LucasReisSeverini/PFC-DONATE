export interface PerfilDto {
  nome: string;
  email: string;
  telefone: string;
  senha_antiga?: string;
  nova_senha?: string;
}
