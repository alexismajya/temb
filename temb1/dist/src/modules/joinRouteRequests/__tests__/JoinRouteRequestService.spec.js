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
Object.defineProperty(exports, "__esModule", { value: true });
const joinRouteRequest_service_1 = require("../joinRouteRequest.service");
const bugsnagHelper_1 = require("../../../helpers/bugsnagHelper");
const join_request_1 = __importDefault(require("../../../database/models/join-request"));
describe('joinRouteRequestService', () => {
    let create;
    let findByPk;
    const mockData = {
        id: 1,
        status: 'Pending',
        engagement: { engagementId: 1 },
        manager: { managerId: 2 },
        routeBatch: { routeBatchId: 1 },
    };
    const joinRequestData = {
        get: ({ plain }) => (plain ? mockData : null),
    };
    beforeEach(() => {
        create = jest.spyOn(join_request_1.default, 'create');
        findByPk = jest.spyOn(join_request_1.default, 'findByPk').mockReturnValue(joinRequestData);
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe('createJoinRouteRequest', () => {
        afterEach(() => {
            jest.resetAllMocks();
        });
        it('should create a new join route request', () => __awaiter(void 0, void 0, void 0, function* () {
            create.mockReturnValue(joinRequestData);
            const result = yield joinRouteRequest_service_1.joinRouteRequestService.createJoinRouteRequest(1, 2, 1);
            expect(result).toEqual(joinRequestData);
            expect(create).toBeCalledTimes(1);
            expect(create.mock.calls[0][0].status)
                .toEqual('Pending');
            expect(create.mock.calls[0][0].managerId)
                .toEqual(2);
        }));
        it('should log on error on bugsnag', () => __awaiter(void 0, void 0, void 0, function* () {
            create.mockImplementationOnce(() => { throw new Error('very error'); });
            const spy = jest.spyOn(bugsnagHelper_1.Bugsnag.prototype, 'log');
            yield joinRouteRequest_service_1.joinRouteRequestService.createJoinRouteRequest(1, 2, 1, 'comment');
            expect(spy).toBeCalledWith(new Error('very error'));
        }));
    });
    it('should update join route request', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(joinRouteRequest_service_1.joinRouteRequestService, 'getJoinRouteRequest').mockImplementationOnce(() => (joinRequestData));
        jest.spyOn(join_request_1.default, 'update').mockResolvedValue([, [{
                    get: () => (mockData),
                }]]);
        const data = Object.assign({}, joinRequestData.get({ plain: true }));
        const result = yield joinRouteRequest_service_1.joinRouteRequestService.updateJoinRouteRequest(1, data);
        expect(result).toEqual(data);
    }));
    describe('getJoinRouteRequest', () => {
        afterEach(() => {
            jest.resetAllMocks();
        });
        it('should fetch a join route request by pk from database', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield joinRouteRequest_service_1.joinRouteRequestService.getJoinRouteRequest(1);
            expect(findByPk).toBeCalled();
            expect(result).toEqual(joinRequestData.get({ plain: true }));
        }));
    });
});
//# sourceMappingURL=JoinRouteRequestService.spec.js.map