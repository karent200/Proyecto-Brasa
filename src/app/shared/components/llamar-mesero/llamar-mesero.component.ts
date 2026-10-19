import { Component, inject, signal } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { UiService } from '../../../core/services/ui.service';
import { MesaService } from '../../../core/services/mesa.service';
import {
  MOTIVOS_SOLICITUD,
  SolicitudesMeseroService,
} from '../../../core/services/solicitudes-mesero.service';
import { MotivoSolicitud } from '../../../models/pedido.model';

@Component({
  selector: 'app-llamar-mesero',
  imports: [ModalComponent],
  template: `
    @if (ui.modalMeseroAbierto()) {
      <app-modal titulo="Llamar al mesero" anchoClase="max-w-lg" (cerrar)="cerrar()">
        <div class="space-y-4 p-6">
          @if (confirmacion()) {
            <div class="flex flex-col items-center gap-3 py-6 text-center animate-scale-in">
              <span class="flex h-14 w-14 items-center justify-center rounded-full bg-brasa-orange/10 text-brasa-orange">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              <h3 class="font-heading text-lg font-semibold text-brasa-black">Solicitud enviada</h3>
              <p class="max-w-sm text-sm text-brasa-muted">{{ confirmacion() }}</p>
              @if (!solicitudes.integracionActiva()) {
                <p class="rounded-lg bg-brasa-gray-light px-4 py-2 text-xs text-brasa-muted">
                  Demostración: aún no hay conexión con el sistema del restaurante.
                </p>
              }
              <button
                type="button"
                class="mt-2 rounded-xl bg-brasa-orange px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brasa-orange-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brasa-orange focus-visible:ring-offset-2"
                (click)="cerrar()"
              >
                Entendido
              </button>
            </div>
          } @else {
            <p class="text-sm text-brasa-muted">
              ¿En qué te podemos ayudar?
              <span class="font-medium text-brasa-black">{{ mesa.etiqueta() }}</span>
            </p>

            <div class="space-y-3">
              @for (motivo of motivos; track motivo.id) {
                <button
                  type="button"
                  class="flex w-full items-center gap-4 rounded-xl border border-brasa-border p-4 text-left transition hover:border-brasa-orange hover:bg-brasa-orange/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brasa-orange"
                  (click)="enviar(motivo.id)"
                >
                  <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brasa-orange/10 text-brasa-orange">
                    @switch (motivo.id) {
                      @case ('cuenta') {
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                          <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
                          <path d="M8 7h8M8 11h8M8 15h5" />
                        </svg>
                      }
                      @case ('utensilios') {
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
                        </svg>
                      }
                      @default {
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
                        </svg>
                      }
                    }
                  </span>
                  <span class="flex-1">
                    <span class="block font-heading text-sm font-semibold text-brasa-black">{{ motivo.titulo }}</span>
                    <span class="block text-xs text-brasa-muted">{{ motivo.descripcion }}</span>
                  </span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-brasa-muted" aria-hidden="true">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              }
            </div>
          }
        </div>
      </app-modal>
    }
  `,
})
export class LlamarMeseroComponent {
  protected readonly ui = inject(UiService);
  protected readonly mesa = inject(MesaService);
  protected readonly solicitudes = inject(SolicitudesMeseroService);
  protected readonly motivos = MOTIVOS_SOLICITUD;

  protected readonly confirmacion = signal('');

  protected enviar(motivo: MotivoSolicitud): void {
    this.solicitudes.enviarSolicitud(motivo, this.mesa.numero(), this.mesa.tipo());
    const titulo = MOTIVOS_SOLICITUD.find((m) => m.id === motivo)?.titulo ?? 'Solicitud';
    const destino = this.mesa.esParaLlevar()
      ? 'en el mostrador'
      : `en la ${this.mesa.etiqueta().toLowerCase()}`;
    this.confirmacion.set(
      `Registramos tu solicitud: "${titulo}". Un mesero te atenderá ${destino}.`,
    );
  }

  protected cerrar(): void {
    this.confirmacion.set('');
    this.ui.cerrarModalMesero();
  }
}
