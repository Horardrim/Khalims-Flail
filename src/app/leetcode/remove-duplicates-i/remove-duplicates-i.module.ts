import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        loadComponent: () => import('./remove-duplicates-i.component').then((m) => m.RemoveDuplicatesIComponent)
      }
    ])
  ]
})
export class RemoveDuplicatesIModule {}