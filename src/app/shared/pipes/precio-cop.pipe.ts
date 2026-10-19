import { Pipe, PipeTransform } from '@angular/core';
import { CONFIGURACION } from '../../core/config/configuracion';

@Pipe({ name: 'precioCop' })
export class PrecioCopPipe implements PipeTransform {
  private readonly formateador = new Intl.NumberFormat(CONFIGURACION.locale, {
    style: 'currency',
    currency: CONFIGURACION.moneda,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  transform(valor: number): string {
    return this.formateador.format(valor);
  }
}
