import { async, TestBed } from '@angular/core/testing';
import { TripBarChartComponent } from './trip-bar-chart.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
describe('TripBarChartComponent', function () {
    var component;
    var fixture;
    var debugElement;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [TripBarChartComponent],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(TripBarChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        debugElement = fixture.debugElement;
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
    it('should use custom tooltip labels for total trip cost', function () {
        var tooltipItem = [{ index: 1, xLabel: 'TDD' }];
        component.tripCost = [2000, 1500];
        var tooltipFooter = component.barChartOptions.tooltips.callbacks.beforeBody;
        var customLabel = tooltipFooter(tooltipItem, {});
        expect(customLabel).toEqual('$1500');
    });
    it('should use custom tooltip labels for total trip', function () {
        var tooltipItem = [{ index: 1, xLabel: 'TDD', value: '1', yLabel: '1' }];
        component.tripCost = [2000, 1500];
        var tooltipFooter = component.barChartOptions.tooltips.callbacks.title;
        var customLabel = tooltipFooter(tooltipItem, {});
        expect(customLabel).toEqual('1 trip');
    });
    it('should use custom tooltip title for total trip', function () {
        var tooltipItem = [{ datasetIndex: 0, index: 1, xLabel: 'TDD', value: '1', yLabel: '1' }];
        component.tripCost = [2000, 1500];
        var tooltipFooter = component.barChartOptions.tooltips.callbacks.title;
        var customLabel = tooltipFooter(tooltipItem, {});
        expect(customLabel).toEqual('');
    });
    it('should use custom tooltip labels for total trip', function () {
        var tooltipItem = [{ index: 1, xLabel: 'TDD', value: '2', yLabel: '2' }];
        component.tripCost = [2000, 1500];
        var tooltipFooter = component.barChartOptions.tooltips.callbacks.title;
        var customLabel = tooltipFooter(tooltipItem, {});
        expect(customLabel).toEqual('2 trips');
    });
    it('should use custom tooltip labels', function () {
        var tooltipItem = { index: 1, xLabel: 'People' };
        component.tripCost = [2000, 1500];
        var tooltipFooter = component.barChartOptions.tooltips.callbacks.label;
        var customLabel = tooltipFooter(tooltipItem, {});
        expect(customLabel).toEqual('');
    });
});
//# sourceMappingURL=trip-bar-chart.component.spec.js.map