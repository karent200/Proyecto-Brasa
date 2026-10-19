import { Component, inject } from '@angular/core';
import { UiService } from '../../../core/services/ui.service';

@Component({
  selector: 'app-boton-mesero',
  template: `
    <button
      type="button"
      class="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2.5 rounded-full bg-brasa-black px-5 py-3.5 text-sm font-semibold text-white shadow-2xl transition hover:bg-brasa-orange focus:outline-none focus-visible:ring-2 focus-visible:ring-brasa-orange focus-visible:ring-offset-2 md:bottom-8 md:right-8"
      (click)="ui.abrirModalMesero()"
      aria-label="Llamar al mesero para pedir asistencia"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      Llamar Mesero
    </button>
  `,
})
export class BotonMeseroComponent {
  protected readonly ui = inject(UiService);
}
