import { async, TestBed } from '@angular/core/testing';
import { RiderCardComponent } from './rider-card.component';
import { ShortenTextPipe } from 'src/app/admin/__pipes__/shorten-text.pipe';
describe('RiderCardComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [RiderCardComponent, ShortenTextPipe]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(RiderCardComponent);
        fixture.componentInstance.rider = { name: 'Test User', picture: 'pic', routeName: 'name' };
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=rider-card.component.spec.js.map