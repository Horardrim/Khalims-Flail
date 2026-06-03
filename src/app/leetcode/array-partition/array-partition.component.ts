import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HighchartsChartComponent } from 'highcharts-angular';
import Highcharts from 'highcharts';

interface PartitionStep {
  array: number[];
  low: number;
  mid: number;
  high: number;
  action: string;
}

@Component({
  selector: 'app-array-partition',
  standalone: true,
  imports: [CommonModule, FormsModule, HighchartsChartComponent],
  templateUrl: './array-partition.component.html',
  styleUrls: ['./array-partition.component.css']
})
export class ArrayPartitionComponent {
  Highcharts = Highcharts;
  inputValue = '7,12,5,7,8,3,1,4,2';
  pivotValue = '7';
  originalArray: number[] = [];
  steps: PartitionStep[] = [];
  currentStep = 0;
  errorMessage = '';

  chartOptions: Highcharts.Options = {
    chart: {
      type: 'column'
    },
    title: {
      text: '数组分区柱状图'
    },
    xAxis: {
      categories: []
    },
    yAxis: {
      title: {
        text: '数值'
      }
    },
    tooltip: {
      formatter() {
        return `<b>值: ${this.y}</b><br/>索引: ${this.category}`;
      }
    },
    plotOptions: {
      column: {
        borderRadius: 4,
        dataLabels: {
          enabled: true
        }
      }
    },
    series: [
      {
        type: 'column',
        name: '元素',
        data: []
      }
    ]
  };

  constructor() {
    this.updateChart();
  }

  get currentSnapshot(): PartitionStep | null {
    return this.steps[this.currentStep] ?? null;
  }

  get isCompleted(): boolean {
    return this.steps.length > 0 && this.currentStep >= this.steps.length - 1;
  }

  get stepLabel(): string {
    if (!this.currentSnapshot) {
      return '请先输入数组和目标值，然后点击“开始分区”。';
    }
    return `步骤 ${this.currentStep + 1}/${this.steps.length}：${this.currentSnapshot.action}`;
  }

  get segmentSummary(): string {
    if (!this.currentSnapshot) {
      return '';
    }
    const { array, low, mid, high } = this.currentSnapshot;
    const lessCount = low;
    const equalCount = Math.max(0, mid - low);
    const greaterCount = array.length - Math.max(high + 1, 0);
    return `小于区间 ${lessCount} 个，等于区间 ${equalCount} 个，大于区间 ${greaterCount} 个`;
  }

  parseArray(value: string): number[] {
    return value
      .split(/[\s,]+/)
      .filter((item) => item.length > 0)
      .map((item) => Number(item.trim()));
  }

  runPartition(): void {
    const numbers = this.parseArray(this.inputValue);
    this.errorMessage = '';
    const pivot = Number(this.pivotValue.trim());

    if (numbers.length === 0) {
      this.errorMessage = '请输入至少一个数字。';
      return;
    }
    if (Number.isNaN(pivot)) {
      this.errorMessage = '目标值 X 必须是有效数字。';
      return;
    }
    if (numbers.some((num) => Number.isNaN(num))) {
      this.errorMessage = '输入包含非法数字，请用逗号或空格分隔。';
      return;
    }

    this.originalArray = [...numbers];
    this.steps = this.buildPartitionSteps(numbers, pivot);
    this.currentStep = 0;
    this.updateChart();
  }

  prevStep(): void {
    if (this.currentStep > 0) {
      this.currentStep -= 1;
      this.updateChart();
    }
  }

  nextStep(): void {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep += 1;
      this.updateChart();
    }
  }

  private buildPartitionSteps(input: number[], pivot: number): PartitionStep[] {
    const arr = [...input];
    const steps: PartitionStep[] = [];
    let low = 0;
    let mid = 0;
    let high = arr.length - 1;

    const pushStep = (action: string): void => {
      steps.push({
        array: [...arr],
        low,
        mid,
        high,
        action
      });
    };

    pushStep('初始化状态');

    while (mid <= high) {
      if (arr[mid] < pivot) {
        [arr[low], arr[mid]] = [arr[mid], arr[low]];
        pushStep(`arr[mid] < ${pivot}，交换位置 ${low} 和 ${mid}`);
        low += 1;
        mid += 1;
      } else if (arr[mid] === pivot) {
        pushStep(`arr[mid] == ${pivot}，mid 向右移动`);
        mid += 1;
      } else {
        [arr[mid], arr[high]] = [arr[high], arr[mid]];
        pushStep(`arr[mid] > ${pivot}，交换位置 ${mid} 和 ${high}`);
        high -= 1;
      }
    }

    pushStep('分区完成');
    return steps;
  }

  private updateChart(): void {
    const snapshot = this.currentSnapshot;
    if (!snapshot) {
      this.chartOptions = {
        ...this.chartOptions,
        xAxis: {
          categories: []
        },
        series: [
          {
            type: 'column',
            name: '元素',
            data: []
          }
        ]
      };
      return;
    }

    const seriesData = snapshot.array.map((value, index) => {
      let color = '#90a4ae';
      if (index < snapshot.low) {
        color = '#66bb6a';
      } else if (index <= snapshot.high && index >= snapshot.low && index < snapshot.mid) {
        color = '#ffa726';
      } else if (index > snapshot.high) {
        color = '#ef5350';
      }
      if (index === snapshot.mid && snapshot.mid <= snapshot.high) {
        color = '#1976d2';
      }
      return { y: value, color };
    });

    this.chartOptions = {
      ...this.chartOptions,
      xAxis: {
        categories: snapshot.array.map((_, index) => `索引 ${index}`)
      },
      series: [
        {
          type: 'column',
          name: '元素',
          data: seriesData
        }
      ]
    };
  }
}
