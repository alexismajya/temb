var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { of } from 'rxjs';
import { PendingRequestComponent } from './pending-request.component';
import { EmptyPageComponent } from '../../empty-page/empty-page.component';
import { AngularMaterialModule } from '../../../angular-material.module';
import { ActivatedRouteMock } from '../../../__mocks__/activated.router.mock';
import { TripRequestService } from '../../__services__/trip-request.service';
import { tripRequestMock } from '../../__services__/__mocks__/trip-request.mock';
import { AppEventService } from 'src/app/shared/app-events.service';
import { SpyObject } from '../../../__mocks__/SpyObject';
import { AppTestModule } from '../../../__tests__/testing.module';
describe('PendingRequestComponent Unit Test', function () {
    var component;
    var fixture;
    var tripRequestService;
    var appEventService;
    var activatedRoute;
    var matDialog;
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            TestBed.configureTestingModule({
                declarations: [PendingRequestComponent, EmptyPageComponent],
                imports: [HttpClientTestingModule, AngularMaterialModule, AppTestModule],
                providers: [
                    {
                        provide: ActivatedRoute,
                        useValue: new ActivatedRouteMock()
                    },
                    { provide: MatDialog, useValue: new SpyObject(MatDialog) }
                ]
            })
                .overrideTemplate(PendingRequestComponent, "<div></div>")
                .compileComponents();
            return [2 /*return*/];
        });
    }); });
    beforeEach(function () {
        fixture = TestBed.createComponent(PendingRequestComponent);
        component = fixture.componentInstance;
        tripRequestService = fixture.debugElement.injector.get(TripRequestService);
        appEventService = fixture.debugElement.injector.get(AppEventService);
        activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
        fixture.detectChanges();
    });
    beforeEach(function () {
        var trips = Object.assign({}, tripRequestMock);
        var pageInfo = {
            totalResults: 12,
        };
        jest.spyOn(appEventService, 'broadcast');
        jest.spyOn(tripRequestService, 'query')
            .mockReturnValue(of({ trips: [trips], pageInfo: pageInfo }));
    });
    beforeEach(inject([MatDialog], function (_matDialog) {
        matDialog = _matDialog;
        _matDialog.open.mockImplementation();
    }));
    afterEach(function () {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
    describe('ngOnInit', function () {
        it('should load all trip request', function () {
            var trips = Object.assign({}, tripRequestMock);
            var pageInfo = {
                totalResults: 12,
            };
            jest.spyOn(component, 'loadAll');
            jest.spyOn(tripRequestService, 'query')
                .mockReturnValue(of({ trips: [trips], pageInfo: pageInfo }));
            component.pageSize = 100;
            component.page = 1;
            component.ngOnInit();
            fixture.detectChanges();
            expect(tripRequestService.query).toHaveBeenCalledWith({ page: 1, size: 100, status: 'Approved' });
            expect(appEventService.broadcast).toHaveBeenCalled();
            expect(component.loadAll).toHaveBeenCalled();
        });
    });
    describe('updatePage', function () {
        it('should update page', function () {
            component.updatePage(123);
            expect(tripRequestService.query).toHaveBeenCalledWith({ page: 123, size: 20, status: 'Approved' });
            expect(appEventService.broadcast).toHaveBeenCalled();
        });
    });
    describe('ngOnDestroy', function () {
        it('should unsubscribe from activated route data', function () {
            jest.spyOn(component.routeData, 'unsubscribe');
            component.ngOnDestroy();
            expect(component.routeData.unsubscribe).toHaveBeenCalledTimes(1);
        });
    });
    describe('confirm trip', function () {
        it('should handle decline', function () {
            var tripRequest = tripRequestMock;
            component.confirm(tripRequest);
            expect(matDialog.open).toHaveBeenCalled();
            expect(matDialog.open.mock.calls[0][1].data).toEqual({
                status: 0,
                requesterFirstName: tripRequest.requester.name,
                tripId: tripRequest.id
            });
        });
    });
    describe('decline trip', function () {
        it('should handle decline', function () {
            var tripRequest = tripRequestMock;
            component.decline(tripRequest);
            expect(matDialog.open).toHaveBeenCalled();
            expect(matDialog.open.mock.calls[0][1].data).toEqual({
                status: 1,
                requesterFirstName: tripRequest.requester.name,
                tripId: tripRequest.id
            });
        });
    });
});
//# sourceMappingURL=pending-request.component.spec.js.map