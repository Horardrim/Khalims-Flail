import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';

interface SortStep {
  array: number[];
  pivotIndex: number | null;
  leftIndex: number | null;
  rightIndex: number | null;
  description: string;
}

import { FormsModule } from '@angular/forms';
import { HighchartsChartDirective } from 'highcharts-angular';

@Component({
  selector: 'app-quick-sort',
  standalone: true,
  imports: [FormsModule, HighchartsChartDirective],
  templateUrl: './quick-sort.component.html',
  styleUrls: ['./quick-sort.component.css']
})
export class QuickSortComponent {
  chartOptions: Highcharts.Options = this.buildChartOptions([]);

  array: number[] = [];
  size = 12;
  speed = 350;
  steps: SortStep[] = [];
  currentStep = 0;
  isRunning = false;
  stepDescription = '';

  constructor() {
    this.generateArray();
  }

  generateArray(): void {
    this.isRunning = false;
    this.currentStep = 0;
    this.steps = [];
    this.array = Array.from({ length: this.size }, () => Math.floor(Math.random() * 80) + 10);
    this.chartOptions = this.buildChartOptions(this.array);
    this.stepDescription = '已生成随机数组。';
  }

  startSort(): void {
    if (this.isRunning) {
      return;
    }

    this.steps = [];
    const workingArray = [...this.array];
    this.recordStep(workingArray, null, null, null, '准备开始快速排序。');
    this.quickSort(workingArray, 0, workingArray.length - 1);
    this.currentStep = 0;
    this.isRunning = true;
    this.playNextStep();
  }

  private quickSort(array: number[], left: number, right: number): void {
    if (left >= right) {
      return;
    }

    const pivotIndex = right;
    const pivot = array[pivotIndex];
    let storeIndex = left;

    this.recordStep([...array], pivotIndex, left, right, `选择枢轴值 ${pivot} (位置 ${pivotIndex})`);

    for (let j = left; j < right; j++) {
      this.recordStep([...array], pivotIndex, storeIndex, j, `比较元素 ${array[j]} 与枢轴 ${pivot}`);
      if (array[j] < pivot) {
        [array[storeIndex], array[j]] = [array[j], array[storeIndex]];
        this.recordStep([...array], pivotIndex, storeIndex, j, `交换位置 ${storeIndex} 与 ${j}`);
        storeIndex++;
      }
    }

    [array[storeIndex], array[right]] = [array[right], array[storeIndex]];
    this.recordStep([...array], storeIndex, left, right, `将枢轴放到位置 ${storeIndex}`);

    this.quickSort(array, left, storeIndex - 1);
    this.quickSort(array, storeIndex + 1, right);
  }

  private recordStep(array: number[], pivotIndex: number | null, leftIndex: number | null, rightIndex: number | null, description: string): void {
    this.steps.push({ array, pivotIndex, leftIndex, rightIndex, description });
  }

  private playNextStep(): void {
    if (this.currentStep >= this.steps.length) {
      this.isRunning = false;
      this.stepDescription = '排序完成。';
      return;
    }

    const step = this.steps[this.currentStep];
    this.chartOptions = this.buildChartOptions(step.array, step.pivotIndex, step.leftIndex, step.rightIndex);
    this.stepDescription = step.description;
    this.currentStep++;

    setTimeout(() => this.playNextStep(), this.speed);
  }

  private buildChartOptions(
    values: number[],
    pivotIndex: number | null = null,
    leftIndex: number | null = null,
    rightIndex: number | null = null
  ): Highcharts.Options {
    const seriesData = values.map((value, index) => {
      let color = '#7cb5ec';
      if (index === pivotIndex) {
        color = '#f45b5b';
      } else if (index === leftIndex) {
        color = '#90ed7d';
      } else if (index === rightIndex) {
        color = '#ffb347';
      }
      return { y: value, color };
    });

    return {
      chart: {
        type: 'column',
        height: 420
      },
      title: {
        text: '快速排序可视化'
      },
      xAxis: {
        categories: values.map((_, index) => index.toString()),
        title: { text: '索引' }
      },
      yAxis: {
        title: { text: '值' },
        min: 0
      },
      tooltip: {
        pointFormat: '<b>{point.y}</b>'
      },
      plotOptions: {
        column: {
          borderRadius: 5,
          pointPadding: 0.1,
          groupPadding: 0.1
        }
      },
      series: [
        {
          type: 'column',
          name: '数组值',
          data: seriesData,
          showInLegend: false
        }
      ]
    };
  }
}
