import { async, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouteRatingsOverviewComponent } from './route-ratings-overview.component';
import { mockRouteRatings } from './ratingsMockData';
import { ShortenTextPipe } from '../../__pipes__/shorten-text.pipe';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler/src/core';
describe('RouteRatingsOverviewComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [ShortenTextPipe, RouteRatingsOverviewComponent],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(RouteRatingsOverviewComponent);
        component = fixture.componentInstance;
        component.ratings = mockRouteRatings;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=route-ratings-overview.component.spec.js.map