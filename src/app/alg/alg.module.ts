import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        loadComponent: () => import('./alg.component').then((m) => m.AlgComponent),
        children: [
          { path: '', redirectTo: 'tree', pathMatch: 'full' },
          {
            path: 'tree',
            loadChildren: () => import('./tree/tree.module').then((m) => m.TreeModule)
          }
        ]
      }
    ])
  ]
})
export class AlgModule {}