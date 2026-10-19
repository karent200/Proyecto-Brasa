import { Component, inject } from '@angular/core';
import { NotificacionesService } from '../../../core/services/notificaciones.service';

@Component({
  selector: 'app-notificaciones',
  template: `
    <div
      class="pointer-events-none fixed bottom-6 left-1/2 z-[60] flex w-full max-w-md -translate-x-1/2 flex-col gap-2 px-4"
      role="status"
      aria-live="polite"
    >
      @for (notificacion of servicio.notificaciones(); track notificacion.id) {
        <div
          class="pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 shadow-soft animate-slide-up"
          [class]="clasePorTipo(notificacion.tipo)"
        >
          <span class="h-2.5 w-2.5 shrink-0 rounded-full" [class]="puntoPorTipo(notificacion.tipo)"></span>
          <p class="flex-1 text-sm font-medium">{{ notificacion.mensaje }}</p>
          <button
            type="button"
            class="rounded p-1 text-brasa-muted transition hover:text-brasa-black focus:outline-none focus-visible:ring-2 focus-visible:ring-brasa-orange"
            (click)="servicio.cerrar(notificacion.id)"
            aria-label="Cerrar notificación"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      }
    </div>
  `,
})
export class NotificacionesComponent {
  protected readonly servicio = inject(NotificacionesService);

  protected clasePorTipo(tipo: string): string {
    switch (tipo) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-900';
      case 'info':
        return 'bg-white border-brasa-border text-brasa-black';
      default:
        return 'bg-white border-brasa-border text-brasa-black';
    }
  }

  protected puntoPorTipo(tipo: string): string {
    switch (tipo) {
      case 'error':
        return 'bg-red-500';
      case 'info':
        return 'bg-brasa-black';
      default:
        return 'bg-brasa-orange';
    }
  }
}
