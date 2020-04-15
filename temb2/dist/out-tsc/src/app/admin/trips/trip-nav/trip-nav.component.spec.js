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
import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TripNavComponent } from './trip-nav.component';
import { TripItineraryComponent } from '../trip-itinerary/trip-itinerary.component';
import { ShortenNamePipe } from '../../__pipes__/shorten-name.pipe';
import { AppTestModule } from '../../../__tests__/testing.module';
import { AppEventService } from 'src/app/shared/app-events.service';
import { ShortenTextPipe } from '../../__pipes__/shorten-text.pipe';
describe('TripNavComponent', function () {
    var component;
    var fixture;
    var appEventsMock = {
        broadcast: jest.fn()
    };
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            TestBed.configureTestingModule({
                declarations: [TripNavComponent, ShortenNamePipe, TripItineraryComponent, ShortenTextPipe],
                imports: [HttpClientTestingModule, AppTestModule],
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
                providers: [
                    { provide: AppEventService, useValue: appEventsMock }
                ]
            })
                .overrideTemplate(TripNavComponent, "<div></div>")
                .compileComponents();
            return [2 /*return*/];
        });
    }); });
    beforeEach(function () {
        fixture = TestBed.createComponent(TripNavComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    afterEach(function () {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    var event = {
        tripRequestType: 'pastTrips',
        tab: {
            textLabel: 'Past Trips'
        }
    };
    it('should create', function () {
        expect(component).toBeTruthy();
    });
    it('should send a past trips broadcast message', function () {
        component.data = { pastTrips: { totalItems: 4 } };
        var broadcastPayload = { tooltipTitle: event.tab.textLabel, badgeSize: component.data.pastTrips.totalItems };
        component.getSelectedTab(event);
        expect(appEventsMock.broadcast).toHaveBeenCalledWith({ name: 'updateHeaderTitle', content: broadcastPayload });
    });
    it('should send a Confirmed trips broadcast message', function () {
        component.data = { confirmed: { totalItems: 4 } };
        var broadcastPayload = { tooltipTitle: 'Confirmed', badgeSize: component.data.confirmed.totalItems };
        component.getSelectedTab({ tripRequestType: 'confirmed', tab: { textLabel: 'Confirmed' } });
        expect(appEventsMock.broadcast).toHaveBeenCalledWith({ name: 'updateHeaderTitle', content: broadcastPayload });
    });
    it('should send a Pending trips broadcast message', function () {
        component.data = { pending: { totalItems: 4 } };
        var broadcastPayload = { tooltipTitle: 'Pending', badgeSize: component.data.pending.totalItems };
        component.getSelectedTab({ tripRequestType: 'pending', tab: { textLabel: 'Pending' } });
        expect(appEventsMock.broadcast).toHaveBeenCalledWith({ name: 'updateHeaderTitle', content: broadcastPayload });
    });
    it('should send a All Trips broadcast message', function () {
        component.data = { all: { totalItems: 4 } };
        event.tab.textLabel = 'All Trips';
        var broadcastPayload = { tooltipTitle: event.tab.textLabel, badgeSize: component.data.all.totalItems };
        component.getSelectedTab(event);
        expect(appEventsMock.broadcast).toHaveBeenCalledWith({ name: 'updateHeaderTitle', content: broadcastPayload });
    });
    it('should send a Declined Trips broadcast message', function () {
        component.data = { declinedTrips: { totalItems: 4 } };
        event.tab.textLabel = 'Declined Trips';
        var broadcastPayload = { tooltipTitle: event.tab.textLabel, badgeSize: component.data.declinedTrips.totalItems };
        component.getSelectedTab(event);
        expect(appEventsMock.broadcast).toHaveBeenCalledWith({ name: 'updateHeaderTitle', content: broadcastPayload });
    });
    it('should send a Upcoming Trips broadcast message', function () {
        component.data = { upcomingTrips: { totalItems: 4 } };
        event.tab.textLabel = 'Upcoming Trips';
        var broadcastPayload = { tooltipTitle: event.tab.textLabel, badgeSize: component.data.upcomingTrips.totalItems };
        component.getSelectedTab(event);
        expect(appEventsMock.broadcast).toHaveBeenCalledWith({ name: 'updateHeaderTitle', content: broadcastPayload });
    });
    it('should send an Awaiting Provider message', function () {
        component.data = { awaitingProvider: { totalItems: 4 } };
        event.tab.textLabel = 'Awaiting Provider';
        var broadcastPayload = { tooltipTitle: event.tab.textLabel, badgeSize: component.data.awaitingProvider.totalItems };
        component.getSelectedTab(event);
        expect(appEventsMock.broadcast).toHaveBeenCalledWith({ name: 'updateHeaderTitle', content: broadcastPayload });
    });
    it('should send an Awaiting approval message', function () {
        component.data = { awaitingApproval: { totalItems: 4 } };
        event.tab.textLabel = 'Awaiting Approval';
        var broadcastPayload = { tooltipTitle: event.tab.textLabel, badgeSize: component.data.awaitingApproval.totalItems };
        component.getSelectedTab(event);
        expect(appEventsMock.broadcast).toHaveBeenCalledWith({ name: 'updateHeaderTitle', content: broadcastPayload });
    });
    it('should send a default all broadcast message if event not found', function () {
        component.data = { all: { totalItems: 4 } };
        event.tab.textLabel = 'mmmm';
        var broadcastPayload = { tooltipTitle: event.tab.textLabel, badgeSize: component.data.all.totalItems };
        component.getSelectedTab(event);
        expect(appEventsMock.broadcast).toHaveBeenCalledWith({ name: 'updateHeaderTitle', content: broadcastPayload });
    });
    it('should call tripsTotal function', function () {
        component.tripsTotal(event);
        expect(component.data['pastTrips'].tripRequestType).toEqual(event.tripRequestType);
    });
});
//# sourceMappingURL=trip-nav.component.spec.js.map