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
import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RoutesInventoryService } from './routes-inventory.service';
import { RouteInventoryModel } from '../../shared/models/route-inventory.model';
import getRoutesResponseMock from '../routes/routes-inventory/__mocks__/get-routes-response.mock';
import { environment } from '../../../environments/environment';
describe('Service Tests', function () {
    describe('Route Inventory Service', function () {
        var injector;
        var service;
        var httpMock;
        var routesResponseMock = new RouteInventoryModel()
            .deserialize(getRoutesResponseMock);
        beforeEach(function () {
            TestBed.configureTestingModule({
                imports: [HttpClientTestingModule]
            });
            injector = getTestBed();
            service = injector.get(RoutesInventoryService);
            httpMock = injector.get(HttpTestingController);
        });
        describe('Service methods', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it('should update a route status', function (done) {
                    var returnedFromService = Object.assign(routesResponseMock.routes[0], { status: 'Activated' });
                    var expected = Object.assign({}, returnedFromService);
                    service
                        .changeRouteStatus(1, { status: 'Activated' })
                        .subscribe(function (resp) {
                        expect(resp).toEqual(__assign({}, expected));
                        done();
                    });
                    var req = httpMock.expectOne({ method: 'PUT' });
                    req.flush(returnedFromService);
                    httpMock.verify();
                });
                it('should return a list of routes', function (done) {
                    var returnedFromService = Object.assign({}, routesResponseMock);
                    var expected = Object.assign({}, returnedFromService);
                    var size = 1;
                    var page = 2;
                    var sort = 'id,asc';
                    service
                        .getRoutes(size, page, sort)
                        .subscribe(function (result) {
                        expect(result.data).toEqual(expected);
                        done();
                    });
                    var url = environment.tembeaBackEndUrl + "/api/v2/routes?sort=" + sort + "&size=" + size + "&page=" + page;
                    var req = httpMock.expectOne(url);
                    expect(req.request.url).toBe(url);
                    req.flush({ data: returnedFromService });
                    httpMock.verify();
                });
                return [2 /*return*/];
            });
        }); });
        afterEach(function () {
            httpMock.verify();
        });
    });
});
//# sourceMappingURL=routes-inventory.service.spec.js.map