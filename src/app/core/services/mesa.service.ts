import { Injectable, computed, effect, signal } from '@angular/core';
import { MesaConfig, TipoPedido } from '../../models/mesa.model';

const STORAGE_KEY = 'brasa.mesa';

const ESTADO_INICIAL: MesaConfig = { tipo: 'mesa', numero: 4 };

@Injectable({ providedIn: 'root' })
export class MesaService {
  private readonly estado = signal<MesaConfig>(this.cargar());

  readonly tipo = computed(() => this.estado().tipo);
  readonly numero = computed(() => this.estado().numero);
  readonly esParaLlevar = computed(() => this.estado().tipo === 'llevar');

  /** Texto listo para mostrar en el encabezado, p. ej. "Mesa #04" o "Para llevar". */
  readonly etiqueta = computed(() => {
    const { tipo, numero } = this.estado();
    if (tipo === 'llevar') {
      return 'Para llevar';
    }
    return numero != null ? `Mesa #${String(numero).padStart(2, '0')}` : 'Sin mesa';
  });

  constructor() {
    effect(() => {
      const config = this.estado();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    });
  }

  establecerTipo(tipo: TipoPedido): void {
    this.estado.update((actual) => ({
      tipo,
      numero: tipo === 'llevar' ? null : actual.numero,
    }));
  }

  establecerMesa(numero: number | null): void {
    this.estado.update((actual) => ({ ...actual, numero }));
  }

  cambiarMesa(numero: number | null): void {
    this.estado.set({ tipo: 'mesa', numero });
  }

  private cargar(): MesaConfig {
    try {
      const crudo = localStorage.getItem(STORAGE_KEY);
      if (!crudo) {
        return ESTADO_INICIAL;
      }
      const parseado = JSON.parse(crudo) as Partial<MesaConfig>;
      return {
        tipo: parseado.tipo === 'llevar' ? 'llevar' : 'mesa',
        numero: typeof parseado.numero === 'number' ? parseado.numero : null,
      };
    } catch {
      return ESTADO_INICIAL;
    }
  }
}
