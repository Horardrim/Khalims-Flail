import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        loadComponent: () => import('./bintree.component').then((m) => m.BintreeComponent)
      }
    ])
  ]
})
export class BintreeModule {}