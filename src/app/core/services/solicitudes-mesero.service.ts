import { Injectable, signal } from '@angular/core';
import { MotivoSolicitud, SolicitudMesero } from '../../models/pedido.model';

export const MOTIVOS_SOLICITUD: { id: MotivoSolicitud; titulo: string; descripcion: string }[] = [
  {
    id: 'cuenta',
    titulo: 'Solicitar la cuenta',
    descripcion: 'Pide el recibo para pagar en caja o en la mesa.',
  },
  {
    id: 'utensilios',
    titulo: 'Cubiertos, servilletas o salsas',
    descripcion: 'Solicita utensilios adicionales para tu mesa.',
  },
  {
    id: 'ayuda',
    titulo: 'Ayuda con el pedido',
    descripcion: 'Un mesero se acercará para ayudarte con tu pedido.',
  },
];

@Injectable({ providedIn: 'root' })
export class SolicitudesMeseroService {
  private readonly solicitudes = signal<SolicitudMesero[]>([]);
  /** Flag que indica si existe integración real con el sistema del restaurante. */
  readonly integracionActiva = signal(false);

  readonly historial = this.solicitudes.asReadonly();

  enviarSolicitud(
    motivo: MotivoSolicitud,
    mesa: number | null,
    tipoPedido: 'mesa' | 'llevar',
  ): SolicitudMesero {
    const solicitud: SolicitudMesero = {
      id: this.generarId(),
      motivo,
      mesa,
      tipoPedido,
      creadaEn: new Date().toISOString(),
      estado: this.integracionActiva() ? 'confirmada' : 'enviada',
    };
    this.solicitudes.update((actuales) => [solicitud, ...actuales]);
    return solicitud;
  }

  private generarId(): string {
    return `SOL-${Date.now().toString(36).toUpperCase()}`;
  }
}
