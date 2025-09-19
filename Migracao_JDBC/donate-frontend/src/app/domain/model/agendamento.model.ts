// src/app/models/agendamento.model.ts
export interface Agendamento {
  tipo: 'entrega' | 'retirada';
  bancoDeLeite: string; // agora é o nome do banco
  data: string;
  horario: string;
  observacoes?: string;
  quantidade_ml?: number;
  nome_doadora?: string;
  status?: string;
}
