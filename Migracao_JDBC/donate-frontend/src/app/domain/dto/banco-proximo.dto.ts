export interface BancoProximoDto {
  id: number;
  nome: string;
  endereco: string;
  latitude: string;
  longitude: string;
  distancia: number;
  telefone?: string; // 👈 adiciona aqui
  coordenadas?: {
    lat: number;
    lng: number;
  };
}
