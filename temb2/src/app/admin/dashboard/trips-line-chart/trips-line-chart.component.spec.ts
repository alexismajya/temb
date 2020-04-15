import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TripsLineChartComponent } from './trips-line-chart.component';

describe('TripsLineChartComponent', () => {
  let component: TripsLineChartComponent;
  let fixture: ComponentFixture<TripsLineChartComponent>;
  let debugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripsLineChartComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripsLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    debugElement = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should set tooltip color block display to false, if not provided', () => {
    const tooltip = { displayColors: true };
    component.chartOptions.tooltips.custom(null);
    expect(tooltip.displayColors).toBeTruthy();
  });
  it('should set tooltip color block display to false, if provided', () => {
    const tooltip = { displayColors: true };
    component.chartOptions.tooltips.custom(tooltip);
    expect(tooltip.displayColors).toBeTruthy();
  });
  it('should use custom tooltip labels', () => {
    const tooltipItem = { yLabel: 'TDD' };
    const tooltipLabel = component.chartOptions.tooltips.callbacks.label;
    const customLabel = tooltipLabel(tooltipItem);
    expect(customLabel).toEqual('TDD Trip(s)');
  });
  it('should use custom tooltip labels for total cost', () => {
    const tooltipItem = [{ index: 1, yLabel: 'TDD', datasetIndex: 0 }];
    const data = {
      datasets: [{ tripsCost: [2000, 1500] }],
    };
    const tooltipFooter = component.chartOptions.tooltips.callbacks.footer;
    const customLabel = tooltipFooter(tooltipItem, data);
    expect(customLabel).toEqual('Ksh 1500');
  });
});
