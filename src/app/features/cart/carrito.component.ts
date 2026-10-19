import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  LucideArrowLeft,
  LucideMinus,
  LucidePlus,
  LucideShoppingCart,
  LucideTag,
  LucideTrash2,
  LucideMessageSquareText,
  LucideInfo,
} from '@lucide/angular';
import { CarritoService } from '../../core/services/carrito.service';
import { MesaService } from '../../core/services/mesa.service';
import { NotificacionesService } from '../../core/services/notificaciones.service';
import { PedidosService } from '../../core/services/pedidos.service';
import { CONFIGURACION } from '../../core/config/configuracion';
import { ItemCarrito } from '../../models/carrito.model';
import { PrecioCopPipe } from '../../shared/pipes/precio-cop.pipe';
import { ModalComponent } from '../../shared/components/modal/modal.component';