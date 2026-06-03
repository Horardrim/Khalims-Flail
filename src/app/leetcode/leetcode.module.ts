import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        loadComponent: () => import('./leetcode.component').then((m) => m.LeetcodeComponent),
        children: [
          { path: '', redirectTo: 'array-partition', pathMatch: 'full' },
          {
            path: 'array-partition',
            loadChildren: () => import('./array-partition/array-partition.module').then((m) => m.ArrayPartitionModule)
          }
        ]
      }
    ])
  ]
})
export class LeetcodeModule {}
