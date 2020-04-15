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
const supertest_1 = __importDefault(require("supertest"));
const web_socket_event_service_1 = __importDefault(require("../../events/web-socket-event.service"));
const route_service_1 = require("../../routes/route.service");
const user_service_1 = __importDefault(require("../../users/user.service"));
const app_1 = __importDefault(require("../../../app"));
const SlackController_1 = __importDefault(require("../SlackController"));
const teamDetails_service_1 = require("../../teamDetails/teamDetails.service");
const responseHelper_1 = __importDefault(require("../../../helpers/responseHelper"));
const bugsnagHelper_1 = __importDefault(require("../../../helpers/bugsnagHelper"));
const errorHandler_1 = __importDefault(require("../../../helpers/errorHandler"));
const homebase_service_1 = require("../../homebases/homebase.service");
const slackHelpers_1 = __importDefault(require("../../../helpers/slack/slackHelpers"));
const SlackMessageModels_1 = require("../SlackModels/SlackMessageModels");
const route_events_handlers_1 = __importDefault(require("../../events/route-events.handlers"));
const twilio_mocks_1 = require("../../notifications/whatsapp/twilio.mocks");
const routeBatch_service_1 = require("../../routeBatches/routeBatch.service");
const travel_helpers_1 = __importDefault(require("../../new-slack/trips/travel/travel.helpers"));
const trip_events_handlers_1 = __importDefault(require("../../events/trip-events.handlers"));
const socket_ioMock_1 = __importDefault(require("../__mocks__/socket.ioMock"));
twilio_mocks_1.mockWhatsappOptions();
jest.mock('@slack/client', () => ({
    WebClient: jest.fn(() => ({
        chat: { postMessage: jest.fn(() => Promise.resolve(() => { })) },
        users: {
            info: jest.fn(() => Promise.resolve({
                user: { real_name: 'someName', profile: {} },
                token: 'sdf'
            })),
            profile: {
                get: jest.fn(() => Promise.resolve({
                    profile: {
                        tz_offset: 'someValue',
                        email: 'sekito.ronald@andela.com'
                    }
                }))
            }
        },
        conversations: {
            list: jest.fn().mockReturnValue({
                channels: [{
                        id: 'CE0F7SZNU',
                        name: 'tembea-magicians',
                        purpose: {
                            value: 'This channel is for workspace-wide communication and announcements.'
                        },
                    }]
            })
        }
    }))
}));
beforeEach(() => {
    jest.spyOn(trip_events_handlers_1.default, 'getSocketService').mockImplementationOnce(() => (new web_socket_event_service_1.default(socket_ioMock_1.default)));
});
describe(SlackController_1.default, () => {
    beforeEach(() => {
        jest.spyOn(homebase_service_1.homebaseService, 'getHomeBaseBySlackId').mockResolvedValue({ id: 1, name: 'Nairobi', country: { name: 'Kenya' } });
        jest.spyOn(slackHelpers_1.default, 'findOrCreateUserBySlackId').mockReturnValue({});
        jest.spyOn(travel_helpers_1.default, 'getStartMessage').mockResolvedValue('FJJFKKDJD');
    });
    it('should return launch message', (done) => {
        supertest_1.default(app_1.default)
            .post('/api/v1/slack/command')
            .end((err, res) => {
            expect(res.status).toEqual(200);
            expect(res.body).toHaveProperty('blocks');
        }, done());
    });
    it('should return the lunch message for the command /Tembea travel', () => __awaiter(void 0, void 0, void 0, function* () {
        yield supertest_1.default(app_1.default)
            .post('/api/v1/slack/command')
            .send({ text: 'travel' })
            .then((res) => {
            expect(res.status).toEqual(200);
            expect(res.body).toEqual(expect.any(String));
        });
    }));
    it('should return the lunch meassage for the command /Tembea route', () => __awaiter(void 0, void 0, void 0, function* () {
        yield supertest_1.default(app_1.default)
            .post('/api/v1/slack/command')
            .send({ text: 'route' })
            .then((res) => {
            expect(res.status).toEqual(200);
            expect(res.body).toHaveProperty('text');
            expect(res.body).toHaveProperty('attachments');
            expect(res.body).toHaveProperty('response_type');
        });
    }));
    describe('getChannels', () => {
        beforeEach(() => {
            jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsByTeamUrl').mockResolvedValue({
                botToken: 'xxxxxxx',
            });
        });
        it('should respond with a list slack channels', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield supertest_1.default(app_1.default)
                .get('/api/v1/slack/channels')
                .set('teamUrl', 'XXXXX');
            expect(res.status).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Request was successful');
            expect(res.body).toHaveProperty('data', [{
                    id: 'CE0F7SZNU',
                    name: 'tembea-magicians',
                    description: 'This channel is for workspace-wide communication and announcements.',
                }]);
        }));
        it('should fetch all channels on the workspace', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(responseHelper_1.default, 'sendResponse').mockReturnValue();
            const req = { query: {} };
            const res = { locals: { botToken: 'token' } };
            yield SlackController_1.default.getChannels(req, res);
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalled();
        }));
        it('should handle error occurence', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(bugsnagHelper_1.default, 'log').mockReturnValue();
            jest.spyOn(errorHandler_1.default, 'sendErrorResponse').mockReturnValue();
            const req = { query: {} };
            yield SlackController_1.default.getChannels(req, {});
            expect(bugsnagHelper_1.default.log).toHaveBeenCalled();
            expect(errorHandler_1.default.sendErrorResponse).toHaveBeenCalled();
        }));
        it('should not limit routes to only users with Nairobi Homebase', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(homebase_service_1.homebaseService, 'getHomeBaseBySlackId').mockResolvedValue({ id: 1, name: 'Kampala', country: { name: 'Uganda' } });
            expect(yield SlackController_1.default.getRouteCommandMsg()).toMatchObject({
                text: '>*`The route functionality is not supported for your current location`*'
                    .concat('\nThank you for using Tembea! See you again.')
            });
        }));
    });
});
describe(SlackController_1.default.leaveRoute, () => {
    it('should remove an engineer from a route', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(user_service_1.default, 'getUserBySlackId').mockResolvedValue({
            routeBatchId: 1, name: 'Route name', id: 2
        });
        jest.spyOn(user_service_1.default, 'updateUser').mockResolvedValue(null);
        jest.spyOn(routeBatch_service_1.routeBatchService, 'getRouteBatchByPk').mockResolvedValue({ routeId: 1 });
        jest.spyOn(route_service_1.routeService, 'getRouteById').mockResolvedValue({ name: 'Route name' });
        jest.spyOn(route_events_handlers_1.default, 'handleUserLeavesRouteNotification').mockResolvedValue();
        const payload = { user: { id: 'slackId' } };
        const result = yield SlackController_1.default.leaveRoute(payload);
        const slackMessage = new SlackMessageModels_1.SlackInteractiveMessage('Hey <@slackId>, You have successfully left '
            + 'the route `Route name`.');
        expect(result.text).toEqual(slackMessage.text);
    }));
    it('should throw an error while removing an engineer from a route', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(bugsnagHelper_1.default, 'log').mockReturnValue();
        jest.spyOn(user_service_1.default, 'getUserBySlackId').mockRejectedValue(new Error());
        const payload = { user: { id: 'uuuuucu' } };
        expect(SlackController_1.default.leaveRoute(payload)).rejects
            .toThrowError(expect.objectContaining({
            message: expect.stringContaining('Something went wrong'),
        }));
    }));
});
//# sourceMappingURL=SlackController.spec.js.map