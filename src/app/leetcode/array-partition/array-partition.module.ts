import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        loadComponent: () => import('./array-partition.component').then((m) => m.ArrayPartitionComponent)
      }
    ])
  ]
})
export class ArrayPartitionModule {}
