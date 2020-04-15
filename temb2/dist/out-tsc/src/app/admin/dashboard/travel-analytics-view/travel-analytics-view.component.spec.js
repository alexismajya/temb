import { async, TestBed } from '@angular/core/testing';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { TravelAnalyticsViewComponent } from './travel-analytics-view.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
describe('AirportTransfersViewComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [TravelAnalyticsViewComponent],
            imports: [AngularMaterialModule],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(TravelAnalyticsViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=travel-analytics-view.component.spec.js.map