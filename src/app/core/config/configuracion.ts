export const CONFIGURACION = {
  /** Impuesto sobre el consumo en Colombia (19%). */
  iva: 0.19,
  propinaSugerida: 0.1,
  moneda: 'COP',
  locale: 'es-CO',
  /** Códigos de cupón válidos y su porcentaje de descuento. */
  cupones: {
    BRASA10: 0.1,
    BARRIO15: 0.15,
  } as Record<string, number>,
};
