import { Component, input, output } from '@angular/core';
import { LucideFlame, LucideLeaf, LucidePlus, LucideWheatOff } from '@lucide/angular';
import { Producto } from '../../../models/producto.model';
import { PrecioCopPipe } from '../../pipes/precio-cop.pipe';

@Component({
  selector: 'app-producto-card',
  imports: [PrecioCopPipe, LucidePlus, LucideLeaf, LucideWheatOff, LucideFlame],
  template: `
    <article
      class="group flex h-full flex-col overflow-hidden rounded-2xl border border-brasa-border bg-white shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-soft"
    >
      <div class="relative aspect-[4/3] overflow-hidden bg-brasa-gray-light">
        <img
          [src]="producto().imagenUrl"
          [alt]="producto().nombre"
          width="600"
          height="480"
          loading="lazy"
          class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />

        @if (producto().etiquetas.length > 0) {
          <div class="absolute left-3 top-3 flex flex-wrap gap-1.5">
            @for (etiqueta of producto().etiquetas; track etiqueta) {
              <span
                class="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-brasa-black shadow-card"
              >
                @switch (etiqueta) {
                  @case ('vegetariano') {
                    <svg lucideLeaf [size]="13" class="text-green-600"></svg>
                    Vegetariano
                  }
                  @case ('sin-gluten') {
                    <svg lucideWheatOff [size]="13" class="text-amber-600"></svg>
                    Sin gluten
                  }
                  @case ('mas-vendido') {
                    <svg lucideFlame [size]="13" class="text-brasa-orange"></svg>
                    Más vendido
                  }
                }
              </span>
            }
          </div>
        }
      </div>

      <div class="flex flex-1 flex-col p-5">
        <h3 class="font-heading text-base font-semibold text-brasa-black">{{ producto().nombre }}</h3>
        <p class="mt-1.5 line-clamp-2 text-sm leading-relaxed text-brasa-muted">
          {{ producto().descripcion }}
        </p>

        <div class="mt-auto flex items-center justify-between gap-3 pt-4">
          <span class="font-heading text-lg font-bold text-brasa-black">
            {{ producto().precio | precioCop }}
          </span>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-xl bg-brasa-orange px-3.5 py-2.5 text-sm font-semibold text-white transition hover:bg-brasa-orange-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brasa-orange focus-visible:ring-offset-2"
            [attr.aria-label]="'Agregar ' + producto().nombre + ' al carrito'"
            (click)="agregar.emit(producto())"
          >
            <svg lucidePlus [size]="16" [strokeWidth]="2.5"></svg>
            Agregar
          </button>
        </div>
      </div>
    </article>
  `,
})
export class ProductoCardComponent {
  readonly producto = input.required<Producto>();
  readonly agregar = output<Producto>();
}
