import { Injectable, computed, signal } from '@angular/core';
import { ItemCarrito } from '../../models/carrito.model';
import { EstadoPedido, ResumenPedido } from '../../models/pedido.model';
import { MesaConfig } from '../../models/mesa.model';

export interface Pedido {
  id: string;
  numero: string;
  items: ItemCarrito[];
  resumen: ResumenPedido;
  mesa: MesaConfig;
  notasCocina: string;
  creadoEn: string;
  tiempoEstimadoMin: number;
  estado: EstadoPedido;
}

export interface NuevoPedido {
  items: ItemCarrito[];
  resumen: ResumenPedido;
  mesa: MesaConfig;
  notasCocina: string;
}

@Injectable({ providedIn: 'root' })
export class PedidosService {
  private readonly pedidoActual = signal<Pedido | null>(null);

  /**
   * Indica si hay conexión real con el servidor / cocina. Mientras sea `false`,
   * el pedido se simula localmente (demostración).
   */
  readonly integracionActiva = signal(false);

  readonly pedido = this.pedidoActual.asReadonly();
  readonly hayPedidoActivo = computed(() => this.pedidoActual() !== null);

  crearPedido(nuevo: NuevoPedido): Pedido {
    const tiempoEstimadoMin =
      10 + nuevo.items.reduce((total, item) => total + item.cantidad * 4, 0);

    const pedido: Pedido = {
      id: this.generarId(),
      numero: this.generarNumero(),
      items: nuevo.items,
      resumen: nuevo.resumen,
      mesa: nuevo.mesa,
      notasCocina: nuevo.notasCocina,
      creadoEn: new Date().toISOString(),
      tiempoEstimadoMin,
      estado: 'recibido',
    };

    this.pedidoActual.set(pedido);
    return pedido;
  }

  actualizarEstado(estado: EstadoPedido): void {
    this.pedidoActual.update((actual) => (actual ? { ...actual, estado } : actual));
  }

  limpiar(): void {
    this.pedidoActual.set(null);
  }

  private generarId(): string {
    return `PED-${Date.now().toString(36).toUpperCase()}`;
  }

  private generarNumero(): string {
    const aleatorio = Math.floor(100 + Math.random() * 900);
    return `#${aleatorio}`;
  }
}
