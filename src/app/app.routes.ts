import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'order' },
  {
    path: 'order',
    loadChildren: () => import('./order/order.module').then((m) => m.OrderModule)
  },
  {
    path: 'leetcode',
    loadChildren: () => import('./leetcode/leetcode.module').then((m) => m.LeetcodeModule)
  },
  {
    path: 'alg',
    loadChildren: () => import('./alg/alg.module').then((m) => m.AlgModule)
  }
];