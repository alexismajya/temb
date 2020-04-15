import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TripBarChartComponent } from './trip-bar-chart.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TripBarChartComponent', () => {
  let component: TripBarChartComponent;
  let fixture: ComponentFixture<TripBarChartComponent>;
  let debugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TripBarChartComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    debugElement = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use custom tooltip labels for total trip cost', () => {
    const tooltipItem = [{ index: 1, xLabel: 'TDD' }];
    component.tripCost = [2000, 1500];
    const tooltipFooter = component.barChartOptions.tooltips.callbacks.beforeBody;
    const customLabel = tooltipFooter(tooltipItem, {});
    expect(customLabel).toEqual('$1500');
  });

  it('should use custom tooltip labels for total trip', () => {
    const tooltipItem = [{ index: 1, xLabel: 'TDD', value: '1', yLabel: '1' }];
    component.tripCost = [2000, 1500];
    const tooltipFooter = component.barChartOptions.tooltips.callbacks.title;
    const customLabel = tooltipFooter(tooltipItem, {});
    expect(customLabel).toEqual('1 trip');
  });

  it('should use custom tooltip title for total trip', () => {
    const tooltipItem = [{ datasetIndex: 0, index: 1, xLabel: 'TDD', value: '1', yLabel: '1' }];
    component.tripCost = [2000, 1500];
    const tooltipFooter = component.barChartOptions.tooltips.callbacks.title;
    const customLabel = tooltipFooter(tooltipItem, {});
    expect(customLabel).toEqual('');
  });

  it('should use custom tooltip labels for total trip', () => {
    const tooltipItem = [{ index: 1, xLabel: 'TDD', value: '2', yLabel: '2' }];
    component.tripCost = [2000, 1500];
    const tooltipFooter = component.barChartOptions.tooltips.callbacks.title;
    const customLabel = tooltipFooter(tooltipItem, {});
    expect(customLabel).toEqual('2 trips');
  });


  it('should use custom tooltip labels', () => {
    const tooltipItem = { index: 1, xLabel: 'People' };
    component.tripCost = [2000, 1500];
    const tooltipFooter = component.barChartOptions.tooltips.callbacks.label;
    const customLabel = tooltipFooter(tooltipItem, {});
    expect(customLabel).toEqual('');
  });
});
