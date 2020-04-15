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
const travel_helpers_1 = require("../travel.helpers");
const __mocks__1 = require("../__mocks__");
const trip_events_handlers_1 = __importDefault(require("../../../../events/trip-events.handlers"));
const socket_ioMock_1 = __importDefault(require("../../../../slack/__mocks__/socket.ioMock"));
const { homebaseServiceMock, addressServiceMock, newSlackHelpersMock, teamDetailsServiceMock, appEventsMock, cacheMock, tripServiceMock, tripDetailsServiceMock, userServiceMock, slackHelpersMock, } = __mocks__1.dependencyMocks;
describe(travel_helpers_1.TravelHelpers, () => {
    let travelHelpers;
    beforeEach(() => {
        travelHelpers = new travel_helpers_1.TravelHelpers(addressServiceMock, newSlackHelpersMock, homebaseServiceMock, slackHelpersMock, cacheMock, tripServiceMock, teamDetailsServiceMock, tripDetailsServiceMock, userServiceMock, appEventsMock);
        jest.spyOn(trip_events_handlers_1.default, 'getSocketService').mockImplementationOnce(() => (new web_socket_event_service_1.default(socket_ioMock_1.default)));
    });
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    describe('TravelHelpers.getStartMessage', () => {
        it('should get start message', (done) => __awaiter(void 0, void 0, void 0, function* () {
            const message = yield travelHelpers.getStartMessage('UJDGHF77');
            expect(newSlackHelpersMock.getHomeBaseMessage).toHaveBeenCalledTimes(1);
            expect(message).toEqual(__mocks__1.expectedBlocks);
            done();
        }));
    });
    describe(travel_helpers_1.TravelHelpers.prototype.getTripDetailsModal, () => {
        let newPayload;
        beforeAll(() => {
            newPayload = Object.assign(Object.assign({}, __mocks__1.payload), { view: {
                    private_metadata: JSON.stringify('https://hooks.slack.com/actions/TNZ9397ST/866771506832/PkqOPLH7Wpb2OB5ENpgJPLVT'),
                } });
        });
        it('should get trip details modal', (done) => __awaiter(void 0, void 0, void 0, function* () {
            const modal = yield travelHelpers.getTripDetailsModal(newPayload);
            expect(modal).toBeDefined();
            done();
        }));
        it('should get trip details modal when isEdit', (done) => __awaiter(void 0, void 0, void 0, function* () {
            const modal = yield travelHelpers.getTripDetailsModal(newPayload, __mocks__1.tripDetails, __mocks__1.isEditTrue);
            expect(modal).toBeDefined();
            done();
        }));
    });
    describe(travel_helpers_1.TravelHelpers.prototype.createTravelSummary, () => {
        it('should create travel summary', (done) => __awaiter(void 0, void 0, void 0, function* () {
            const summary = yield travelHelpers.createTravelSummary(__mocks__1.tripPayload, 'UX8083BH7');
            expect(summary).toEqual(__mocks__1.newExpectedPreview);
            done();
        }));
    });
    describe('TravelHelpers.processTripRequest', () => {
        it('should process trip requests', (done) => __awaiter(void 0, void 0, void 0, function* () {
            yield travelHelpers.processTripRequest(__mocks__1.tripPayload, { teamId: 'TD09WJ89', userId: 'U947HYT8' }, __mocks__1.payload.response_url);
            expect(teamDetailsServiceMock.getTeamDetailsBotOauthToken).toHaveBeenCalledTimes(1);
            expect(appEventsMock.broadcast).toHaveBeenCalledTimes(1);
            expect(userServiceMock.getUserBySlackId).toHaveBeenCalledTimes(2);
            expect(addressServiceMock.findOrCreateAddress).toHaveBeenCalledTimes(2);
            expect(tripDetailsServiceMock.createDetails).toHaveBeenCalledTimes(1);
            expect(tripServiceMock.createRequest).toHaveBeenCalledTimes(1);
            expect(cacheMock.save).toHaveBeenCalledTimes(1);
            done();
        }));
    });
    describe('TravelHelpers.sendRiderlocationConfirmNotification', () => {
        it('should send notification to rider to get location info', (done) => __awaiter(void 0, void 0, void 0, function* () {
            yield travelHelpers.sendRiderlocationConfirmNotification(__mocks__1.tripPayload);
            done();
        }));
    });
    describe('TripHelpers.cancelTrip', () => {
        const tripId = 4;
        it('should cancel booked trip', (done) => __awaiter(void 0, void 0, void 0, function* () {
            yield travelHelpers.cancelTrip(__mocks__1.payload, tripId);
            expect(tripServiceMock.getById).toHaveBeenCalledTimes(1);
            expect(appEventsMock.broadcast).toHaveBeenCalledTimes(1);
            done();
        }));
    });
    describe('TripHelpers.selectLocation', () => {
        it('should handle select location', (done) => __awaiter(void 0, void 0, void 0, function* () {
            yield travelHelpers.selectLocation(__mocks__1.payload);
            expect(userServiceMock.updateDefaultHomeBase).toHaveBeenCalledTimes(1);
            done();
        }));
    });
    describe('TripHelpers.changeLocation', () => {
        it('should handle change location', (done) => __awaiter(void 0, void 0, void 0, function* () {
            yield travelHelpers.changeLocation(__mocks__1.payload);
            expect(homebaseServiceMock.getAllHomebases).toHaveBeenCalledTimes(1);
            expect(homebaseServiceMock.getHomeBaseBySlackId).toHaveBeenCalledTimes(1);
            expect(homebaseServiceMock.filterHomebase).toHaveBeenCalledTimes(1);
            expect(newSlackHelpersMock.getNavBlock).toHaveBeenCalledTimes(1);
            done();
        }));
    });
    describe('TripHelpers.getFlightDetailsModal', () => {
        let newPayload;
        beforeAll(() => {
            newPayload = Object.assign(Object.assign({}, __mocks__1.payload), { view: {
                    private_metadata: JSON.stringify('https://hooks.slack.com/actions/TNZ9397ST/866771506832/PkqOPLH7Wpb2OB5ENpgJPLVT'),
                } });
        });
        it('should get flight details modal', (done) => __awaiter(void 0, void 0, void 0, function* () {
            yield travelHelpers.getFlightDetailsModal(newPayload);
            expect(homebaseServiceMock.getHomeBaseBySlackId).toHaveBeenCalledTimes(1);
            expect(addressServiceMock.getAddressListByHomebase).toHaveBeenCalledTimes(1);
            done();
        }));
    });
});
//# sourceMappingURL=travel.helpers.spec.js.map