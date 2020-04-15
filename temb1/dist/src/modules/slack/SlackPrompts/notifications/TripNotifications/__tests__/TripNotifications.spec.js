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
const teamDetails_service_1 = require("../../../../../teamDetails/teamDetails.service");
const Notifications_1 = __importDefault(require("../../../Notifications"));
const SlackMessageModels_1 = require("../../../../SlackModels/SlackMessageModels");
const __1 = __importDefault(require(".."));
describe('TripNotifications', () => {
    it('should send notification', () => __awaiter(void 0, void 0, void 0, function* () {
        const trip = {
            rider: {
                slackId: 2
            },
            department: {
                teamId: 'TCPCFU4RF'
            },
            departureTime: '2019-03-27T14:10:00.000Z',
            reason: 'It is approved'
        };
        const mockToken = 'X0Xb-2345676543-hnbgrtg';
        jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsBotOauthToken')
            .mockResolvedValue(mockToken);
        jest.spyOn(Notifications_1.default, 'getDMChannelId').mockResolvedValue('CG6BU8BG8');
        jest.spyOn(Notifications_1.default, 'notificationFields').mockReturnValue(new SlackMessageModels_1.SlackAttachmentField('Trip Date', trip.departureTime, true), new SlackMessageModels_1.SlackAttachmentField('Reason', trip.reason, true));
        jest.spyOn(Notifications_1.default, 'createDirectMessage').mockReturnValue({
            channelId: 'TCPCFU4RF',
            text: 'Hi! @kica Did you take this trip?',
            attachment: ['trip_completion', new SlackMessageModels_1.SlackAttachmentField('Reason', trip.reason, true)]
        });
        jest.spyOn(Notifications_1.default, 'sendNotification').mockReturnValue({});
        yield __1.default.sendCompletionNotification(trip, mockToken);
        expect(Notifications_1.default.sendNotification).toBeCalledTimes(1);
        expect(Notifications_1.default.notificationFields).toBeCalledWith(trip);
        expect(Notifications_1.default.getDMChannelId).toBeCalledWith(2, mockToken);
    }));
    it('should sendTripReminderNotifications', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockTrip = { department: { teamId: 1 } };
        jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsBotOauthToken').mockResolvedValue();
        jest.spyOn(__1.default, 'sendDriverReminderNotification').mockResolvedValue();
        jest.spyOn(__1.default, 'sendRiderReminderNotification').mockResolvedValue();
        yield __1.default.sendTripReminderNotifications(mockTrip);
        expect(__1.default.sendDriverReminderNotification).toBeCalled();
        expect(__1.default.sendRiderReminderNotification).toBeCalled();
    }));
    it('should sendDriverReminderNotification if driver has slackId', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockTrip = {
            driver: { user: { slackId: 'SlackUID' } },
            destination: { address: 'Kampala' },
            origin: { address: 'Mulago' },
            rider: { slackId: 'IDONSLA' }
        };
        jest.spyOn(Notifications_1.default, 'getDMChannelId').mockReturnValue({});
        jest.spyOn(Notifications_1.default, 'createDirectMessage').mockReturnValue({});
        jest.spyOn(Notifications_1.default, 'sendNotification').mockReturnValue({});
        yield __1.default.sendDriverReminderNotification(mockTrip, 'token');
        expect(Notifications_1.default.sendNotification).toBeCalled();
    }));
    it('sendRiderReminderNotification', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockTrip = {
            driver: { user: null },
            destination: { address: 'Kampala' },
            origin: { address: 'Mulago' },
            rider: { slackId: 'IDONSLA' }
        };
        jest.spyOn(Notifications_1.default, 'getDMChannelId').mockReturnValue({});
        jest.spyOn(Notifications_1.default, 'createDirectMessage').mockReturnValue({});
        jest.spyOn(Notifications_1.default, 'sendNotification').mockReturnValue({});
        yield __1.default.sendRiderReminderNotification(mockTrip, 'token');
        expect(Notifications_1.default.sendNotification).toBeCalled();
    }));
});
//# sourceMappingURL=TripNotifications.spec.js.map