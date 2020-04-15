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
const teamDetails_service_1 = require("../../../teamDetails/teamDetails.service");
const DialogPrompts_1 = __importDefault(require("../DialogPrompts"));
const sendDialogTryCatch_1 = __importDefault(require("../../../../helpers/sendDialogTryCatch"));
const user_service_1 = __importDefault(require("../../../users/user.service"));
const cab_service_1 = require("../../../cabs/cab.service");
const driver_service_1 = require("../../../drivers/driver.service");
const provider_service_1 = require("../../../providers/provider.service");
const providerHelper_1 = __importDefault(require("../../../../helpers/providerHelper"));
const homebase_service_1 = require("../../../homebases/homebase.service");
const driversMocks_1 = __importDefault(require("../../../drivers/__mocks__/driversMocks"));
jest.mock('../../../../helpers/sendDialogTryCatch', () => jest.fn());
jest.mock('../../../../helpers/slack/createDialogForm', () => jest.fn());
jest.mock('@slack/client', () => ({
    WebClient: jest.fn(() => ({
        dialog: {
            open: jest.fn(() => Promise.resolve({
                status: true
            }))
        }
    }))
}));
const respond = jest.fn();
describe('Dialog prompts test', () => {
    beforeEach(() => {
        jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsBotOauthToken').mockResolvedValue('token');
    });
    afterEach(() => {
        jest.resetAllMocks();
    });
    it('should test sendTripDetailsForm function', () => __awaiter(void 0, void 0, void 0, function* () {
        const payload = { trigger_id: 'trigger', team: { id: 'TEAMID1' } };
        yield DialogPrompts_1.default.sendTripDetailsForm(payload, 'someFunctionName', 'someCallbackId');
        expect(sendDialogTryCatch_1.default).toBeCalledTimes(1);
    }));
    it('should test sendSkipPage function', () => __awaiter(void 0, void 0, void 0, function* () {
        const payload = { actions: [{ name: 'skipPage' }], team: { id: 'TEAMID1' } };
        yield DialogPrompts_1.default.sendSkipPage(payload, 'view_upcoming_trips');
        expect(sendDialogTryCatch_1.default).toBeCalledTimes(1);
    }));
    it('should test sendTripReasonForm function', () => __awaiter(void 0, void 0, void 0, function* () {
        const payload = { trigger_id: 'trigger', team: { id: 'TEAMID1' } };
        yield DialogPrompts_1.default.sendTripReasonForm(payload);
        expect(sendDialogTryCatch_1.default).toBeCalledTimes(1);
    }));
    it('should test sendCommentDialog function', () => __awaiter(void 0, void 0, void 0, function* () {
        yield DialogPrompts_1.default.sendOperationsDeclineDialog({
            message_ts: 'trigger',
            actions: ['value', ''],
            team: { id: 'TEAMID1' }
        });
        expect(sendDialogTryCatch_1.default).toBeCalledTimes(1);
    }));
    it('should test sendOperationsApprovalDialog function', () => __awaiter(void 0, void 0, void 0, function* () {
        yield DialogPrompts_1.default.sendOperationsApprovalDialog({
            actions: [{
                    value: JSON.stringify({ confirmationComment: 'comment' })
                }, ''],
            trigger_id: 'trigger',
            channel: {
                id: 'XXXXXXXX'
            },
            team: { id: 'TEAMID1' }
        }, respond);
        expect(sendDialogTryCatch_1.default).toBeCalledTimes(1);
    }));
    it('should test sendOperationsApprovalDialog function on create new cab', () => __awaiter(void 0, void 0, void 0, function* () {
        yield DialogPrompts_1.default.sendOperationsApprovalDialog({
            actions: [{
                    value: JSON.stringify({ confirmationComment: 'comment' })
                }, ''],
            callback_id: 'operations_approval_route',
            trigger_id: 'trigger',
            channel: {
                id: 'XXXXXXXX'
            },
            team: { id: 'TEAMID1' }
        }, respond);
        expect(sendDialogTryCatch_1.default).toBeCalledTimes(1);
    }));
    it('should send decline dialog', () => __awaiter(void 0, void 0, void 0, function* () {
        yield DialogPrompts_1.default.sendReasonDialog({
            trigger_id: 'XXXXXXX',
            team: { id: 'TEAMID1' }
        }, 'callback_id', 'state', 'dialogName');
        expect(sendDialogTryCatch_1.default).toBeCalled();
    }));
    it('should test sendLocationForm function', () => __awaiter(void 0, void 0, void 0, function* () {
        yield DialogPrompts_1.default.sendLocationForm({
            actions: ['value', ''],
            trigger_id: 'trigger',
            channel: {
                id: 'XXXXX'
            },
            team: { id: 'TEAMID1' }
        });
        expect(sendDialogTryCatch_1.default).toBeCalledTimes(1);
    }));
    it('should sendLocationCoordinatesForm', () => __awaiter(void 0, void 0, void 0, function* () {
        yield DialogPrompts_1.default.sendLocationCoordinatesForm({
            trigger_id: 'XXXXXXX',
            team: { id: 'TEAMID1' }
        });
        expect(sendDialogTryCatch_1.default).toBeCalledTimes(1);
    }));
    it('should send sendOperationsNewRouteApprovalDialog dialog', () => __awaiter(void 0, void 0, void 0, function* () {
        const state = JSON.stringify({
            approve: {
                timeStamp: '123848', channelId: 'XXXXXX', routeRequestId: '1'
            }
        });
        jest.spyOn(provider_service_1.providerService, 'getViableProviders').mockResolvedValue([{
                name: 'label',
                providerId: 1,
                user: { slackId: 'DDD' }
            }]);
        jest.spyOn(homebase_service_1.homebaseService, 'getHomeBaseBySlackId').mockResolvedValue({ HomebaseId: '4' });
        yield DialogPrompts_1.default.sendOperationsNewRouteApprovalDialog({
            trigger_id: 'XXXXXXX',
            team: { id: 'TEAMID1' },
            user: { id: 'UVBGH223' }
        }, state);
        expect(sendDialogTryCatch_1.default).toBeCalledTimes(1);
    }));
    it('should test sendEngagementInfoDialogToManager function', () => __awaiter(void 0, void 0, void 0, function* () {
        const payload = {
            callback_id: 'calling',
            team: { id: 'TEAMID1' }
        };
        yield DialogPrompts_1.default.sendEngagementInfoDialogToManager(payload, 'call', 'state', 'dialog');
        expect(sendDialogTryCatch_1.default)
            .toBeCalledTimes(1);
    }));
    it('should test sendSearchPage function', () => __awaiter(void 0, void 0, void 0, function* () {
        const payload = { actions: [{ name: 'search' }], team: { id: 'TEAMID1' } };
        yield DialogPrompts_1.default.sendSearchPage(payload, 'view_available_routes', 'tembea-route', respond);
        expect(sendDialogTryCatch_1.default).toBeCalledTimes(1);
    }));
    it('should send select cab dialog', () => __awaiter(void 0, void 0, void 0, function* () {
        const cab = {
            data: [{
                    model: 'doodle',
                    regNumber: '990ccc',
                    capacity: 4
                }]
        };
        jest.spyOn(user_service_1.default, 'getUserBySlackId').mockResolvedValue({});
        jest.spyOn(provider_service_1.providerService, 'findProviderByUserId').mockResolvedValue({});
        jest.spyOn(cab_service_1.cabService, 'getCabs').mockResolvedValue(cab);
        jest.spyOn(driver_service_1.driverService, 'findAll').mockResolvedValue(driversMocks_1.default.findAllMock);
        yield DialogPrompts_1.default.sendSelectCabDialog({
            actions: [{ value: 7 }],
            message_ts: '3703484984.4849',
            channel: { id: 84 },
            team: { id: 9 },
            user: { id: 'uxclla' }
        });
        expect(sendDialogTryCatch_1.default).toBeCalledTimes(1);
    }));
});
describe('sendBusStopForm dialog', () => {
    it('should send dialog for bus stop', () => __awaiter(void 0, void 0, void 0, function* () {
        const payload = { channel: {}, team: {}, actions: [{ value: 2 }] };
        const busStageList = [{}];
        yield DialogPrompts_1.default.sendBusStopForm(payload, busStageList);
        expect(sendDialogTryCatch_1.default).toBeCalled();
    }));
    describe('DialogPrompts_sendNewRouteForm', () => {
        it('should lunch new route form', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = { team: { id: '123' } };
            yield DialogPrompts_1.default.sendNewRouteForm(payload);
            expect(sendDialogTryCatch_1.default).toBeCalled();
        }));
    });
    describe('sendTripNotesDialogForm', () => {
        it('should send trip notes form dialog', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = { submission: {}, team: { id: 'TEAMID1' } };
            yield DialogPrompts_1.default.sendTripNotesDialogForm(payload);
            expect(sendDialogTryCatch_1.default).toBeCalled();
        }));
    });
    describe('sendLocationDialogToUser', () => {
        it('should send resubmit location dialog to user', () => __awaiter(void 0, void 0, void 0, function* () {
            yield DialogPrompts_1.default.sendLocationDialogToUser({
                actions: [{
                        value: 'no_Pick up'
                    }],
                trigger_id: 'XXXXXXX',
                team: { id: 'TEAMID1' }
            });
            expect(sendDialogTryCatch_1.default).toHaveBeenCalled();
        }));
    });
    describe('DialogPrompts > sendSelectProviderDialog', () => {
        it('should send select provider dialog', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(provider_service_1.providerService, 'getViableProviders').mockResolvedValue([{
                    name: 'label',
                    id: 1,
                }]);
            jest.spyOn(providerHelper_1.default, 'generateProvidersLabel');
            jest.spyOn(user_service_1.default, 'getUserBySlackId').mockImplementation(() => ({ id: 1 }));
            jest.spyOn(homebase_service_1.homebaseService, 'getHomeBaseBySlackId').mockImplementation(() => ({ id: 1 }));
            yield DialogPrompts_1.default.sendSelectProviderDialog({
                actions: [{ value: 7 }],
                message_ts: '3703484984.4849',
                channel: { id: 84 },
                team: { id: 9 },
                user: { id: 1 }
            });
            expect(sendDialogTryCatch_1.default).toHaveBeenCalled();
        }));
    });
});
//# sourceMappingURL=DialogPrompts.spec.js.map