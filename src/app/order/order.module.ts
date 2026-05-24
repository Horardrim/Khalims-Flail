import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        loadComponent: () => import('./order.component').then((m) => m.OrderComponent),
        children: [
          { path: '', redirectTo: 'quick-sort', pathMatch: 'full' },
          {
            path: 'quick-sort',
            loadChildren: () => import('./quick-sort/quick-sort.module').then((m) => m.QuickSortModule)
          }
        ]
      }
    ])
  ]
})
export class OrderModule {}
