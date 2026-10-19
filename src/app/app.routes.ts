import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
    title: 'BRASA - Cocina de Barrio',
  },
  {
    path: 'menu',
    loadComponent: () =>
      import('./features/menu/menu.component').then((m) => m.MenuComponent),
    title: 'Menú - BRASA',
  },
  {
    path: 'carrito',
    loadComponent: () =>
      import('./features/cart/carrito.component').then((m) => m.CarritoComponent),
    title: 'Mi Carrito - BRASA',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
