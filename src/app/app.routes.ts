import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'order' },
  {
    path: 'order',
    loadChildren: () => import('./order/order.module').then((m) => m.OrderModule)
  }
];
