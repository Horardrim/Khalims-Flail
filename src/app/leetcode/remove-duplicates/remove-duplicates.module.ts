import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        loadComponent: () => import('./remove-duplicates.component').then((m) => m.RemoveDuplicatesComponent)
      }
    ])
  ]
})
export class RemoveDuplicatesModule {}