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
const RateTripController_1 = __importDefault(require("../RateTripController"));
const SlackMessageModels_1 = require("../../SlackModels/SlackMessageModels");
const teamDetails_service_1 = require("../../../teamDetails/teamDetails.service");
const WebClientSingleton_1 = __importDefault(require("../../../../utils/WebClientSingleton"));
const interactions_1 = __importDefault(require("../../../new-slack/trips/user/interactions"));
const trip_service_1 = __importDefault(require("../../../trips/trip.service"));
const batchUseRecord_service_1 = require("../../../batchUseRecords/batchUseRecord.service");
const user_service_1 = __importDefault(require("../../../users/user.service"));
const updatePastMessageHelper_1 = __importDefault(require("../../../../helpers/slack/updatePastMessageHelper"));
const Notifications_1 = __importDefault(require("../../SlackPrompts/Notifications"));
describe('RateTripController', () => {
    describe('sendTripRatingMessage', () => {
        it('should return a slack interactive message', () => __awaiter(void 0, void 0, void 0, function* () {
            const addPropsSpy = jest.spyOn(SlackMessageModels_1.SlackAttachment.prototype, 'addOptionalProps');
            const addActionsSpy = jest.spyOn(SlackMessageModels_1.SlackAttachment.prototype, 'addFieldsOrActions');
            const buttons = RateTripController_1.default.createRatingButtons(1);
            const result = yield RateTripController_1.default.sendRatingMessage(1, 'rate_trip');
            expect(addPropsSpy).toBeCalledWith('rate_trip');
            expect(addActionsSpy).toBeCalledWith('actions', buttons);
            expect(result.text).toEqual('*Please rate this trip on a scale of \'1 - 5\' :star: *');
            expect(result.attachments[0].actions).toHaveLength(5);
        }));
    });
    describe('createRatingButtons', () => {
        it('should return an array of buttons of length 5', () => {
            const result = RateTripController_1.default.createRatingButtons(3);
            expect(result).toHaveLength(5);
            expect(result[2]).toEqual(new SlackMessageModels_1.SlackButtonAction(3, '3 :neutral_face:', 3, 'default'));
        });
    });
    describe('getAfterRatingAction', () => {
        const payload = { user: { id: 'SHDAA' }, response_url: 'url' };
        it('should Update message if homebase is KAMPALA', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(user_service_1.default, 'getUserBySlackId').mockResolvedValue({
                homebase: { name: 'Kampala' }
            });
            jest.spyOn(updatePastMessageHelper_1.default, 'newUpdateMessage');
            yield RateTripController_1.default.getAfterRatingAction(payload, {});
            expect(updatePastMessageHelper_1.default.newUpdateMessage).toBeCalled();
        }));
        it('should send Price Form if homebase is not Kampala ', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(user_service_1.default, 'getUserBySlackId').mockResolvedValue({
                homebase: { name: 'Nairobi' }
            });
            jest.spyOn(interactions_1.default, 'sendPriceForm').mockResolvedValue({});
            yield RateTripController_1.default.getAfterRatingAction(payload, {});
            expect(interactions_1.default.sendPriceForm).toBeCalled();
        }));
    });
    describe('rateTrip', () => {
        const respond = jest.fn();
        const getWebClientMock = (mock) => ({
            dialog: { open: mock }
        });
        beforeAll(() => {
            jest.spyOn(trip_service_1.default, 'updateRequest').mockResolvedValue({});
            jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetails')
                .mockResolvedValue({ botToken: { slackBotOauthToken: 'ABCDE' } });
            jest.spyOn(interactions_1.default, 'sendPriceForm');
        });
        it('should call getAfterRatingAction if action is rate_trip', () => __awaiter(void 0, void 0, void 0, function* () {
            const open = jest.fn().mockResolvedValue({ status: true });
            jest.spyOn(WebClientSingleton_1.default, 'getWebClient')
                .mockReturnValue(getWebClientMock(open));
            const payload = {
                actions: [{ name: '1', value: '3' }], callback_id: 'rate_trip', team: { id: 'random' }
            };
            jest.spyOn(RateTripController_1.default, 'getAfterRatingAction').mockResolvedValue({});
            jest.spyOn(Notifications_1.default, 'sendOpsPostRatingMessage').mockResolvedValue({});
            yield RateTripController_1.default.rate(payload, respond);
            expect(RateTripController_1.default.getAfterRatingAction).toBeCalled();
            expect(Notifications_1.default.sendOpsPostRatingMessage).toBeCalled();
        }));
        it('should call batchUseRecordService.updateBatchUseRecord if action is rate_route', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                actions: [{ name: '1', value: '3' }], callback_id: 'rate_route', team: { id: 'random' }
            };
            jest.spyOn(batchUseRecord_service_1.batchUseRecordService, 'updateBatchUseRecord').mockResolvedValue({});
            const response = yield RateTripController_1.default.rate(payload, respond);
            expect(batchUseRecord_service_1.batchUseRecordService.updateBatchUseRecord).toBeCalled();
            expect(response).toBeInstanceOf(SlackMessageModels_1.SlackInteractiveMessage);
        }));
    });
});
//# sourceMappingURL=rateTripController.spec.js.map