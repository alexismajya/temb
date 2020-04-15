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
const RouteController_1 = __importDefault(require("../RouteController"));
const route_request_service_1 = __importDefault(require("../route-request.service"));
const user_service_1 = __importDefault(require("../../users/user.service"));
const responseHelper_1 = __importDefault(require("../../../helpers/responseHelper"));
const slackEvents_1 = require("../../slack/events/slackEvents");
const __mocks__1 = require("../../../services/__mocks__");
const teamDetails_service_1 = require("../../teamDetails/teamDetails.service");
const cache_1 = __importDefault(require("../../shared/cache"));
const RouteHelper_1 = __importDefault(require("../../../helpers/RouteHelper"));
describe('RoutesController', () => {
    const botToken = 'xxop-sdsad';
    const opsChannelId = 'QEWEQEQ';
    const declineReq = {
        params: { requestId: 1 },
        currentUser: { userInfo: { email: 'john.smith@gmail.com' } },
        body: {
            newOpsStatus: 'decline',
            comment: 'stuff',
            teamUrl: 'tembea.slack.com',
            takeOff: '11:20',
            provider: {
                id: 1,
                name: 'Andela Cabs',
                providerUserId: 15
            }
        }
    };
    const approveReq = {
        params: { requestId: 1 },
        currentUser: { userInfo: { email: 'john.smith@gmail.com' } },
        body: {
            newOpsStatus: 'approve',
            comment: 'stuff',
            reviewerEmail: 'test.buddy2@andela.com',
            routeName: 'HighWay',
            takeOff: '10:00AM',
            teamUrl: 'tester@andela.com',
            provider: {
                id: 1,
                name: 'Andela Cabs',
                providerUserId: 15
            }
        }
    };
    const returnedOpsData = { id: 10, slackId: 'wewrwwe' };
    const confirmedRouteRequest = Object.assign(Object.assign({}, __mocks__1.mockRouteRequestData), { status: 'Confirmed' });
    const declinedRouteRequest = Object.assign(Object.assign({}, __mocks__1.mockRouteRequestData), { status: 'Pending', opsComment: 'not allowed' });
    const approvedRouteRequest = Object.assign(Object.assign({}, __mocks__1.mockRouteRequestData), { status: 'Approved', opsComment: 'allowed' });
    describe('updateRouteRequestStatus', () => {
        let res;
        res = {
            status: () => ({
                json: () => { }
            })
        };
        beforeEach(() => {
            jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsByTeamUrl')
                .mockResolvedValue({ botToken, opsChannelId });
            jest.spyOn(slackEvents_1.SlackEvents, 'raise').mockResolvedValue();
            jest.spyOn(cache_1.default, 'fetch').mockResolvedValue('12234234.090345');
            jest.spyOn(RouteHelper_1.default, 'updateRouteRequest').mockResolvedValue(approvedRouteRequest);
            jest.spyOn(RouteHelper_1.default, 'createNewRouteWithBatch').mockImplementation();
            jest.spyOn(user_service_1.default, 'getUserByEmail').mockResolvedValue(returnedOpsData);
            jest.spyOn(RouteController_1.default, 'completeRouteApproval');
            jest.spyOn(RouteController_1.default, 'getSubmissionDetails');
            res = {
                status: jest.fn(() => ({
                    json: jest.fn(() => { })
                })).mockReturnValue({ json: jest.fn() })
            };
        });
        afterEach(() => {
            jest.resetAllMocks();
            jest.restoreAllMocks();
        });
        it('should update route request', (done) => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(route_request_service_1.default, 'getRouteRequestByPk')
                .mockResolvedValue(confirmedRouteRequest);
            jest.spyOn(RouteHelper_1.default, 'updateRouteRequest').mockResolvedValue(approvedRouteRequest);
            yield RouteController_1.default.updateRouteRequestStatus(approveReq, res);
            expect(RouteController_1.default.completeRouteApproval).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), expect.any(String), expect.any(String));
            done();
        }));
        it('should handle error when route request is not found', (done) => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(route_request_service_1.default, 'getRouteRequestByPk').mockResolvedValue();
            jest.spyOn(responseHelper_1.default, 'sendResponse');
            yield RouteController_1.default.updateRouteRequestStatus(approveReq, res);
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalledWith(res, 404, false, 'Route request not found.');
            done();
        }));
        it('should handle error when route request is already approved', (done) => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(route_request_service_1.default, 'getRouteRequestByPk')
                .mockResolvedValue(approvedRouteRequest);
            jest.spyOn(responseHelper_1.default, 'sendResponse');
            yield RouteController_1.default.updateRouteRequestStatus(approveReq, res);
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalledWith(res, 409, false, 'This request has already been approved');
            done();
        }));
        it('should send notification when request is declined', (done) => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(route_request_service_1.default, 'getRouteRequestByPk')
                .mockResolvedValue(confirmedRouteRequest);
            jest.spyOn(RouteHelper_1.default, 'updateRouteRequest')
                .mockResolvedValue(declinedRouteRequest);
            yield RouteController_1.default.updateRouteRequestStatus(declineReq, res);
            expect(RouteController_1.default.completeRouteApproval).toHaveBeenCalledWith(expect.objectContaining(declinedRouteRequest), expect.any(Object), expect.any(String), expect.any(String));
            done();
        }));
    });
});
//# sourceMappingURL=RouteRequestController.spec.js.map