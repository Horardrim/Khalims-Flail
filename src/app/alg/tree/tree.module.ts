import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        loadComponent: () => import('./tree.component').then((m) => m.TreeComponent),
        children: [
          { path: '', redirectTo: 'bintree', pathMatch: 'full' },
          {
            path: 'bintree',
            loadChildren: () => import('./bintree/bintree.module').then((m) => m.BintreeModule)
          },
          {
            path: 'bptree',
            loadChildren: () => import('./bptree/bptree.module').then((m) => m.BptreeModule)
          }
        ]
      }
    ])
  ]
})
export class TreeModule {}