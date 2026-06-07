import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        loadComponent: () => import('./bptree.component').then((m) => m.BptreeComponent)
      }
    ])
  ]
})
export class BptreeModule {}