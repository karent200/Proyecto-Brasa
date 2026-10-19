import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideMinus, LucidePlus, LucideShoppingCart, LucideTrash2 } from '@lucide/angular';
import { CarritoService } from '../../../core/services/carrito.service';
import { ItemCarrito } from '../../../models/carrito.model';
import { PrecioCopPipe } from '../../pipes/precio-cop.pipe';

@Component({
  selector: 'app-carrito-panel',
  imports: [RouterLink, PrecioCopPipe, LucidePlus, LucideMinus, LucideTrash2, LucideShoppingCart],
  template: `
    <aside
      class="flex flex-col overflow-hidden rounded-2xl border border-brasa-border bg-white shadow-card"
      aria-label="Resumen del carrito"
    >
      <header class="flex items-center justify-between border-b border-brasa-border px-5 py-4">
        <h2 class="flex items-center gap-2 font-heading text-base font-semibold text-brasa-black">
          <svg lucideShoppingCart [size]="18" class="text-brasa-orange"></svg>
          Tu pedido
        </h2>
        @if (!carrito.estaVacio()) {
          <span class="text-sm text-brasa-muted">{{ carrito.cantidadTotal() }} ítems</span>
        }
      </header>

      @if (carrito.estaVacio()) {
        <div class="flex flex-col items-center gap-3 px-6 py-12 text-center">
          <span class="flex h-14 w-14 items-center justify-center rounded-full bg-brasa-gray-light text-brasa-muted">
            <svg lucideShoppingCart [size]="26"></svg>
          </span>
          <p class="font-heading text-sm font-semibold text-brasa-black">Tu carrito está vacío</p>
          <p class="text-xs text-brasa-muted">Agrega productos del menú para empezar tu pedido.</p>
        </div>
      } @else {
        <ul class="max-h-[42vh] divide-y divide-brasa-border overflow-y-auto">
          @for (item of carrito.lineas(); track item.id) {
            <li class="flex gap-3 px-5 py-4">
              <img
                [src]="item.imagenUrl"
                [alt]="item.nombre"
                width="64"
                height="64"
                class="h-16 w-16 shrink-0 rounded-xl border border-brasa-border bg-brasa-gray-light object-cover"
              />
              <div class="flex min-w-0 flex-1 flex-col">
                <div class="flex items-start justify-between gap-2">
                  <p class="truncate text-sm font-semibold text-brasa-black">{{ item.nombre }}</p>
                  <button
                    type="button"
                    class="rounded p-1 text-brasa-muted transition hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brasa-orange"
                    [attr.aria-label]="'Quitar ' + item.nombre"
                    (click)="carrito.eliminar(item.id)"
                  >
                    <svg lucideTrash2 [size]="15"></svg>
                  </button>
                </div>

                @if (descripcionPersonalizacion(item); as detalle) {
                  <p class="mt-0.5 line-clamp-2 text-xs text-brasa-muted">{{ detalle }}</p>
                }

                <div class="mt-2 flex items-center justify-between">
                  <div class="inline-flex items-center rounded-lg border border-brasa-border">
                    <button
                      type="button"
                      class="p-1.5 text-brasa-black transition hover:text-brasa-orange focus:outline-none focus-visible:ring-2 focus-visible:ring-brasa-orange"
                      [attr.aria-label]="'Reducir cantidad de ' + item.nombre"
                      (click)="carrito.reducir(item.id)"
                    >
                      <svg lucideMinus [size]="14"></svg>
                    </button>
                    <span class="min-w-7 text-center text-sm font-semibold" aria-live="polite">
                      {{ item.cantidad }}
                    </span>
                    <button
                      type="button"
                      class="p-1.5 text-brasa-black transition hover:text-brasa-orange focus:outline-none focus-visible:ring-2 focus-visible:ring-brasa-orange"
                      [attr.aria-label]="'Aumentar cantidad de ' + item.nombre"
                      (click)="carrito.incrementar(item.id)"
                    >
                      <svg lucidePlus [size]="14"></svg>
                    </button>
                  </div>
                  <span class="text-sm font-semibold text-brasa-black">
                    {{ item.precioUnitario * item.cantidad | precioCop }}
                  </span>
                </div>
              </div>
            </li>
          }
        </ul>

        <div class="space-y-3 border-t border-brasa-border p-5">
          <div class="flex items-center justify-between text-sm">
            <span class="text-brasa-muted">Subtotal</span>
            <span class="font-semibold text-brasa-black">{{ carrito.subtotal() | precioCop }}</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-brasa-muted">Impuestos</span>
            <span class="font-semibold text-brasa-black">{{ carrito.impuestos() | precioCop }}</span>
          </div>
          <div
            class="flex items-center justify-between border-t border-dashed border-brasa-border pt-3"
          >
            <span class="font-heading text-base font-semibold text-brasa-black">Total</span>
            <span class="font-heading text-xl font-bold text-brasa-orange">
              {{ carrito.total() | precioCop }}
            </span>
          </div>

          <a
            routerLink="/carrito"
            class="flex w-full items-center justify-center gap-2 rounded-xl bg-brasa-orange px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-brasa-orange-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brasa-orange focus-visible:ring-offset-2"
          >
            Ver carrito y enviar
          </a>
        </div>
      }
    </aside>
  `,
})
export class CarritoPanelComponent {
  protected readonly carrito = inject(CarritoService);

  protected descripcionPersonalizacion(item: ItemCarrito): string {
    const { tamano, extras, retirados } = item.personalizacion;
    const partes: string[] = [];
    if (tamano) {
      partes.push(tamano.nombre);
    }
    if (extras.length > 0) {
      partes.push(extras.map((e) => e.nombre).join(', '));
    }
    if (retirados.length > 0) {
      partes.push(`Sin ${retirados.join(', ').toLowerCase()}`);
    }
    return partes.join(' · ');
  }
}
