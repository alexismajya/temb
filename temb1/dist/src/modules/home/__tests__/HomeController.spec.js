"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const request_promise_native_1 = __importDefault(require("request-promise-native"));
const web_socket_event_service_1 = __importDefault(require("../../events/web-socket-event.service"));
const app_1 = __importDefault(require("../../../app"));
const HomeController_1 = require("../HomeController");
const HomeControllerMock_1 = __importDefault(require("../__mocks__/HomeControllerMock"));
const twilio_mocks_1 = require("../../notifications/whatsapp/twilio.mocks");
const trip_events_handlers_1 = __importDefault(require("../../events/trip-events.handlers"));
const socket_ioMock_1 = __importDefault(require("../../slack/__mocks__/socket.ioMock"));
twilio_mocks_1.mockWhatsappOptions();
beforeEach(() => {
    jest.spyOn(trip_events_handlers_1.default, 'getSocketService').mockImplementationOnce(() => (new web_socket_event_service_1.default(socket_ioMock_1.default)));
});
const response = { body: JSON.stringify(HomeControllerMock_1.default) };
describe('Slack App Homepage Test', () => {
    it('should return a not found error when endpoint doesn\'t exist', (done) => {
        supertest_1.default(app_1.default)
            .get('/notAnApp')
            .expect(404)
            .end((err, res) => {
            expect(res.body.message).toBe('Not Found. Use /api/v1 or /api/v2 to access the api');
            done();
        });
    });
    it('should contain a title', (done) => {
        supertest_1.default(app_1.default)
            .get('/')
            .expect(200)
            .expect('Content-Type', 'text/html; charset=utf-8')
            .end((err, res) => {
            expect(res.text).toMatch('<title>Welcome to Tembea</title>');
            done();
        });
    });
    it('should redirect to the slack install url', (done) => {
        supertest_1.default(app_1.default)
            .get('/install')
            .expect(200)
            .expect('Content-Type', 'text/html; charset=utf-8')
            .end((err, res) => {
            expect(res.text).toMatch(`Found. Redirecting to ${HomeController_1.SlackInstallUrl}`);
            done();
        });
    });
    it('should render the privacy page with a title', (done) => {
        supertest_1.default(app_1.default)
            .get('/privacy')
            .expect(200)
            .expect('Content-Type', 'text/html; charset=utf-8')
            .end((err, res) => {
            expect(res.text).toMatch('Add to Slack');
            done();
        });
    });
    it('should render the support page with a title', (done) => {
        supertest_1.default(app_1.default)
            .get('/support')
            .expect(200)
            .expect('Content-Type', 'text/html; charset=utf-8')
            .end((err, res) => {
            expect(res.text).toMatch('Add to Slack');
            done();
        });
    });
});
jest.mock('request');
describe('GET /slackauth', () => {
    const mock = request_promise_native_1.default;
    beforeEach(() => {
        jest.restoreAllMocks();
    });
    it('should return an error message when a query is attached to the request', (done) => {
        mock.mockImplementation(() => response);
        supertest_1.default(app_1.default)
            .get('/slackauth')
            .expect(200)
            .expect('Content-Type', 'text/html; charset=utf-8')
            .end((err, res) => {
            expect(res.text).toMatch('Installation failed');
            done();
        });
    });
    it('should display a success message after successful adding slack to a workspace', (done) => {
        mock.mockImplementation(() => response);
        supertest_1.default(app_1.default)
            .get('/slackauth')
            .query({ code: 'boy hoy' })
            .expect(200)
            .expect('Content-Type', 'text/html; charset=utf-8')
            .end((err, res) => {
            expect(res.text).toMatch('Thank you for installing Tembea');
            done();
        });
    });
    it('should return an error message when request fails to install bot in workspace.', (done) => {
        mock.mockImplementationOnce(() => ({ body: JSON.stringify({ oks: 'false' }) }));
        supertest_1.default(app_1.default)
            .get('/slackauth')
            .query({ code: 'boy hoy' })
            .expect(200)
            .expect('Content-Type', 'text/html; charset=utf-8')
            .end((err, res) => {
            expect(res.text).toMatch('Tembea could not be installed in your workspace.');
            done();
        });
    });
    it('should display a success message when request fails due network issues', (done) => {
        const error = new Error('Dummy error');
        mock.mockImplementationOnce(() => Promise.reject(error));
        supertest_1.default(app_1.default)
            .get('/slackauth')
            .query({ code: 'boy hoy' })
            .expect(200)
            .expect('Content-Type', 'text/html; charset=utf-8')
            .end((err, res) => {
            expect(res.text).toMatch(error.message);
            done();
        });
    });
});
//# sourceMappingURL=HomeController.spec.js.map