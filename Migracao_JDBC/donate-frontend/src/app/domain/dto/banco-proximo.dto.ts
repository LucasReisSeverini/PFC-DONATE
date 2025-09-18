export interface BancoProximoDto {
  id?: number;
  nome: string;          // nome do banco (ajustei para 'nome', não 'nome_banco_leite')
  endereco?: string;     // endereço, como string (opcional)
  distancia?: number;    // distância em km (opcional)
  latitude: number | string;
  longitude: number | string;
  coordenadas?: {
    lat: number;
    lng: number;
  };
  // outros campos, se existirem
}
