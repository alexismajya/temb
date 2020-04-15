import { async, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { TripPieChartComponent } from './trip-pie-chart.component';
describe('TripPieChartComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [TripPieChartComponent],
            imports: [AngularMaterialModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(TripPieChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
    it('should set validData to false', function () {
        component.ngOnChanges();
        expect(component.validData).toBeFalsy();
    });
    it('should set validData to true', function () {
        component.normalTripCount = 1;
        component.travelTripCount = 1;
        component.ngOnChanges();
        expect(component.validData).toBeTruthy();
        expect(component.incomingData).toEqual([1, 1]);
    });
});
//# sourceMappingURL=trip-pie-chart.component.spec.js.map