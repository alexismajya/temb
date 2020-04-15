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
const travel_controller_1 = require("../travel.controller");
const __mocks__1 = require("../__mocks__");
const actions_1 = __importDefault(require("../actions"));
const trip_events_handlers_1 = __importDefault(require("../../../../events/trip-events.handlers"));
const socket_ioMock_1 = __importDefault(require("../../../../slack/__mocks__/socket.ioMock"));
const { actionRespond, modalRespond, bugsnagErrorHelperMock, travelHelpersMock, cacheMock, interactionsMock, rescheduleHelperMock, newSlackHelpersMock, departmentServiceMock, dateDialogHelperMock, utilsMock, } = __mocks__1.dependencyMocks;
describe(travel_controller_1.TravelTripController, () => {
    let travelTripController;
    beforeEach(() => {
        travelTripController = new travel_controller_1.TravelTripController(bugsnagErrorHelperMock, travelHelpersMock, cacheMock, newSlackHelpersMock, interactionsMock, utilsMock, dateDialogHelperMock, departmentServiceMock, rescheduleHelperMock);
        jest.spyOn(trip_events_handlers_1.default, 'getSocketService').mockImplementationOnce(() => (new web_socket_event_service_1.default(socket_ioMock_1.default)));
    });
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    describe('TravelTripController.embassyVisit', () => {
        it('should send the embassy visit modal', (done) => __awaiter(void 0, void 0, void 0, function* () {
            yield travelTripController.createTravel(__mocks__1.embassyPayload);
            expect(cacheMock.save).toHaveBeenCalledTimes(1);
            expect(cacheMock.fetch).toHaveBeenCalledTimes(1);
            expect(interactionsMock.sendContactDetailsModal).toHaveBeenCalledTimes(1);
            expect(interactionsMock.sendContactDetailsModal).toHaveBeenCalledWith(__mocks__1.embassyPayload, __mocks__1.undefinedTripDetails, __mocks__1.isEditFalse);
            done();
        }));
    });
    describe('TravelTripController.cancel', () => {
        it('should cancel trip', (done) => {
            travelTripController.cancel(undefined, actionRespond);
            expect(interactionsMock.simpleTextResponse).toHaveBeenCalledTimes(1);
            expect(actionRespond).toHaveBeenCalledTimes(1);
            done();
        });
    });
    describe('TravelTripController.startTravelTripBooking', () => {
        it('should send travel start message', (done) => {
            travelTripController.startTravelTripBooking(__mocks__1.payload, actionRespond);
            expect(travelHelpersMock.getStartMessage).toHaveBeenCalledTimes(1);
            expect(actionRespond).toHaveBeenCalledTimes(1);
            done();
        });
    });
    describe('TravelTripController.confirmRequest', () => {
        it('should confirm travel request', (done) => __awaiter(void 0, void 0, void 0, function* () {
            cacheMock.fetch.mockResolvedValue({});
            yield travelTripController.confirmRequest(__mocks__1.payload, actionRespond);
            expect(cacheMock.fetch).toHaveBeenCalledTimes(1);
            expect(travelHelpersMock.processTripRequest).toHaveBeenCalledTimes(1);
            done();
        }));
        it('should not confirm travel request if cache fetch fails', (done) => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(cacheMock, 'fetch').mockRejectedValue(new Error());
            expect(travelTripController.confirmRequest(__mocks__1.payload, actionRespond)).rejects.toThrow();
            done();
        }));
    });
    describe('TravelTripController.addTripNotes', () => {
        it('should send modal to add notes', (done) => __awaiter(void 0, void 0, void 0, function* () {
            yield travelTripController.addTripNotes(__mocks__1.payload, actionRespond);
            expect(interactionsMock.sendAddNoteModal).toHaveBeenCalledTimes(1);
            expect(actionRespond).toHaveBeenCalledTimes(1);
            done();
        }));
    });
    describe(travel_controller_1.TravelTripController.prototype.getLocationInfo, () => {
        it('should get supplementary location info', (done) => __awaiter(void 0, void 0, void 0, function* () {
            cacheMock.fetch.mockResolvedValue({});
            yield travelTripController.getLocationInfo(__mocks__1.payload, actionRespond);
            expect(cacheMock.fetch).toHaveBeenCalledTimes(1);
            expect(interactionsMock.sendLocationModal).toHaveBeenCalledTimes(1);
            expect(actionRespond).toHaveBeenCalledTimes(1);
            done();
        }));
    });
    describe(travel_controller_1.TravelTripController.prototype.doneViewingTrip, () => {
        it('should handle done action', (done) => __awaiter(void 0, void 0, void 0, function* () {
            yield travelTripController.doneViewingTrip(__mocks__1.payload, actionRespond);
            expect(actionRespond).toHaveBeenCalledTimes(1);
            expect(travelHelpersMock.getCompletionResponse).toHaveBeenCalledTimes(1);
            done();
        }));
    });
    describe('TravelTripController.submitContactDetails', () => {
        it('should handle contact details modal submission', (done) => __awaiter(void 0, void 0, void 0, function* () {
            cacheMock.fetch.mockResolvedValueOnce(__mocks__1.cachedObject);
            yield travelTripController.submitContactDetails(__mocks__1.payload, {}, modalRespond, undefined);
            expect(newSlackHelpersMock.modalValidator).toHaveBeenCalledTimes(1);
            expect(cacheMock.fetch).toHaveBeenCalledTimes(1);
            expect(travelHelpersMock.getTripDetailsModal).toHaveBeenCalledWith(__mocks__1.payload, __mocks__1.tripDetails, __mocks__1.isEditFalse);
            expect(modalRespond.update).toHaveBeenCalledTimes(1);
            expect(cacheMock.save).toHaveBeenCalledTimes(1);
            done();
        }));
    });
    describe('TravelTripController.submitContactDetails', () => {
        it('should handle contact details modal submission', (done) => __awaiter(void 0, void 0, void 0, function* () {
            cacheMock.fetch.mockResolvedValueOnce(__mocks__1.cachedObject);
            yield travelTripController.submitContactDetails(__mocks__1.payload, {}, modalRespond, undefined);
            expect(newSlackHelpersMock.modalValidator).toHaveBeenCalledTimes(1);
            expect(cacheMock.fetch).toHaveBeenCalledTimes(1);
            expect(travelHelpersMock.getFlightDetailsModal).toHaveBeenCalledWith(__mocks__1.payload, __mocks__1.tripDetails, __mocks__1.isEditFalse);
            expect(modalRespond.update).toHaveBeenCalledTimes(1);
            expect(cacheMock.save).toHaveBeenCalledTimes(1);
            done();
        }));
    });
    describe(travel_controller_1.TravelTripController.prototype.submitTripDetails, () => {
        it('should handle trip detail modal submission', (done) => __awaiter(void 0, void 0, void 0, function* () {
            yield travelTripController.submitTripDetails(__mocks__1.payload, {}, modalRespond, __mocks__1.context);
            expect(newSlackHelpersMock.modalValidator).toHaveBeenCalledTimes(1);
            expect(modalRespond.clear).toHaveBeenCalledTimes(1);
            expect(utilsMock.removeHoursFromDate).toHaveBeenCalledTimes(1);
            expect(dateDialogHelperMock.transformDate).toHaveBeenCalledTimes(2);
            expect(cacheMock.save).toHaveBeenCalledTimes(1);
            expect(cacheMock.fetch).toHaveBeenCalledTimes(1);
            expect(travelHelpersMock.createTravelSummary).toHaveBeenCalledTimes(1);
            done();
        }));
    });
    describe('TravelTripController.submitFlightDetails', () => {
        it('should handle flight details modal submission', (done) => __awaiter(void 0, void 0, void 0, function* () {
            yield travelTripController.submitFlightDetails(__mocks__1.payload, {}, modalRespond, __mocks__1.context);
            expect(newSlackHelpersMock.modalValidator).toHaveBeenCalledTimes(1);
            expect(modalRespond.clear).toHaveBeenCalledTimes(1);
            expect(utilsMock.removeHoursFromDate).toHaveBeenCalledTimes(1);
            expect(dateDialogHelperMock.transformDate).toHaveBeenCalledTimes(2);
            expect(cacheMock.save).toHaveBeenCalledTimes(1);
            expect(cacheMock.fetch).toHaveBeenCalledTimes(1);
            expect(travelHelpersMock.createTravelSummary).toHaveBeenCalledTimes(1);
            done();
        }));
    });
    describe(travel_controller_1.TravelTripController.prototype.submitNotes, () => {
        let newPayload;
        beforeAll(() => {
            newPayload = Object.assign(Object.assign({}, __mocks__1.payload), { view: {
                    private_metadata: JSON.stringify('https://hooks.slack.com/actions/TNZ9397ST/866771506832/PkqOPLH7Wpb2OB5ENpgJPLVT'),
                } });
        });
        it('should handle note modal submission', (done) => __awaiter(void 0, void 0, void 0, function* () {
            cacheMock.fetch.mockResolvedValue({});
            yield travelTripController.submitNotes(newPayload, {}, modalRespond, __mocks__1.context);
            expect(cacheMock.fetch).toHaveBeenCalledTimes(2);
            expect(cacheMock.save).toHaveBeenCalledTimes(1);
            expect(modalRespond.clear).toHaveBeenCalledTimes(1);
            expect(travelHelpersMock.createTravelSummary).toHaveBeenCalledTimes(1);
            done();
        }));
    });
    describe(travel_controller_1.TravelTripController.prototype.submitLocationInfo, () => {
        let newPayload;
        beforeAll(() => {
            newPayload = Object.assign(Object.assign({}, __mocks__1.payload), { view: {
                    private_metadata: JSON.stringify('https://hooks.slack.com/actions/TNZ9397ST/866771506832/PkqOPLH7Wpb2OB5ENpgJPLVT'),
                } });
        });
        it('should handle location info modal submission', (done) => __awaiter(void 0, void 0, void 0, function* () {
            cacheMock.fetch.mockResolvedValue({});
            yield travelTripController.submitLocationInfo(newPayload, {}, modalRespond, undefined);
            expect(cacheMock.fetch).toHaveBeenCalledTimes(2);
            expect(cacheMock.save).toHaveBeenCalledTimes(1);
            expect(travelHelpersMock.processTripRequest).toHaveBeenCalledTimes(1);
            done();
        }));
    });
    describe('TravelTripController.handleItineraryActions', () => {
        let newPayload;
        beforeAll(() => {
            newPayload = Object.assign(Object.assign({}, __mocks__1.payload), { actions: [{
                        action_id: actions_1.default.viewTrip,
                        value: 2,
                    }] });
        });
        it('should view confirmed trip request', (done) => __awaiter(void 0, void 0, void 0, function* () {
            yield travelTripController.handleItineraryActions(newPayload, actionRespond);
            expect(actionRespond).toHaveBeenCalledTimes(1);
            done();
        }));
        it('should handle reschedule trip', (done) => __awaiter(void 0, void 0, void 0, function* () {
            newPayload.actions[0].action_id = actions_1.default.reschedule;
            yield travelTripController.handleItineraryActions(newPayload, modalRespond);
            expect(rescheduleHelperMock.sendTripRescheduleModal).toHaveBeenCalledTimes(1);
            done();
        }));
        it('should handle goodbye message', (done) => __awaiter(void 0, void 0, void 0, function* () {
            newPayload.actions[0].action_id = '';
            yield travelTripController.handleItineraryActions(newPayload, actionRespond);
            expect(interactionsMock.goodByeMessage).toHaveBeenCalledTimes(1);
            done();
        }));
    });
    describe('TravelTripController.airportTransfer', () => {
        it('should send the airport transfer modal', (done) => __awaiter(void 0, void 0, void 0, function* () {
            yield travelTripController.createTravel(__mocks__1.airportPayload);
            expect(cacheMock.save).toHaveBeenCalledTimes(1);
            expect(interactionsMock.sendContactDetailsModal).toHaveBeenCalledTimes(1);
            expect(interactionsMock.sendContactDetailsModal).toHaveBeenCalledTimes(1);
            done();
        }));
    });
    describe('TravelTripController.changeLocation', () => {
        it('should change location', (done) => __awaiter(void 0, void 0, void 0, function* () {
            yield travelTripController.changeLocation(__mocks__1.payload, actionRespond);
            expect(travelHelpersMock.changeLocation).toHaveBeenCalledTimes(1);
            expect(actionRespond).toHaveBeenCalledTimes(1);
            done();
        }));
    });
    describe('TravelTripController.selectLocation', () => {
        it('should select location', (done) => __awaiter(void 0, void 0, void 0, function* () {
            yield travelTripController.selectLocation(__mocks__1.payload, actionRespond);
            expect(travelHelpersMock.selectLocation).toHaveBeenCalledTimes(1);
            expect(actionRespond).toHaveBeenCalledTimes(1);
            done();
        }));
    });
    describe('TravelTripController.back', () => {
        let newPayload;
        beforeAll(() => {
            newPayload = Object.assign(Object.assign({}, __mocks__1.payload), { actions: [{
                        value: 'back_to_launch',
                    }] });
        });
        it('should handle startMessage', (done) => __awaiter(void 0, void 0, void 0, function* () {
            yield travelTripController.back(newPayload, actionRespond);
            expect(travelHelpersMock.getStartMessage).toHaveBeenCalledTimes(1);
            done();
        }));
        it('should return to default value when there is no back value provided', (done) => __awaiter(void 0, void 0, void 0, function* () {
            newPayload.actions[0].value = '';
            yield travelTripController.back(newPayload, actionRespond);
            done();
        }));
    });
});
//# sourceMappingURL=travel.controller.spec.js.map