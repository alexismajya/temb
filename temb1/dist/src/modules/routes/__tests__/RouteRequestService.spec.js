"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_service_1 = require("./../../shared/base.service");
const database_1 = __importDefault(require("../../../database"));
const cache_1 = __importDefault(require("../../shared/cache"));
const route_request_service_1 = __importStar(require("../route-request.service"));
const __mocks__1 = require("../../../services/__mocks__");
const teamDetails_service_1 = require("../../teamDetails/teamDetails.service");
const { models: { RouteRequest, Cab } } = database_1.default;
describe(route_request_service_1.RouteRequestService, () => {
    let create;
    let findByPk;
    let updateSpy;
    let save;
    let findAll;
    let findOne;
    beforeEach(() => {
        create = jest.spyOn(base_service_1.BaseService.prototype, 'add');
        findByPk = jest.spyOn(RouteRequest, 'findByPk');
        updateSpy = jest.spyOn(base_service_1.BaseService.prototype, 'update');
        save = jest.spyOn(cache_1.default, 'save');
        findAll = jest.spyOn(RouteRequest, 'findAll');
        findOne = jest.spyOn(Cab, 'findOne');
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe(route_request_service_1.RouteRequestService.prototype.findByPk, () => {
        it('should find route request by Id', () => __awaiter(void 0, void 0, void 0, function* () {
            findByPk.mockResolvedValue(__mocks__1.mockRouteData);
            const result = yield route_request_service_1.default.findByPk(1);
            expect(result).toEqual(__mocks__1.mockRouteData);
        }));
    });
    describe(route_request_service_1.RouteRequestService.prototype.createRoute, () => {
        it('should create new route request', () => __awaiter(void 0, void 0, void 0, function* () {
            const { engagement: { id: engagementId }, home: { id: homeId }, busStop: { id: busStopId }, manager: { id: managerId }, } = __mocks__1.mockRouteRequestData;
            create.mockReturnValue(__mocks__1.mockRouteRequestData);
            const result = yield route_request_service_1.default.createRoute({
                engagementId,
                homeId,
                busStopId,
                managerId,
            });
            expect(create)
                .toHaveBeenCalledTimes(1);
            expect(create.mock.calls[0][0].status)
                .toEqual('Pending');
            expect(create.mock.calls[0][0].managerId)
                .toEqual(1);
            expect(result)
                .toEqual(__mocks__1.mockRouteRequestData);
        }));
    });
    describe(route_request_service_1.RouteRequestService.prototype.update, () => {
        it('should update route request', () => __awaiter(void 0, void 0, void 0, function* () {
            const id = 999;
            updateSpy.mockResolvedValue(__mocks__1.mockRouteRequestData);
            save.mockImplementation(() => ({}));
            const result = yield route_request_service_1.default.update(id, {
                opsComment: 'ZZZZZZ',
            });
            expect(result).toEqual(__mocks__1.mockRouteRequestData);
        }));
    });
    describe(route_request_service_1.RouteRequestService.prototype.getRouteRequest, () => {
        afterEach(() => {
            jest.restoreAllMocks();
            jest.restoreAllMocks();
        });
        it('should save on database and cache', () => __awaiter(void 0, void 0, void 0, function* () {
            const id = 123;
            const mock = Object.assign(Object.assign({}, __mocks__1.mockRouteRequestData), { id });
            findByPk.mockReturnValue(mock);
            const result = yield route_request_service_1.default.getRouteRequest(id);
            expect(findByPk).toHaveBeenCalled();
            expect(result).toEqual(mock);
        }));
    });
    describe(route_request_service_1.RouteRequestService.prototype.getRouteRequestAndToken, () => {
        let detailsSpy;
        let routeRequestSpy;
        beforeEach(() => {
            detailsSpy = jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsBotOauthToken')
                .mockResolvedValue('xoop-sadasds');
            routeRequestSpy = jest.spyOn(route_request_service_1.default, 'getRouteRequest')
                .mockResolvedValue(null);
        });
        afterEach(() => {
            jest.restoreAllMocks();
            jest.restoreAllMocks();
        });
        it('should return route request and bot token', () => __awaiter(void 0, void 0, void 0, function* () {
            const routeRequestId = 1;
            const teamId = 'BBBBCCC';
            const result = yield route_request_service_1.default.getRouteRequestAndToken(routeRequestId, teamId);
            expect(detailsSpy).toHaveBeenCalledWith(expect.any(String));
            expect(routeRequestSpy).toHaveBeenCalledWith(expect.any(Number));
            expect(result).toBeDefined();
        }));
    });
    describe(route_request_service_1.RouteRequestService.prototype.getAllConfirmedRouteRequests, () => {
        it('should find all confirmed route requests', () => __awaiter(void 0, void 0, void 0, function* () {
            const homebaseId = 14;
            findAll.mockResolvedValue([__mocks__1.mockRouteData]);
            const allConfirmedRouteRequests = yield route_request_service_1.default
                .getAllConfirmedRouteRequests(homebaseId);
            expect(allConfirmedRouteRequests).toEqual([__mocks__1.mockRouteData]);
        }));
    });
    describe(route_request_service_1.RouteRequestService.prototype.getCabCapacity, () => {
        it('should get cab capacity', () => __awaiter(void 0, void 0, void 0, function* () {
            const regNumber = '14R635';
            const result = {
                get: () => undefined,
            };
            findOne.mockResolvedValue(result);
            const getCabCapacity = yield route_request_service_1.default.getCabCapacity(regNumber);
            expect(getCabCapacity).toEqual(0);
        }));
    });
    afterEach(() => {
        jest.restoreAllMocks();
        jest.restoreAllMocks();
    });
});
//# sourceMappingURL=RouteRequestService.spec.js.map