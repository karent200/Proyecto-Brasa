import { Injectable, computed, signal } from '@angular/core';
import { Categoria, EtiquetaProducto, Producto } from '../../models/producto.model';
import { CATEGORIAS, PRODUCTOS } from '../data/productos.data';

export interface FiltrosMenu {
  categoria: string;
  busqueda: string;
  etiquetas: EtiquetaProducto[];
}

const FILTROS_INICIALES: FiltrosMenu = {
  categoria: 'populares',
  busqueda: '',
  etiquetas: [],
};

@Injectable({ providedIn: 'root' })
export class ProductosService {
  /**
   * Fuente de datos en memoria. Cuando se integre la API REST, reemplazar por
   * una petición HTTP manteniendo la misma forma de los datos.
   */
  private readonly productos = signal<Producto[]>(PRODUCTOS);
  private readonly filtros = signal<FiltrosMenu>(FILTROS_INICIALES);

  readonly categorias: Categoria[] = CATEGORIAS;
  readonly cargando = signal(false);
  readonly error = signal('');

  readonly lista = this.productos.asReadonly();
  readonly estadoFiltros = this.filtros.asReadonly();

  /** Productos que coinciden con la búsqueda y los filtros, limitados a la categoría activa. */
  readonly productosFiltrados = computed<Producto[]>(() => {
    const { categoria, busqueda, etiquetas } = this.filtros();
    const termino = busqueda.trim().toLowerCase();

    return this.productos().filter((producto) => {
      const coincideCategoria =
        categoria === 'populares'
          ? producto.etiquetas.includes('mas-vendido')
          : producto.categoria === categoria || etiquetas.length > 0;

      const coincideBusqueda =
        termino.length === 0 ||
        producto.nombre.toLowerCase().includes(termino) ||
        producto.descripcion.toLowerCase().includes(termino) ||
        producto.ingredientes.some((ing) => ing.toLowerCase().includes(termino));

      const coincideEtiquetas =
        etiquetas.length === 0 || etiquetas.every((etiqueta) => producto.etiquetas.includes(etiqueta));

      return coincideCategoria && coincideBusqueda && coincideEtiquetas;
    });
  });

  obtenerPorId(id: string): Producto | undefined {
    return this.productos().find((producto) => producto.id === id);
  }

  establecerCategoria(categoria: string): void {
    this.filtros.update((actuales) => ({ ...actuales, categoria }));
  }

  establecerBusqueda(busqueda: string): void {
    this.filtros.update((actuales) => ({ ...actuales, busqueda }));
  }

  alternarEtiqueta(etiqueta: EtiquetaProducto): void {
    this.filtros.update((actuales) => {
      const activa = actuales.etiquetas.includes(etiqueta);
      return {
        ...actuales,
        etiquetas: activa
          ? actuales.etiquetas.filter((e) => e !== etiqueta)
          : [...actuales.etiquetas, etiqueta],
      };
    });
  }

  limpiarFiltros(): void {
    this.filtros.set(FILTROS_INICIALES);
  }
}
