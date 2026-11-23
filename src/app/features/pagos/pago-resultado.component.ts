import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiService, mensajeError } from '../../core/services/api.service';
import { leerDetallePago, DetallePago } from '../../core/services/detalle-pago.service';
import { PedidosService } from '../../core/services/pedidos.service';
import { ETIQUETA_ESTADO_PAGO, Pago, Pedido } from '../../models/pedido.model';
import { PrecioCopPipe } from '../../shared/pipes/precio-cop.pipe';

/**
 * Página a la que vuelve el cliente desde la pasarela. El estado NO se toma de la URL:
 * se pide al servidor, que lo consulta directamente a Wompi (o ya lo recibió por webhook).
 */
@Component({
  selector: 'app-pago-resultado',
  imports: [RouterLink, PrecioCopPipe],
  template: `
    <section class="mx-auto max-w-lg px-5 py-16 text-center">
      @if (verificando()) {
        <p class="text-sm text-brasa-muted" role="status">Confirmando tu pago con la pasarela...</p>
      } @else if (pedido()) {
        <div class="rounded-2xl border border-brasa-border bg-white p-8 shadow-card" role="status">
          <h1 class="font-heading text-2xl font-bold" [class]="pedido()!.estadoPago === 'PAGADO' ? 'text-green-700' : 'text-brasa-black'">
            @switch (pedido()!.estadoPago) {
              @case ('PAGADO') { ¡Pago confirmado! }
              @case ('PARCIAL') { Pago parcial recibido }
              @default { Pago pendiente o no aprobado }
            }
          </h1>
          <p class="mt-3 text-sm text-brasa-muted">
            Pedido {{ pedido()!.numero }} · {{ etiquetas[pedido()!.estadoPago] }}
            @if (pedido()!.saldo > 0) { · Saldo pendiente {{ pedido()!.saldo | precioCop }} }
          </p>
          @if (pagoReciente()) {
            <div class="mt-5 rounded-xl border border-brasa-border bg-brasa-gray-light px-4 py-3 text-left text-sm" role="status">
              <p class="font-semibold text-brasa-black">Pagaste {{ pagoReciente()!.monto | precioCop }}</p>
              @if ((detalle()?.productos?.length ?? 0) > 0) {
                <p class="mt-1 text-xs text-brasa-muted">Por: {{ detalle()!.productos.join(', ') }}</p>
              }
            </div>
          }
          @if (pedido()!.pagado > 0) {
            <p class="mt-3 text-xs text-brasa-muted">
              Pagado {{ pedido()!.pagado | precioCop }} de {{ pedido()!.resumen.total | precioCop }} ·
              @if (pedido()!.saldo > 0) { faltan {{ pedido()!.saldo | precioCop }} } @else { cuenta saldada }
            </p>
          }
          @if (pedido()!.estadoPago === 'PENDIENTE') {
            <p class="mt-3 text-xs text-brasa-muted">Si el banco aún está procesando el pago, este estado se actualizará solo en unos minutos.</p>
          }
          <div class="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <a [routerLink]="['/pedido', pedido()!.id]" class="rounded-xl bg-brasa-orange px-6 py-3 text-sm font-semibold text-white">Ver mi pedido</a>
            @if (pedido()!.saldo > 0) {
              <a [routerLink]="['/pagar', pedido()!.id]" class="rounded-xl border border-brasa-border px-6 py-3 text-sm font-semibold">Pagar saldo</a>
            }
          </div>
        </div>
      } @else {
        <p class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{{ error() || 'No encontramos el pago.' }}</p>
      }
    </section>
  `,
})
export class PagoResultadoComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly pedidos = inject(PedidosService);

  /** Parámetros de la URL de retorno: ?pedido=...&id=<transacción de Wompi>. */
  readonly pedidoId = input<string>('', { alias: 'pedido' });
  readonly id = input<string>('');

  protected readonly verificando = signal(true);
  protected readonly pedido = signal<Pedido | null>(null);
  protected readonly error = signal('');
  protected readonly etiquetas = ETIQUETA_ESTADO_PAGO;
  protected readonly pagos = signal<Pago[]>([]);
  protected readonly detalle = signal<DetallePago | null>(null);

  /** El monto y el estado vienen del servidor; el detalle de productos es solo contexto local. */
  protected readonly pagoReciente = computed(() => {
    const referencia = this.detalle()?.referencia;
    return referencia ? this.pagos().find((p) => p.referencia === referencia) ?? null : null;
  });

  async ngOnInit(): Promise<void> {
    const id = this.pedidoId();
    if (id) {
      this.detalle.set(leerDetallePago(id));
      this.pedidos.pagos(id).then((lista) => this.pagos.set(lista)).catch(() => undefined);
    }
    try {
      if (!id) throw new Error('Falta el pedido');
      if (this.id()) {
        this.pedido.set(
          await firstValueFrom(
            this.api.post<Pedido>('/pagos/verificar', { pedidoId: this.pedidoId(), transaccionId: this.id() }, this.pedidos.cabeceras(this.pedidoId())),
          ),
        );
      } else {
        this.pedido.set(await this.pedidos.cargar(this.pedidoId()));
      }
    } catch (e) {
      this.error.set(mensajeError(e, 'No pudimos confirmar el pago. Revisa el estado en tu pedido.'));
    } finally {
      this.verificando.set(false);
    }
  }
}
