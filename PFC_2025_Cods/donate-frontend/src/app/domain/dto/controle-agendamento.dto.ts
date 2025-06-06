export interface AgendamentoDto{
  id: number;
  tipo: 'entrega' | 'retirada';
  bancoDeLeite: number | null;
  data_agendamento: string;
  horario: string;
  status: string;
  quantidade_ml: number;
  nome_doadora: string;
  nome_receptora: string;
  observacoes?: string;
}
