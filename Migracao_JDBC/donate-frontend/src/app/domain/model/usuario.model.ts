// src/app/models/usuario.model.ts
export interface Usuario {
  id?: number;
  nome?: string;
  email: string;
  senha: string;
  telefone?: string;
  cpf?: string;
  tipo?: 'doadora' | 'receptora' | 'profissional'; // ou string se estiver vindo assim
}
