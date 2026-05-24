import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HighchartsChartDirective } from 'highcharts-angular';
import { QuickSortComponent } from './quick-sort.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HighchartsChartDirective,
    QuickSortComponent,
    RouterModule.forChild([{ path: '', component: QuickSortComponent }])
  ]
})
export class QuickSortModule {}
