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
require("@slack/client");
const web_socket_event_service_1 = __importDefault(require("../../events/web-socket-event.service"));
const app_1 = __importDefault(require("../../../app"));
const errorHandler_1 = __importDefault(require("../../../helpers/errorHandler"));
const utils_1 = __importDefault(require("../../../utils"));
const database_1 = __importDefault(require("../../../database"));
const twilio_mocks_1 = require("../../notifications/whatsapp/twilio.mocks");
const trip_events_handlers_1 = __importDefault(require("../../events/trip-events.handlers"));
const socket_ioMock_1 = __importDefault(require("../../slack/__mocks__/socket.ioMock"));
twilio_mocks_1.mockWhatsappOptions();
const errorMessage = 'Validation error occurred, see error object for details';
let validToken;
beforeAll(() => {
    jest.spyOn(trip_events_handlers_1.default, 'getSocketService').mockImplementationOnce(() => (new web_socket_event_service_1.default(socket_ioMock_1.default)));
    validToken = utils_1.default.generateToken('30m', { userInfo: { roles: ['Super Admin'] } });
    jest.mock('@slack/client', () => ({
        WebClient: jest.fn(() => ({
            users: {
                lookupByEmail: jest.fn(() => ({
                    user: {
                        id: 'TEST123',
                        profile: {
                            real_name: 'Test buddy 1',
                            email: 'test.buddy1@andela.com'
                        }
                    }
                }))
            }
        }))
    }));
});
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield database_1.default.close();
}));
describe('/User create', () => {
    it('should respond with a no email provided error', (done) => {
        supertest_1.default(app_1.default)
            .post('/api/v1/users')
            .send({
            slackUrl: 'ACME.slack.com'
        })
            .set({
            Accept: 'application/json',
            authorization: validToken
        })
            .expect(400, {
            success: false,
            message: errorMessage,
            error: { email: 'Please provide email' }
        }, done());
    });
    it('should respond with invalid email and slack url', (done) => {
        supertest_1.default(app_1.default)
            .post('/api/v1/users')
            .set({
            Accept: 'application/json',
            authorization: validToken
        })
            .send({
            email: 'sjnvdsd.com'
        })
            .expect(400, {
            success: false,
            message: errorMessage,
            error: {
                slackUrl: 'Please provide slackUrl',
                email: 'please provide a valid email address'
            }
        }, done());
    });
    it('should respond with an incomplete info message', (done) => {
        supertest_1.default(app_1.default)
            .post('/api/v1/users')
            .set({
            Accept: 'application/json',
            authorization: validToken
        })
            .send({
            email: 'unKnownEmail@test.com'
        })
            .expect(400, {
            success: false,
            message: errorMessage,
            error: { slackUrl: 'Please provide slackUrl' }
        }, done());
    });
    it('should respond with invalid slackUrl', (done) => {
        supertest_1.default(app_1.default)
            .post('/api/v1/users')
            .set({
            Accept: 'application/json',
            authorization: validToken
        })
            .send({
            email: 'unKnownEmail@test.com',
            slackUrl: 'ACME.sack.co'
        })
            .expect(400, {
            success: false,
            message: errorMessage,
            error: { slackUrl: 'please provide a valid slackUrl' }
        }, done());
    });
    it("should respond with can't find slack team", (done) => {
        supertest_1.default(app_1.default)
            .post('/api/v1/users')
            .set({
            Accept: 'application/json',
            authorization: validToken
        })
            .send({
            email: 'me.them@andela.com',
            slackUrl: 'ACM.slack.com'
        })
            .expect(404, {
            success: false,
            message: 'Slack team not found'
        }, done());
    });
    it('should respond success for existing user', (done) => {
        supertest_1.default(app_1.default)
            .post('/api/v1/users')
            .set({
            Accept: 'application/json',
            authorization: validToken
        })
            .send({
            email: 'test.buddy1@andela.com',
            slackUrl: 'ACME.slack.com'
        })
            .expect(200, done());
    });
});
jest.mock('@slack/client', () => ({
    WebClient: jest.fn(() => ({
        users: {
            lookupByEmail: jest.fn(() => ({
                user: {
                    id: 'TEST123456',
                    profile: {
                        real_name: 'newuser',
                        email: 'newuser@gmail.com'
                    }
                }
            }))
        }
    }))
}));
describe('/User create user who does not exist', () => {
    it('should respond success for non existing user', (done) => {
        supertest_1.default(app_1.default)
            .post('/api/v1/users')
            .set('Authorization', validToken)
            .send({
            email: 'newuser@gmail.com',
            slackUrl: 'ACME.slack.com'
        })
            .expect(200, done());
    });
    it('should return an error', () => __awaiter(void 0, void 0, void 0, function* () {
        const error = new errorHandler_1.default('error');
        expect(error.message).toEqual('error');
    }));
    it('should return an error', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = {
            status: jest.fn(() => ({
                json: jest.fn(() => { })
            })),
        };
        const error = { message: 'error' };
        const response = errorHandler_1.default.sendErrorResponse(error, res);
        expect(response).toBeUndefined();
    }));
});
//# sourceMappingURL=createNewUser.spec.js.map