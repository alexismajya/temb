import { async, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AverageTripRatingsComponent } from './average-trip-ratings.component';
describe('AverageTripRatingsComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [AverageTripRatingsComponent],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(AverageTripRatingsComponent);
        component = fixture.componentInstance;
        component.avgRatings = 3.4;
        component.title = 'Average Trip Rating';
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=average-trip-ratings.component.spec.js.map