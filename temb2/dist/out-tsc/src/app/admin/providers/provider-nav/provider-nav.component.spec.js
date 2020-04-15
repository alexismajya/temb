import { async, TestBed } from '@angular/core/testing';
import { ProviderNavComponent } from './provider-nav.component';
import { AppEventService } from '../../../shared/app-events.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
var ActivatedRouteMock = {
    params: { subscribe: jest.fn() }
};
describe('ProviderNavComponent', function () {
    var component;
    var fixture;
    var appEventService = new AppEventService();
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [ProviderNavComponent],
            providers: [
                { provide: ActivatedRoute, useValue: ActivatedRouteMock },
                { provide: AppEventService, useValue: appEventService }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(ProviderNavComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
    describe('tabChanged', function () {
        it('should change to Drivers tab on click', function () {
            var expected = {
                'name': 'updateHeaderTitle',
                'content': {
                    'actionButton': 'Add Driver',
                    'headerTitle': 'Andela Kenya Drivers',
                    'badgeSize': 5
                }
            };
            var event = { tab: { textLabel: 'Drivers' } };
            jest.spyOn(appEventService, 'broadcast');
            component.data = {
                providerDrivers: {
                    providerName: 'Andela Kenya',
                    totalItems: 5
                }
            };
            component.tabChanged(event);
            expect(appEventService.broadcast).toHaveBeenCalledWith(expected);
        });
        it('should change to Vehicles tab on click', function () {
            var expected = {
                'name': 'updateHeaderTitle',
                'content': {
                    'actionButton': 'Add a New Vehicle',
                    'badgeSize': 10,
                    'headerTitle': 'Andela Kenya Vehicles',
                }
            };
            var event = { tab: { textLabel: 'Vehicles' } };
            jest.spyOn(appEventService, 'broadcast');
            component.data = {
                providerVehicles: {
                    providerName: 'Andela Kenya',
                    totalItems: 10
                }
            };
            component.tabChanged(event);
            expect(appEventService.broadcast).toHaveBeenCalledWith(expected);
        });
    });
});
//# sourceMappingURL=provider-nav.component.spec.js.map