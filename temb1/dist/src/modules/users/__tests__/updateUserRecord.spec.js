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
const app_1 = __importDefault(require("../../../app"));
const utils_1 = __importDefault(require("../../../utils"));
const database_1 = __importDefault(require("../../../database"));
const user_service_1 = __importDefault(require("../user.service"));
const twilio_mocks_1 = require("../../notifications/whatsapp/twilio.mocks");
const teamDetails_service_1 = require("../../teamDetails/teamDetails.service");
const trip_events_handlers_1 = __importDefault(require("../../events/trip-events.handlers"));
const socket_ioMock_1 = __importDefault(require("../../slack/__mocks__/socket.ioMock"));
twilio_mocks_1.mockWhatsappOptions();
const errorMessage = 'Validation error occurred, see error object for details';
jest.mock('@slack/client', () => ({
    WebClient: jest.fn(() => ({
        users: {
            lookupByEmail: jest.fn((email) => ({
                user: {
                    id: `XXXXXXXXX_${email.splice(3)}`
                }
            })),
        }
    }))
}));
describe('/User update', () => {
    let validToken;
    let teamDetails;
    let johnSmith;
    let meYou;
    beforeAll((done) => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(trip_events_handlers_1.default, 'getSocketService').mockImplementationOnce(() => (new web_socket_event_service_1.default(socket_ioMock_1.default)));
        teamDetails = yield database_1.default.models.TeamDetails.create({
            teamUrl: 'https://userupdate.slack.com',
            teamId: 'UPDATE123',
            botId: 'XXXXXXX-UPDATE',
            botToken: 'XXXXXX-UPDATE',
            webhookConfigUrl: 'XXXXXXXXXXXXX',
            userId: 'XXXXXXXXXXXXX-UPDATE',
            opsChannelId: 'XXXXXXXXXXXXX',
            teamName: 'Fake Team',
            userToken: 'XXXXXXXXXXX',
        });
        ([johnSmith, meYou] = yield Promise.all([
            database_1.default.models.User.create({
                email: 'john.smith@gmail.com',
                slackId: 'UU1234_UPDATE',
                phoneNo: '+245679076542',
                name: 'User Update',
            }),
            database_1.default.models.User.create({
                email: 'me.you@test.com',
                slackId: 'UU1234_UPDATE_2',
                phoneNo: '+2456790765422',
                name: 'User Updates',
            })
        ]));
        jest.spyOn(user_service_1.default, 'getUserSlackInfo').mockImplementation((_, email) => ({
            user: {
                id: `U1234_${(email).slice(0, 4)}`
            }
        }));
        validToken = utils_1.default.generateToken('30m', { userInfo: { roles: ['Super Admin'] } });
        done();
    }), 10000);
    afterAll((done) => {
        database_1.default.close().then(done, done);
    });
    it('should return a not found error with wrong email', (done) => {
        supertest_1.default(app_1.default)
            .put('/api/v1/users')
            .send({
            email: 'unKnownEmail@test.com',
            slackUrl: teamDetails.teamUrl,
            newName: 'New name',
            newPhoneNo: '+2349023746389',
            newEmail: 'me.you@test.com',
        })
            .set({
            Accept: 'application/json',
            authorization: validToken
        })
            .expect(404, {
            success: false,
            message: 'User not found',
        }, done);
    });
    it('should respond with a no email provided error', (done) => {
        supertest_1.default(app_1.default)
            .put('/api/v1/users')
            .send({
            newName: 'New name',
            newPhoneNo: '+2349023746389',
            newEmail: 'me.you@test.com',
        })
            .set({
            Accept: 'application/json',
            authorization: validToken
        })
            .expect(400, {
            success: false,
            message: errorMessage,
            error: {
                slackUrl: 'Please provide slackUrl',
                email: 'Please provide email'
            }
        }, done);
    });
    it('should respond with invalid email', (done) => {
        supertest_1.default(app_1.default)
            .put('/api/v1/users')
            .send({
            email: 'sjnvdsd.com',
            newName: 'New name',
            newPhoneNo: '+2349023746389',
            newEmail: 'me.you@test.com',
        })
            .set({
            Accept: 'application/json',
            authorization: validToken
        })
            .expect(400, {
            success: false,
            message: errorMessage,
            error: {
                slackUrl: 'Please provide slackUrl',
                email: 'please provide a valid email address'
            }
        }, done);
    });
    it('should respond with an incomplete info message', (done) => {
        supertest_1.default(app_1.default)
            .put('/api/v1/users')
            .send({
            email: 'unKnownEmail@test.com',
        })
            .set({
            Accept: 'application/json',
            authorization: validToken
        })
            .expect(400, {
            success: false,
            message: errorMessage,
            error: {
                slackUrl: 'Please provide slackUrl',
                value: '"value" must contain at least one of [newEmail, newName, newPhoneNo]'
            }
        }, done);
    });
    it('should respond with invalid messages', (done) => {
        supertest_1.default(app_1.default)
            .put('/api/v1/users')
            .send({
            email: 'unKnownEmail@test.com',
            slackUrl: 'https://ACME.sack.co',
            newName: ':;new 89dcj=',
            newPhoneNo: '234902374638998242-#SV',
            newEmail: 'me.youtest.com',
        })
            .set({
            Accept: 'application/json',
            authorization: validToken
        })
            .expect(400, {
            success: false,
            message: errorMessage,
            error: {
                slackUrl: 'please provide a valid slackUrl',
                newEmail: 'please provide a valid email address',
                newName: 'please provide a valid newName',
                newPhoneNo: 'please provide a valid newPhoneNo'
            }
        }, done);
    });
    it('should respond success 1', (done) => {
        supertest_1.default(app_1.default)
            .put('/api/v1/users')
            .send({
            email: johnSmith.email,
            slackUrl: teamDetails.teamUrl,
            newName: 'New Name',
            newPhoneNo: '+2349782037189',
            newEmail: 'mess.you@test.com',
        })
            .set({
            Accept: 'application/json',
            authorization: validToken
        })
            .expect(200, done);
    });
    it('should respond success 2', (done) => {
        supertest_1.default(app_1.default)
            .put('/api/v1/users')
            .send({
            email: meYou.email,
            slackUrl: teamDetails.teamUrl,
            newName: 'New Name',
            newPhoneNo: '+2349782037171'
        })
            .set({
            Accept: 'application/json',
            authorization: validToken
        })
            .expect(200, done);
    });
    it('should respond success 3', (done) => {
        supertest_1.default(app_1.default)
            .put('/api/v1/users')
            .send({
            email: meYou.email,
            slackUrl: teamDetails.teamUrl,
            newEmail: 'me.you@test.com',
        })
            .set({
            Accept: 'application/json',
            authorization: validToken
        })
            .expect(200, done);
    });
    it('should respond with cannot find slack team', (done) => {
        jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsByTeamUrl').mockResolvedValue(null);
        supertest_1.default(app_1.default)
            .put('/api/v1/users')
            .send({
            email: meYou.email,
            slackUrl: 'ACM.slack.com',
            newName: 'New Name',
            newPhoneNo: '+2349782037189',
            newEmail: 'me.you@test.com',
        })
            .set({
            Accept: 'application/json',
            authorization: validToken
        })
            .expect(404, {
            success: false,
            message: 'Slack team not found',
        }, done);
    });
});
//# sourceMappingURL=updateUserRecord.spec.js.map