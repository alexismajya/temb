var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
/* tslint:disable max-line-length */
import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { TripRequestService } from './trip-request.service';
import { tripRequestMock } from './__mocks__/trip-request.mock';
import { department } from 'src/app/shared/__mocks__/department.mock';
import { AlertService } from 'src/app/shared/alert.service';
import { AppTestModule } from '../../__tests__/testing.module';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
describe('Trip Request Service', function () {
    var service;
    var httpMock;
    var toastr;
    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [AppTestModule],
            providers: []
        });
        var injector = getTestBed();
        service = injector.get(TripRequestService);
        httpMock = injector.get(HttpTestingController);
        toastr = injector.get(AlertService);
    });
    afterEach(function () {
        httpMock.verify();
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    it('should be created', function () {
        expect(service).toBeTruthy();
    });
    describe('Service methods', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            it('should return a list of pending trips', function (done) {
                var requestedOn = tripRequestMock.requestedOn.toISOString();
                var departureTime = tripRequestMock.departureTime.toISOString();
                var returnedFromService = {
                    pageMeta: { totalResults: 123 },
                    trips: [__assign({}, tripRequestMock, { requestedOn: requestedOn, departureTime: departureTime })]
                };
                service
                    .query({ status: 'Pending' })
                    .subscribe(function (result) {
                    expect(result.trips).toContainEqual(tripRequestMock);
                    done();
                });
                var url = environment.tembeaBackEndUrl + "/api/v1/trips";
                var req = httpMock.expectOne({ method: 'GET' });
                expect(req.request.url).toBe(url);
                req.flush({ data: returnedFromService });
            });
            return [2 /*return*/];
        });
    }); });
    it('should get all department', function (done) {
        var departmentMock = { department: department };
        service.getDepartments()
            .subscribe(function (result) {
            expect(result).toBe(departmentMock.departments);
            done();
        });
        var departmentsUrl = environment.tembeaBackEndUrl + "/api/v1/departments";
        var req = httpMock.expectOne(departmentsUrl);
        expect(req.request.method).toEqual('GET');
        req.flush(departmentMock);
        httpMock.verify();
    });
    describe('declineRequest', function () {
        it('should handle decline request', function (done) {
            jest.spyOn(service, 'handleResponse').mockImplementation();
            var comment = 'some comment';
            var slackUrl = environment.teamUrl;
            var mockResponse = {
                success: true,
                message: 'This trip request has been declined',
                data: {
                    tripId: 1
                }
            };
            service.declineRequest(1, comment)
                .subscribe(function (result) {
                expect(result).toEqual(mockResponse);
                expect(service.handleResponse).toHaveBeenCalledTimes(1);
                expect(service.handleResponse).toHaveBeenCalledWith(mockResponse, 'decline');
                done();
            });
            var request = httpMock.expectOne(service.tripUrl + "/1?action=decline");
            expect(request.request.method).toEqual('PUT');
            expect(request.request.body).toEqual({ comment: comment, slackUrl: slackUrl });
            request.flush(mockResponse);
        });
        it('should decline request error', function (done) {
            var comment = 'some comment';
            var slackUrl = environment.teamUrl;
            service.declineRequest(1, comment)
                .subscribe(null, function (result) {
                expect(result.status).toEqual(400);
                expect(result.statusText).toEqual('Bad Request');
                expect(toastr.error).toHaveBeenCalledTimes(1);
                done();
            });
            var request = httpMock.expectOne(service.tripUrl + "/1?action=decline");
            expect(request.request.method).toEqual('PUT');
            expect(request.request.body).toEqual({ comment: comment, slackUrl: slackUrl });
            request.flush('Server error', {
                status: 400,
                statusText: 'Bad Request'
            });
        });
    });
    describe('confirmRequest', function () {
        var values = {
            providerId: 16,
            comment: 'This trip is confirm'
        };
        var mockResponse = {
            success: true,
            message: 'This trip request has been confirmed',
        };
        var slackUrl = environment.teamUrl;
        it('should handle confirm trip request', function (done) {
            jest.spyOn(service, 'handleResponse').mockImplementation();
            service.confirmRequest(1, values)
                .subscribe(function (result) {
                expect(service.handleResponse).toHaveBeenCalledTimes(1);
                expect(service.handleResponse).toHaveBeenCalledWith(result, 'confirm');
                done();
            });
            var request = httpMock.expectOne(service.tripUrl + "/1?action=confirm");
            expect(request.request.method).toEqual('PUT');
            expect(request.request.body).toEqual(__assign({}, values, { slackUrl: slackUrl }));
            request.flush(mockResponse);
            done();
        });
        it('should throw confirm request error', function (done) {
            jest.spyOn(service, 'handleResponse').mockImplementation();
            service.confirmRequest(1, values)
                .subscribe(null, function (result) {
                expect(result.status).toEqual(400);
                expect(result.statusText).toEqual('Bad Request');
                expect(toastr.error).toHaveBeenCalledTimes(1);
                done();
            });
            var request = httpMock.expectOne(service.tripUrl + "/1?action=confirm");
            expect(request.request.method).toEqual('PUT');
            expect(request.request.body).toEqual(__assign({}, values, { slackUrl: slackUrl }));
            request.flush('Server error', {
                status: 400,
                statusText: 'Bad Request'
            });
            done();
        });
    });
    describe('handleResponse', function () {
        it('should confirm the trip request', function () {
            service.handleResponse({ success: true }, 'confirm');
            expect(toastr.success).toHaveBeenCalledTimes(1);
            expect(toastr.success).toHaveBeenCalledWith('Trip request confirmed!');
        });
        it('should not confirm the trip request', function () {
            service.handleResponse({ success: false }, 'confirm');
            expect(toastr.error).toHaveBeenCalledTimes(1);
            expect(toastr.error).toHaveBeenCalledWith('Could not confirm request');
        });
        it('should decline the trip request', function () {
            service.handleResponse({ success: true }, 'decline');
            expect(toastr.success).toHaveBeenCalledTimes(1);
            expect(toastr.success).toHaveBeenCalledWith('Trip request declined!');
        });
        it('should not decline the trip request', function () {
            service.handleResponse({ success: false }, 'decline');
            expect(toastr.error).toHaveBeenCalledTimes(1);
            expect(toastr.error).toHaveBeenCalledWith('Could not decline request');
        });
    });
    describe('providerConfirm', function () {
        it('should call http client post method on providerConfirm', function () {
            var response = { success: true };
            jest.spyOn(HttpClient.prototype, 'post').mockReturnValue(of(response));
            service.providerConfirm({});
            expect(HttpClient.prototype.post).toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=trip-request.service.spec.js.map