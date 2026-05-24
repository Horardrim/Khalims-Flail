import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OrderComponent } from './order.component';

describe('OrderComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderComponent, RouterTestingModule]
    }).compileComponents();
  });

  it('should create the order shell component', () => {
    const fixture = TestBed.createComponent(OrderComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render the order module title and child navigation', () => {
    const fixture = TestBed.createComponent(OrderComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Order 模块');
    expect(compiled.querySelector('a')?.textContent).toContain('快速排序可视化');
  });
});
