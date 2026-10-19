import { OpcionExtra, OpcionTamano } from './producto.model';

export interface PersonalizacionItem {
  tamano?: OpcionTamano;
  extras: OpcionExtra[];
  salsas: OpcionExtra[];
  retirados: string[];
  instrucciones: string;
}

export interface ItemCarrito {
  id: string;
  productoId: string;
  nombre: string;
  imagenUrl: string;
  precioBase: number;
  precioUnitario: number;
  cantidad: number;
  personalizacion: PersonalizacionItem;
}
