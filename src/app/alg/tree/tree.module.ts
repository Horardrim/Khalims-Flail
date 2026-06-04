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
          }
        ]
      }
    ])
  ]
})
export class TreeModule {}