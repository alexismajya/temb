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
const web_socket_event_service_1 = __importDefault(require("../../../../events/web-socket-event.service"));
const teamDetails_service_1 = require("../../../../teamDetails/teamDetails.service");
const SlackInteractionsHelpers_1 = __importDefault(require("../SlackInteractionsHelpers"));
const OpsTripActions_1 = __importDefault(require("../../../TripManagement/OpsTripActions"));
const OpsDialogPrompts_1 = __importDefault(require("../../../SlackPrompts/OpsDialogPrompts"));
const trip_service_1 = __importDefault(require("../../../../trips/trip.service"));
const twilio_mocks_1 = require("../../../../notifications/whatsapp/twilio.mocks");
const trip_events_handlers_1 = __importDefault(require("../../../../events/trip-events.handlers"));
const socket_ioMock_1 = __importDefault(require("../../../__mocks__/socket.ioMock"));
twilio_mocks_1.mockWhatsappOptions();
describe('SlackHelpers', () => {
    let payload;
    beforeEach(() => {
        payload = {
            actions: [{
                    value: '123'
                }]
        };
        jest.spyOn(trip_events_handlers_1.default, 'getSocketService').mockImplementationOnce(() => (new web_socket_event_service_1.default(socket_ioMock_1.default)));
    });
    describe('handleOpsSelectAction', () => {
        jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsBotOauthToken').mockReturnValue('token');
        jest.spyOn(OpsTripActions_1.default, 'sendUserCancellation').mockReturnValue({});
        jest.spyOn(OpsDialogPrompts_1.default, 'selectDriverAndCab').mockResolvedValue({});
        jest.spyOn(SlackInteractionsHelpers_1.default, 'handleSelectProviderAction').mockReturnValue({});
        it('should send  User Cancellation notification', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(trip_service_1.default, 'getById').mockReturnValue({ tripStatus: 'Cancelled' });
            yield SlackInteractionsHelpers_1.default.handleOpsSelectAction('Cancelled', 1, 'TEAM', 'UGHA', 2, '1223453', payload);
            expect(OpsTripActions_1.default.sendUserCancellation).toBeCalled();
        }));
        it('should send selectDriverAndCab dialog', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(trip_service_1.default, 'getById').mockReturnValue({ tripStatus: 'Confirmed' });
            yield SlackInteractionsHelpers_1.default.handleOpsSelectAction('assignCab', 1, 'TEAM', 'UGHA', 2, '1223453', payload);
            expect(OpsDialogPrompts_1.default.selectDriverAndCab).toBeCalled();
        }));
        it('should call handle Select ProviderAction', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(trip_service_1.default, 'getById').mockReturnValue({ tripStatus: 'Confirmed' });
            yield SlackInteractionsHelpers_1.default.handleOpsSelectAction('assignProvider', 1, 'TEAM', 'UGHA', 2, '1223453', payload);
            expect(SlackInteractionsHelpers_1.default.handleSelectProviderAction).toBeCalled();
        }));
    });
});
//# sourceMappingURL=index.spec.js.map