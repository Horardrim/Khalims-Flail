import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { QuickSortComponent } from './quick-sort.component';
import * as Highcharts from 'highcharts';
import { provideHighcharts } from 'highcharts-angular';

describe('QuickSortComponent', () => {
  let fixture: ComponentFixture<QuickSortComponent>;
  let component: QuickSortComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickSortComponent],
      providers: [
        provideHighcharts({ instance: () => Promise.resolve(Highcharts) }) as any
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuickSortComponent);
    component = fixture.componentInstance;
  });

  it('should create the quick sort component', () => {
    expect(component).toBeTruthy();
  });

  it('generateArray should reset state and populate the array', () => {
    component.size = 5;
    component.steps = [{ array: [1], pivotIndex: null, leftIndex: null, rightIndex: null, description: 'test' }];
    component.isRunning = true;

    component.generateArray();

    expect(component.array.length).toBe(5);
    expect(component.steps).toEqual([]);
    expect(component.isRunning).toBeFalse();
    expect(component.stepDescription).toBe('已生成随机数组。');
  });

  it('startSort should produce sorting steps and eventually finish', fakeAsync(() => {
    component.array = [3, 1, 2];
    component.size = 3;

    component.startSort();

    expect(component.steps.length).toBeGreaterThan(0);
    expect(component.isRunning).toBeTrue();

    tick(5000);

    expect(component.isRunning).toBeFalse();
    expect(component.stepDescription).toBe('排序完成。');
    expect(component.steps[component.steps.length - 1].array).toEqual([1, 2, 3]);
    expect((component.chartOptions.series?.[0] as any).data.length).toBe(3);
  }));
});
