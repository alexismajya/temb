import { async, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FellowRoutesResponseMock, FellowProcessedDataMock, FellowErrorDataMock } from './__mocks__/get-routes-response.mock';
import { of } from 'rxjs';
import { FellowComponent } from './fellow.component';
import { FellowRouteService } from '../../../__services__/fellow-route.service';
import { RouterTestingModule } from '@angular/router/testing';
describe('FellowComponent', function () {
    var component;
    var fixture;
    var FellowRoutesMock = {
        getFellowRoutes: function () { return of(FellowRoutesResponseMock); },
        userDetails: function () { return of(FellowRoutesResponseMock); },
    };
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [FellowComponent],
            imports: [HttpClientTestingModule, AngularMaterialModule,
                BrowserAnimationsModule, RouterTestingModule.withRoutes([])],
            providers: [
                { provide: FellowRouteService, useValue: FellowRoutesMock }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();
        fixture = TestBed.createComponent(FellowComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        jest.spyOn(FellowRoutesMock, 'getFellowRoutes');
    }));
    afterEach(function () {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
    it('should create component and render fellows', async(function () {
        component.getFellowsRoutes();
        fixture.detectChanges();
        expect(component.isLoading).toBe(false);
        expect(component.fellowsData).toEqual(FellowProcessedDataMock.data);
    }));
    describe('setPage', function () {
        it('should reload page', (function () {
            jest.spyOn(component, 'getFellowsRoutes');
            expect(component.pageNo).toEqual(1);
            component.setPage(20);
            fixture.detectChanges();
            expect(component.pageNo).toEqual(20);
            expect(component.getFellowsRoutes).toHaveBeenCalled();
        }));
    });
    it('Should return user name data', function () {
        component.userDetails(FellowRoutesResponseMock);
        expect(component.userName).toEqual('');
    });
});
describe('FellowComponent not array returned', function () {
    var component;
    var fixture;
    var FellowRoutesMock = {
        getFellowRoutes: function () { return of(FellowErrorDataMock); }
    };
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [FellowComponent],
            imports: [HttpClientTestingModule, AngularMaterialModule,
                BrowserAnimationsModule, RouterTestingModule.withRoutes([])],
            providers: [
                { provide: FellowRouteService, useValue: FellowRoutesMock }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();
        fixture = TestBed.createComponent(FellowComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        jest.spyOn(FellowRoutesMock, 'getFellowRoutes');
    }));
    afterEach(function () {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    it('Should return user name data', function () {
        component.getFellowsRoutes();
        expect(component.isLoading).toEqual(false);
        expect(component.displayText).toEqual('Something went wrong');
    });
});
//# sourceMappingURL=fellow.component.spec.js.map