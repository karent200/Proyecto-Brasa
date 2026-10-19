import { Component, ElementRef, ViewChild, input, output, AfterViewInit, OnDestroy, inject, DOCUMENT } from '@angular/core';

@Component({
  selector: 'app-modal',
  template: `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      [attr.aria-label]="titulo()"
      (keydown.escape)="cerrar.emit()"
    >
      <div
        class="absolute inset-0 bg-brasa-black/40 backdrop-blur-sm animate-fade-in"
        (click)="cerrar.emit()"
        aria-hidden="true"
      ></div>

      <div
        #panel
        tabindex="-1"
        class="relative z-10 w-full overflow-hidden rounded-2xl bg-white shadow-2xl animate-scale-in"
        [class]="anchoClase()"
      >
        @if (titulo()) {
          <header class="flex items-center justify-between border-b border-brasa-border px-6 py-4">
            <h2 class="font-heading text-lg font-semibold text-brasa-black">{{ titulo() }}</h2>
            <button
              type="button"
              class="rounded-full p-2 text-brasa-muted transition hover:bg-brasa-gray-light hover:text-brasa-black focus:outline-none focus-visible:ring-2 focus-visible:ring-brasa-orange"
              (click)="cerrar.emit()"
              aria-label="Cerrar ventana"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </header>
        }

        <div class="max-h-[80vh] overflow-y-auto">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class ModalComponent implements AfterViewInit, OnDestroy {
  private readonly document = inject(DOCUMENT);

  readonly titulo = input('');
  readonly anchoClase = input('max-w-lg');
  readonly cerrar = output<void>();

  @ViewChild('panel') private panel?: ElementRef<HTMLElement>;

  private elementoPrevio: HTMLElement | null = null;

  private readonly alPresionarTecla = (evento: KeyboardEvent) => {
    if (evento.key === 'Escape') {
      this.cerrar.emit();
    }
  };

  ngAfterViewInit(): void {
    this.elementoPrevio = this.document.activeElement as HTMLElement | null;
    this.document.body.style.overflow = 'hidden';
    this.document.addEventListener('keydown', this.alPresionarTecla);
    this.panel?.nativeElement.focus();
  }

  ngOnDestroy(): void {
    this.document.body.style.overflow = '';
    this.document.removeEventListener('keydown', this.alPresionarTecla);
    this.elementoPrevio?.focus();
  }
}
