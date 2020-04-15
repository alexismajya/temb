import { async, TestBed } from '@angular/core/testing';
import { RatingStarsComponent } from './rating-stars.component';
describe('RatingStarsComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [RatingStarsComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(RatingStarsComponent);
        component = fixture.componentInstance;
        component.rating = 4;
        fixture.detectChanges();
    });
    it('should create component', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=rating-stars.component.spec.js.map