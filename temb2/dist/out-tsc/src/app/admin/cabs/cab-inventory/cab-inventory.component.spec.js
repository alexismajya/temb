import { async, TestBed } from '@angular/core/testing';
import { data } from './__mocks__/get-routes-response.mock';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CabInventoryComponent } from './cab-inventory.component';
import { CabsInventoryService } from '../../__services__/cabs-inventory.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { AppEventService } from '../../../shared/app-events.service';
import { BaseInventoryComponent } from '../../base-inventory/base-inventory.component';
var appEventService = new AppEventService();
describe('CabInventoryComponent', function () {
    var component;
    var fixture;
    var activatedRouteMock = {
        params: { subscribe: jest.fn() }
    };
    beforeEach(function () {
        TestBed.configureTestingModule({
            declarations: [
                CabInventoryComponent
            ],
            providers: [
                CabsInventoryService,
                { provide: ActivatedRoute, useValue: activatedRouteMock },
                { provide: AppEventService, useValue: appEventService }
            ],
            imports: [HttpClientTestingModule, AngularMaterialModule, BrowserAnimationsModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
        fixture = TestBed.createComponent(CabInventoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    afterEach(function () {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    it('should create component and render cabs', async(function () {
        expect(component).toBeTruthy();
    }));
    describe('ngOnInit', function () {
        it('should update and load page', (function () {
            component.ngOnInit();
            fixture.detectChanges();
            expect(component.cabs).toEqual([]);
        }));
        it('should subscribe to events ', (function () {
            jest.spyOn(BaseInventoryComponent.prototype, 'getInventory');
            jest.spyOn(appEventService, 'subscribe');
            component.ngOnInit();
            expect(appEventService.subscribe).toBeCalled();
        }));
        it('should call getInventory when there is a new cab ', (function () {
            jest.spyOn(BaseInventoryComponent.prototype, 'getInventory');
            var event = {
                name: 'newCab',
                content: {}
            };
            component.ngOnInit();
            appEventService.broadcast(event);
            expect(BaseInventoryComponent.prototype.getInventory).toBeCalled();
        }));
        it('should call getInventory when a cab is updated', (function () {
            jest.spyOn(BaseInventoryComponent.prototype, 'getInventory');
            var event = {
                name: 'updateCab',
                content: {}
            };
            component.ngOnInit();
            appEventService.broadcast(event);
            expect(BaseInventoryComponent.prototype.getInventory).toBeCalled();
        }));
    });
    describe('setPage', function () {
        it('should update and load page', (function () {
            jest.spyOn(CabsInventoryService.prototype, 'get').mockReturnValue(of(data));
            jest.spyOn(BaseInventoryComponent.prototype, 'emitData');
            component.loadData(2, 1, 'name', 1);
            expect(CabsInventoryService.prototype.get).toHaveBeenCalled();
            expect(component.totalItems).toEqual(12);
            expect(BaseInventoryComponent.prototype.emitData).toHaveBeenCalled();
        }));
    });
});
//# sourceMappingURL=cab-inventory.component.spec.js.map