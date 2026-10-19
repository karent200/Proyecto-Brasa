export type TipoPedido = 'mesa' | 'llevar';

export interface MesaConfig {
  tipo: TipoPedido;
  numero: number | null;
}
