/**
 * Detalle del pago que este navegador acaba de iniciar. El servidor es la fuente de la
 * verdad para el monto y el estado; aquí solo guardamos el contexto que la pasarela no
 * devuelve (qué productos marcó el cliente al pagar "Por lo que consumí").
 */
export interface DetallePago {
  referencia: string;
  monto: number;
  productos: string[];
}

const clave = (pedidoId: string) => `brasa.detalle-pago.${pedidoId}`;

export function guardarDetallePago(pedidoId: string, detalle: DetallePago): void {
  try {
    sessionStorage.setItem(clave(pedidoId), JSON.stringify(detalle));
  } catch {
    // Navegación privada o almacenamiento bloqueado: el recibo sigue funcionando sin este detalle.
  }
}

export function leerDetallePago(pedidoId: string): DetallePago | null {
  try {
    const texto = sessionStorage.getItem(clave(pedidoId));
    return texto ? (JSON.parse(texto) as DetallePago) : null;
  } catch {
    return null;
  }
}
