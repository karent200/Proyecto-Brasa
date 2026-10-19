import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UiService {
  readonly modalMeseroAbierto = signal(false);
  readonly modalCambiarMesaAbierto = signal(false);

  abrirModalMesero(): void {
    this.modalMeseroAbierto.set(true);
  }

  cerrarModalMesero(): void {
    this.modalMeseroAbierto.set(false);
  }

  abrirModalCambiarMesa(): void {
    this.modalCambiarMesaAbierto.set(true);
  }

  cerrarModalCambiarMesa(): void {
    this.modalCambiarMesaAbierto.set(false);
  }
}
