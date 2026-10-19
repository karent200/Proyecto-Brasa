import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteHeaderComponent } from './shared/components/header/header.component';
import { BotonMeseroComponent } from './shared/components/llamar-mesero-boton/llamar-mesero-boton.component';
import { LlamarMeseroComponent } from './shared/components/llamar-mesero/llamar-mesero.component';
import { CambiarMesaComponent } from './shared/components/cambiar-mesa/cambiar-mesa.component';
import { NotificacionesComponent } from './shared/components/notificaciones/notificaciones.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SiteHeaderComponent,
    BotonMeseroComponent,
    LlamarMeseroComponent,
    CambiarMesaComponent,
    NotificacionesComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
