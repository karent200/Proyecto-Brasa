import { Injectable, signal } from '@angular/core';

export type TipoNotificacion = 'exito' | 'error' | 'info';

export interface Notificacion {
  id: number;
  mensaje: string;
  tipo: TipoNotificacion;
}

@Injectable({ providedIn: 'root' })
export class NotificacionesService {
  private contador = 0;
  private readonly lista = signal<Notificacion[]>([]);

  readonly notificaciones = this.lista.asReadonly();

  mostrar(mensaje: string, tipo: TipoNotificacion = 'exito'): void {
    const id = ++this.contador;
    this.lista.update((actuales) => [...actuales, { id, mensaje, tipo }]);
    setTimeout(() => this.cerrar(id), 3500);
  }

  cerrar(id: number): void {
    this.lista.update((actuales) => actuales.filter((n) => n.id !== id));
  }
}
