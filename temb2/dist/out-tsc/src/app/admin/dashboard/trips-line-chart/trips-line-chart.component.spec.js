import { async, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TripsLineChartComponent } from './trips-line-chart.component';
describe('TripsLineChartComponent', function () {
    var component;
    var fixture;
    var debugElement;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [TripsLineChartComponent],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(TripsLineChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        debugElement = fixture.debugElement;
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
    it('should set tooltip color block display to false, if not provided', function () {
        var tooltip = { displayColors: true };
        component.chartOptions.tooltips.custom(null);
        expect(tooltip.displayColors).toBeTruthy();
    });
    it('should set tooltip color block display to false, if provided', function () {
        var tooltip = { displayColors: true };
        component.chartOptions.tooltips.custom(tooltip);
        expect(tooltip.displayColors).toBeTruthy();
    });
    it('should use custom tooltip labels', function () {
        var tooltipItem = { yLabel: 'TDD' };
        var tooltipLabel = component.chartOptions.tooltips.callbacks.label;
        var customLabel = tooltipLabel(tooltipItem);
        expect(customLabel).toEqual('TDD Trip(s)');
    });
    it('should use custom tooltip labels for total cost', function () {
        var tooltipItem = [{ index: 1, yLabel: 'TDD', datasetIndex: 0 }];
        var data = {
            datasets: [{ tripsCost: [2000, 1500] }],
        };
        var tooltipFooter = component.chartOptions.tooltips.callbacks.footer;
        var customLabel = tooltipFooter(tooltipItem, data);
        expect(customLabel).toEqual('Ksh 1500');
    });
});
//# sourceMappingURL=trips-line-chart.component.spec.js.map