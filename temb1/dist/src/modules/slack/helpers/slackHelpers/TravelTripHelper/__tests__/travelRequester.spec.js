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
const web_socket_event_service_1 = __importDefault(require("../../../../../events/web-socket-event.service"));
const Notifications_1 = __importDefault(require("../../../../SlackPrompts/Notifications"));
const cache_1 = __importDefault(require("../../../../../shared/cache"));
const locationsMapHelpers_1 = __importDefault(require("../../../../../../helpers/googleMaps/locationsMapHelpers"));
const index_1 = __importDefault(require("../index"));
const ScheduleTripController_1 = __importDefault(require("../../../../TripManagement/ScheduleTripController"));
const bugsnagHelper_1 = __importDefault(require("../../../../../../helpers/bugsnagHelper"));
const travelHelper_1 = __importDefault(require("../travelHelper"));
const trip_events_handlers_1 = __importDefault(require("../../../../../events/trip-events.handlers"));
const socket_ioMock_1 = __importDefault(require("../../../../__mocks__/socket.ioMock"));
describe('TravelTripHelper', () => {
    let payload;
    let respond;
    beforeEach(() => {
        jest.spyOn(trip_events_handlers_1.default, 'getSocketService').mockImplementationOnce(() => (new web_socket_event_service_1.default(socket_ioMock_1.default)));
        cache_1.default.save = jest.fn(() => { });
        respond = jest.fn();
        cache_1.default.fetch = jest.fn((id) => {
            if (id === 'TRAVEL_REQUEST_1') {
                return {
                    tripType: 'Airport Transfer',
                    departmentId: '',
                    departmentName: '',
                    contactDetails: '',
                    tripDetails: {
                        destination: 'home',
                        pickup: 'To Be Decided',
                        rider: 1
                    },
                    waitingRequester: 1
                };
            }
            return {};
        });
        payload = {
            user: { id: 1 },
            submission: {},
            actions: [{ name: '', value: 'pickup_travelBtn' }],
            team: { id: 'TEAMID1' }
        };
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe('getPickupType && getDestinationType', () => {
        it('Should call the location verify', () => __awaiter(void 0, void 0, void 0, function* () {
            const locationVerify = jest.spyOn(locationsMapHelpers_1.default, 'locationVerify').mockImplementation(() => Promise.resolve());
            yield travelHelper_1.default.getPickupType({ pickup: 'Others' }, respond);
            expect(locationVerify).toHaveBeenCalledWith({ pickup: 'Others' }, 'pickup', 'travel_trip');
        }));
        it('Should call the location verify', () => __awaiter(void 0, void 0, void 0, function* () {
            const locationVerify = jest.spyOn(locationsMapHelpers_1.default, 'locationVerify').mockImplementation(() => Promise.resolve(true));
            yield travelHelper_1.default.getDestinationType({ submission: { destination: 'Others' } }, respond);
            expect(locationVerify).toHaveBeenCalledWith({ destination: 'Others' }, 'destination', 'travel_trip');
            expect(respond).toHaveBeenCalled();
        }));
        it('Should thrown an error', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(bugsnagHelper_1.default, 'log');
            yield travelHelper_1.default.getDestinationType({ submission: { destination: 'Others' } }, respond);
            yield travelHelper_1.default.detailsConfirmation({ submission: { destination: 'Others' } }, respond);
            expect(respond).toHaveBeenCalled();
        }));
    });
    describe('validatePickupDestination', () => {
        let locationValidator;
        let travelResponce;
        it('should call sendRiderlocationConfirmNotification', () => __awaiter(void 0, void 0, void 0, function* () {
            const pickupData = {
                pickup: 'To Be Decided', teamID: '12345', userID: 'QWE7654T', rider: 'QW875TY'
            };
            const newData = {
                location: 'pickup', teamID: '12345', userID: 'QWE7654T', rider: 'QW875TY'
            };
            locationValidator = jest.spyOn(Notifications_1.default, 'sendRiderlocationConfirmNotification').mockImplementation(() => Promise.resolve());
            travelResponce = jest.spyOn(travelHelper_1.default, 'responseMessage');
            travelHelper_1.default.validatePickupDestination(pickupData, respond);
            expect(locationValidator).toHaveBeenCalledWith(newData, respond);
            expect(travelResponce).toHaveBeenCalled();
            expect(respond).toHaveBeenCalled();
        }));
        it('Should return destinatioin focused data', () => {
            const destinationData = {
                pickup: 'Andela Dojo', teamID: '12345', userID: 'QWE7654T', rider: 'QW875TY'
            };
            const newDestinationData = {
                location: 'destination', teamID: '12345', userID: 'QWE7654T', rider: 'QW875TY'
            };
            locationValidator = jest.spyOn(Notifications_1.default, 'sendRiderlocationConfirmNotification').mockImplementation(() => Promise.resolve());
            travelResponce = jest.spyOn(travelHelper_1.default, 'responseMessage');
            travelHelper_1.default.validatePickupDestination(destinationData, respond);
            expect(locationValidator).toHaveBeenCalledWith(newDestinationData, respond);
            expect(travelResponce).toHaveBeenCalled();
            expect(respond).toHaveBeenCalled();
        });
    });
    describe('requesterToBeDecidedNotification', () => {
        it('Should call fetch & respond', () => __awaiter(void 0, void 0, void 0, function* () {
            payload = {
                user: { id: 1 }, actions: [{ name: '', value: 'yay' }]
            };
            yield index_1.default.requesterToBeDecidedNotification(payload, respond);
            expect(respond).toHaveBeenCalled();
            payload = {
                user: { id: 1 }, actions: [{ name: '', value: 'not yay' }]
            };
            yield index_1.default.requesterToBeDecidedNotification(payload, respond);
            expect(cache_1.default.fetch).toHaveBeenCalled();
            expect(respond).toHaveBeenCalled();
        }));
    });
    describe('riderLocationConfirmation', () => {
        it('should call callRiderLocationConfirmation function', () => __awaiter(void 0, void 0, void 0, function* () {
            const callRiderLocationConfirmation = jest.spyOn(locationsMapHelpers_1.default, 'callRiderLocationConfirmation').mockImplementation(() => Promise.resolve());
            yield travelHelper_1.default.riderLocationConfirmation(payload, respond);
            expect(callRiderLocationConfirmation).toBeCalledWith(payload, respond, 'pickup');
            expect(respond).toHaveBeenCalled();
            payload.actions[0].value = 'cancel';
            yield travelHelper_1.default.riderLocationConfirmation(payload, respond);
            expect(respond).toHaveBeenCalled();
        }));
    });
    describe('completeTravelConfirmation', () => {
        it('Should call sendOperationsRiderlocationConfirmation', () => __awaiter(void 0, void 0, void 0, function* () {
            const scheduleTripControllerSpy = jest.spyOn(ScheduleTripController_1.default, 'createTravelTripRequest').mockImplementation(() => Promise.resolve());
            const sendOpsRiderlocationConfirmationSpy = jest.spyOn(Notifications_1.default, 'sendOperationsRiderlocationConfirmation').mockImplementation(() => Promise.resolve());
            const sendResponseToOpsSpy = jest.spyOn(index_1.default, 'sendCompletedResponseToOps').mockImplementation(() => Promise.resolve());
            yield index_1.default.completeTravelConfirmation(payload, respond);
            expect(scheduleTripControllerSpy).toHaveBeenCalled();
            expect(sendResponseToOpsSpy).toHaveBeenCalled();
            expect(sendOpsRiderlocationConfirmationSpy).toHaveBeenCalled();
        }));
        it('Should capture errors', () => __awaiter(void 0, void 0, void 0, function* () {
            cache_1.default.save = jest.fn().mockImplementation(() => {
                throw new Error('Dummy error');
            });
            bugsnagHelper_1.default.log = jest.fn().mockReturnValue({});
            yield index_1.default.completeTravelConfirmation(payload, respond);
            expect(bugsnagHelper_1.default.log).toHaveBeenCalled();
        }));
    });
});
//# sourceMappingURL=travelRequester.spec.js.map