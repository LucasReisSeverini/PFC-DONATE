// src/app/models/agendamento.model.ts
export interface Agendamento {
  tipo: 'entrega' | 'retirada';
  bancoDeLeite: number | null;
  data: string;
  horario: string;
  observacoes?: string;
}
