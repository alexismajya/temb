import { async, TestBed } from '@angular/core/testing';
import { RiderListComponent } from './rider-list.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
describe('RiderListComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [RiderListComponent],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(RiderListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=rider-list.component.spec.js.map