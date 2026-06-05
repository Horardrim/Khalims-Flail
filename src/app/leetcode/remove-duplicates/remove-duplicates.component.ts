import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HighchartsChartComponent } from 'highcharts-angular';
import Highcharts from 'highcharts';

interface RemoveDuplicateStep {
  array: number[];
  slow: number;
  fast: number;
  count: number;
  action: string;
  removed?: number[];
}

@Component({
  selector: 'app-remove-duplicates',
  standalone: true,
  imports: [CommonModule, FormsModule, HighchartsChartComponent],
  templateUrl: './remove-duplicates.component.html',
  styleUrls: ['./remove-duplicates.component.css']
})
export class RemoveDuplicatesComponent {
  Highcharts = Highcharts;
  inputValue = '1,1,1,2,2,3';
  originalArray: number[] = [];
  steps: RemoveDuplicateStep[] = [];
  currentStep = 0;
  errorMessage = '';

  chartOptions: Highcharts.Options = {
    chart: {
      type: 'column'
    },
    title: {
      text: '删除重复项 II 可视化'
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

  get currentSnapshot(): RemoveDuplicateStep | null {
    return this.steps[this.currentStep] ?? null;
  }

  get isCompleted(): boolean {
    return this.steps.length > 0 && this.currentStep >= this.steps.length - 1;
  }

  get stepLabel(): string {
    if (!this.currentSnapshot) {
      return '请先输入有序数组，然后点击“开始去重”。';
    }
    return `步骤 ${this.currentStep + 1}/${this.steps.length}：${this.currentSnapshot.action}`;
  }

  get resultLength(): number {
    if (!this.isCompleted || !this.currentSnapshot) {
      return 0;
    }
    return this.currentSnapshot.slow;
  }

  parseArray(value: string): number[] {
    return value
      .split(/[\s,]+/)
      .filter((item) => item.length > 0)
      .map((item) => Number(item.trim()));
  }

  runRemoveDuplicates(): void {
    const numbers = this.parseArray(this.inputValue);
    this.errorMessage = '';

    if (numbers.length === 0) {
      this.errorMessage = '请输入至少一个数字。';
      return;
    }
    if (numbers.some((num) => Number.isNaN(num))) {
      this.errorMessage = '输入包含非法数字，请用逗号或空格分隔。';
      return;
    }

    const sortedNumbers = [...numbers].sort((a, b) => a - b);
    this.originalArray = [...sortedNumbers];
    this.steps = this.buildRemoveDuplicateSteps(sortedNumbers);
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

  private buildRemoveDuplicateSteps(input: number[]): RemoveDuplicateStep[] {
    const arr = [...input];
    const steps: RemoveDuplicateStep[] = [];
    const removed: number[] = [];
    
    if (arr.length <= 2) {
      steps.push({
        array: [...arr],
        slow: arr.length - 1,
        fast: arr.length - 1,
        count: arr.length,
        action: '数组长度小于等于2，无需去重',
        removed: []
      });
      return steps;
    }

    let slow = 2;

    const pushStep = (action: string, currentFast: number, isRemoved: boolean = false): void => {
      steps.push({
        array: [...arr],
        slow,
        fast: currentFast,
        count: slow,
        action,
        removed: isRemoved ? [...removed] : undefined
      });
    };

    pushStep('初始化：slow=2，前两个元素默认保留', 2);

    for (let fast = 2; fast < arr.length; fast++) {
      if (arr[fast] !== arr[slow - 2]) {
        if (slow !== fast) {
          arr[slow] = arr[fast];
        }
        pushStep(`nums[fast]=${arr[fast]} != nums[slow-2]=${arr[slow-2]}，保留该元素，slow++`, fast);
        slow++;
      } else {
        removed.push(arr[fast]);
        pushStep(`nums[fast]=${arr[fast]} == nums[slow-2]=${arr[slow-2]}，与前面两个元素重复，跳过该重复项`, fast, true);
      }
    }

    pushStep(`去重完成！新数组长度为 ${slow}，共移除 ${removed.length} 个重复项`, arr.length - 1, true);
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
      let label = '';
      if (index < snapshot.slow) {
        color = '#66bb6a';
      }
      if (index === snapshot.fast) {
        color = '#1976d2';
        label = 'fast';
      }
      if (index === snapshot.slow) {
        if (index !== snapshot.fast) {
          color = '#90a4ae';
        }
        label = label ? `${label},slow` : 'slow';
      }
      if (this.isCompleted && index >= snapshot.slow) {
        color = '#ef5350';
        label = '';
      }
      return { y: value, color, dataLabels: { enabled: label !== '', format: label } };
    });

    this.chartOptions = {
      ...this.chartOptions,
      title: {
        text: `删除重复项 II 可视化 (slow=${snapshot.slow}, fast=${snapshot.fast})`
      },
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