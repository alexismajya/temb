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
const SlackMessageModels_1 = require("../../../../slack/SlackModels/SlackMessageModels");
const user_trip_booking_controller_1 = __importDefault(require("../user-trip-booking-controller"));
const user_trip_helpers_1 = __importDefault(require("../user-trip-helpers"));
const actions_1 = __importDefault(require("../actions"));
const interactions_1 = __importDefault(require("../interactions"));
const updatePastMessageHelper_1 = __importDefault(require("../../../../../helpers/slack/updatePastMessageHelper"));
const validators_1 = __importDefault(require("../validators"));
const location_helpers_1 = __importDefault(require("../../../helpers/location-helpers"));
const user_service_1 = __importDefault(require("../../../../users/user.service"));
const homebase_service_1 = require("../../../../homebases/homebase.service");
const schedule_trip_helpers_1 = __importDefault(require("../schedule-trip.helpers"));
const slack_helpers_1 = __importDefault(require("../../../helpers/slack-helpers"));
const slackHelpers_1 = __importDefault(require("../../../../../helpers/slack/slackHelpers"));
const cache_1 = __importDefault(require("../../../../shared/cache"));
const trip_helpers_1 = __importDefault(require("../trip.helpers"));
const department_service_1 = require("../../../../departments/department.service");
const trip_events_handlers_1 = __importDefault(require("../../../../events/trip-events.handlers"));
const socket_ioMock_1 = __importDefault(require("../../../../slack/__mocks__/socket.ioMock"));
describe('UserTripBookingController', () => {
    const response = jest.fn();
    response.error = jest.fn((arg) => (arg));
    const context = {
        homebase: {
            id: 3,
            name: 'Nairobi',
            channel: null,
            addressId: 1,
            locationId: 38
        },
        botToken: 'xoxb-BotToken'
    };
    const [payload, res] = [{
            actions: [{
                    action_id: actions_1.default.forMe,
                }],
            submission: {
                date: '2019-12-03',
                time: '23:09',
            },
            user: {
                id: 'UIS233',
                homebase: context.homebase
            },
            team: { id: 'UIS233' },
            response_url: 'http://url.com'
        }, response];
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    beforeEach(() => {
        jest.spyOn(cache_1.default, 'save').mockResolvedValue();
        jest.spyOn(homebase_service_1.homebaseService, 'getHomeBaseBySlackId').mockResolvedValue(1);
        jest.spyOn(trip_events_handlers_1.default, 'getSocketService').mockImplementationOnce(() => (new web_socket_event_service_1.default(socket_ioMock_1.default)));
    });
    describe('savePickupDetails', () => {
        beforeAll(() => {
            jest.spyOn(cache_1.default, 'saveObject').mockResolvedValue();
            jest.spyOn(slack_helpers_1.default, 'getUserInfo').mockResolvedValue({ tz: 'Africa/Nairobi' });
        });
        it('should run successfully if payload is valid', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(slack_helpers_1.default, 'modalValidator').mockImplementationOnce(() => ({}));
            yield user_trip_booking_controller_1.default.savePickupDetails(payload, payload.submission, res, context);
            expect(slack_helpers_1.default.modalValidator).toHaveBeenCalled();
        }));
        it('should send error message when payload is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            const data = Object.assign({}, payload);
            const error = { date: 'An unexpected error occured' };
            data.submission.pickup = 'Others';
            jest.spyOn(validators_1.default, 'validatePickUpSubmission').mockRejectedValue(error);
            jest.spyOn(slack_helpers_1.default, 'getUserInfo').mockImplementationOnce(() => ({
                tz: {}
            }));
            const pickupDetails = yield user_trip_booking_controller_1.default
                .savePickupDetails(payload, payload.submission, res, context);
            expect(pickupDetails).toEqual(error);
        }));
    });
    describe('startTripBooking', () => {
        it('should send start booking trip message', () => {
            user_trip_booking_controller_1.default.startTripBooking(payload, res);
            expect(res).toHaveBeenCalledTimes(1);
        });
    });
    describe('forMe', () => {
        it('should handle foSomeone', () => __awaiter(void 0, void 0, void 0, function* () {
            const newPayload = Object.assign(Object.assign({}, payload), { actions: [{
                        action_id: actions_1.default.forSomeone,
                    }] });
            yield user_trip_booking_controller_1.default.forMe(newPayload, res);
            expect(cache_1.default.save).toHaveBeenCalled();
        }));
        it('should handle forMe', () => __awaiter(void 0, void 0, void 0, function* () {
            const state = { origin: payload.response_url };
            jest.spyOn(interactions_1.default, 'sendTripReasonForm').mockResolvedValue();
            yield user_trip_booking_controller_1.default.forMe(payload, res);
            expect(interactions_1.default.sendTripReasonForm).toHaveBeenCalledWith(payload, state);
        }));
    });
    describe('saveRider', () => {
        it('should save a rider', () => __awaiter(void 0, void 0, void 0, function* () {
            const newPayload = Object.assign(Object.assign({}, payload), { actions: [Object.assign(Object.assign({}, payload.actions), { selected_user: 'HJYYU8II' })] });
            const state = { origin: newPayload.response_url };
            jest.spyOn(interactions_1.default, 'sendTripReasonForm').mockResolvedValue();
            jest.spyOn(slackHelpers_1.default, 'findOrCreateUserBySlackId').mockResolvedValueOnce(null);
            yield user_trip_booking_controller_1.default.saveRider(newPayload);
            expect(cache_1.default.save).toHaveBeenCalled();
            expect(interactions_1.default.sendTripReasonForm).toHaveBeenCalledWith(newPayload, state);
        }));
    });
    describe('handleReasonSubmit', () => {
        const newPayload = Object.assign(Object.assign({}, payload), { submission: {
                reason: 'Good reason'
            }, state: '{ "origin": "https://origin.com"}' });
        it('should handle reason dialog submission', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(updatePastMessageHelper_1.default, 'newUpdateMessage');
            yield user_trip_booking_controller_1.default.handleReasonSubmit(newPayload);
            expect(updatePastMessageHelper_1.default.newUpdateMessage).toHaveBeenCalled();
            expect(cache_1.default.save).toHaveBeenCalled();
        }));
        it('should throw error when reason submission is empty', () => __awaiter(void 0, void 0, void 0, function* () {
            newPayload.submission.reason = '';
            const result = yield user_trip_booking_controller_1.default.handleReasonSubmit(newPayload);
            expect(result).toBeDefined();
            expect(result.errors).toBeDefined();
            expect(result.errors[0].error).toBe('"reason" is not allowed to be empty');
        }));
        it('should send add passengers message if there is no submission', () => __awaiter(void 0, void 0, void 0, function* () {
            newPayload.submission = null;
            jest.spyOn(updatePastMessageHelper_1.default, 'newUpdateMessage');
            yield user_trip_booking_controller_1.default.handleReasonSubmit(newPayload);
            expect(updatePastMessageHelper_1.default.newUpdateMessage).toHaveBeenCalled();
        }));
    });
    describe('saveExtraPassengers', () => {
        beforeEach(() => {
            jest.spyOn(cache_1.default, 'fetch').mockResolvedValue({ forMe: true });
            jest.spyOn(department_service_1.departmentService, 'getDepartmentsForSlack')
                .mockResolvedValue([{ label: 'department', value: 22 }]);
        });
        it('should save extra passengers', () => __awaiter(void 0, void 0, void 0, function* () {
            const newPayload = Object.assign(Object.assign({}, payload), { actions: [Object.assign(Object.assign({}, payload.actions), { selected_option: { value: '2' } })] });
            jest.spyOn(user_service_1.default, 'getUserBySlackId').mockResolvedValue({ homebaseId: 1 });
            yield user_trip_booking_controller_1.default.saveExtraPassengers(newPayload, res);
            expect(cache_1.default.save).toHaveBeenCalled();
            expect(res).toHaveBeenCalled();
        }));
        it('should not add extra passengers', () => __awaiter(void 0, void 0, void 0, function* () {
            const newPayload = Object.assign(Object.assign({}, payload), { actions: [{
                        value: '0'
                    }] });
            jest.spyOn(user_service_1.default, 'getUserBySlackId').mockImplementation(() => ({ homebaseId: 1 }));
            yield user_trip_booking_controller_1.default.saveExtraPassengers(newPayload, res);
            expect(cache_1.default.save).toHaveBeenCalled();
            expect(res).toHaveBeenCalled();
        }));
    });
    describe('saveDepartment', () => {
        it('should save department', () => __awaiter(void 0, void 0, void 0, function* () {
            const newPayload = Object.assign(Object.assign({}, payload), { actions: [{
                        value: 22,
                        text: {
                            text: 'Finance'
                        }
                    }] });
            jest.spyOn(user_service_1.default, 'getUserBySlackId').mockResolvedValue(newPayload.user);
            jest.spyOn(cache_1.default, 'saveObject').mockImplementationOnce(() => ({}));
            jest.spyOn(interactions_1.default, 'sendPickupModal').mockResolvedValue(context.homebase.name, newPayload);
            yield user_trip_booking_controller_1.default.saveDepartment(newPayload);
            expect(interactions_1.default.sendPickupModal).toBeCalledWith(context.homebase.name, newPayload);
        }));
    });
    describe('sendDestination', () => {
        it('should send destination details dialog', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(cache_1.default, 'fetch').mockResolvedValue({ homeBaseName: 'Kampala' });
            jest.spyOn(interactions_1.default, 'sendDetailsForm').mockResolvedValue();
            yield user_trip_booking_controller_1.default.sendDestinations(payload);
        }));
    });
    describe('saveDestination', () => {
        const newPayload = Object.assign(Object.assign({}, payload), { submission: {
                destination: 'Nairobi',
                othersDestination: null
            } });
        beforeEach(() => {
            jest.spyOn(interactions_1.default, 'sendPostDestinationMessage').mockResolvedValue();
            jest.spyOn(cache_1.default, 'fetch').mockResolvedValue({ pickup: 'kigali', othersPickup: null, homeBaseName: 'Kampala' });
        });
        it('should save destination details', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(cache_1.default, 'saveObject').mockResolvedValue();
            jest.spyOn(location_helpers_1.default, 'getDestinationCoordinates').mockResolvedValue();
            yield user_trip_booking_controller_1.default.saveDestination(newPayload);
            expect(cache_1.default.saveObject).toHaveBeenCalled();
            expect(cache_1.default.fetch).toHaveBeenCalled();
        }));
        it('should fail to save destination when input is empty', () => __awaiter(void 0, void 0, void 0, function* () {
            const tripPayload = Object.assign({}, newPayload);
            tripPayload.submission.destination = '';
            const result = yield user_trip_booking_controller_1.default.saveDestination(tripPayload);
            expect(result.errors).toBeDefined();
            expect(result.errors[0].error).toBe('"destination" is not allowed to be empty');
        }));
        it('should fail to save when the trip has both origin and destination as one location', () => __awaiter(void 0, void 0, void 0, function* () {
            const tripPayload = Object.assign({}, newPayload);
            tripPayload.submission.destination = 'kigali';
            const result = yield user_trip_booking_controller_1.default.saveDestination(tripPayload);
            expect(result.errors).toBeDefined();
            expect(result.errors[0].error).toBe('Destination cannot be the same as origin');
        }));
        it('should not send post destination message if no submission', () => __awaiter(void 0, void 0, void 0, function* () {
            newPayload.submission = null;
            const result = yield user_trip_booking_controller_1.default.saveDestination(newPayload);
            expect(result).toHaveProperty('errors');
        }));
    });
    describe('updateState', () => {
        it('should update the state', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(updatePastMessageHelper_1.default, 'updateMessage').mockResolvedValue();
            yield user_trip_booking_controller_1.default.updateState([payload.response_url]);
            expect(updatePastMessageHelper_1.default.updateMessage)
                .toHaveBeenCalledWith([payload.response_url], { text: 'Noted' });
        }));
    });
    describe('cancel', () => {
        it('should send thank you message after cancel', () => __awaiter(void 0, void 0, void 0, function* () {
            yield user_trip_booking_controller_1.default.cancel(payload, res);
            expect(res).toHaveBeenCalled();
        }));
    });
    describe('back', () => {
        let newPayload;
        beforeAll(() => {
            newPayload = Object.assign(Object.assign({}, payload), { actions: [{
                        value: 'back_to_launch'
                    }] });
        });
        it('should go back to launch', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(homebase_service_1.homebaseService, 'getHomeBaseBySlackId').mockReturnValue({ id: 1, name: 'Nairobi', country: { name: 'Kenya' } });
            yield user_trip_booking_controller_1.default.back(newPayload, res);
            expect(res).toHaveBeenCalledWith(yield trip_helpers_1.default.getWelcomeMessage(payload.user.slackId));
        }));
        it('should go back to start trip booking message', () => __awaiter(void 0, void 0, void 0, function* () {
            newPayload.actions[0].value = actions_1.default.forMe;
            jest.spyOn(user_trip_booking_controller_1.default, 'startTripBooking').mockReturnValue();
            yield user_trip_booking_controller_1.default.back(newPayload, res);
            expect(user_trip_booking_controller_1.default.startTripBooking)
                .toHaveBeenCalledWith(newPayload, res);
        }));
        it('should go back to handle reason submission', () => __awaiter(void 0, void 0, void 0, function* () {
            newPayload.actions[0].value = actions_1.default.forSomeone;
            jest.spyOn(user_trip_booking_controller_1.default, 'handleReasonSubmit').mockReturnValue();
            yield user_trip_booking_controller_1.default.back(newPayload, res);
            expect(user_trip_booking_controller_1.default.handleReasonSubmit)
                .toHaveBeenCalledWith(newPayload, res);
        }));
        it('should go back to add extra passengers', () => __awaiter(void 0, void 0, void 0, function* () {
            newPayload.actions[0].value = actions_1.default.addExtraPassengers;
            yield user_trip_booking_controller_1.default.back(newPayload, res);
            expect(res).toHaveBeenCalledWith(user_trip_helpers_1.default.getAddPassengersMessage());
        }));
        it('should go back to add get department message', () => __awaiter(void 0, void 0, void 0, function* () {
            newPayload.actions[0].value = actions_1.default.getDepartment;
            jest.spyOn(user_trip_helpers_1.default, 'getDepartmentListMessage').mockResolvedValue();
            yield user_trip_booking_controller_1.default.back(newPayload, res);
            expect(res).toHaveBeenCalled();
        }));
        it('should send default value when there is no back value provided', () => __awaiter(void 0, void 0, void 0, function* () {
            newPayload.actions[0].value = '';
            yield user_trip_booking_controller_1.default.back(newPayload, res);
            expect(res).toHaveBeenCalledWith(new SlackMessageModels_1.SlackInteractiveMessage('Thank you for using Tembea'));
        }));
    });
    describe('confirmLocation', () => {
        const newPayload = Object.assign(Object.assign({}, payload), { actions: [{
                    action_id: actions_1.default.selectPickupLocation,
                    selected_option: {
                        text: {
                            text: 'Nairobi'
                        }
                    }
                }] });
        beforeEach(() => {
            jest.spyOn(user_trip_helpers_1.default, 'handleLocationVerfication')
                .mockResolvedValue('verification message');
            jest.spyOn(updatePastMessageHelper_1.default, 'newUpdateMessage').mockResolvedValue();
        });
        it('should confirm pickup location', () => __awaiter(void 0, void 0, void 0, function* () {
            yield user_trip_booking_controller_1.default.confirmLocation(newPayload);
            expect(updatePastMessageHelper_1.default.newUpdateMessage).toHaveBeenCalled();
        }));
        it('should confirm destination location', () => __awaiter(void 0, void 0, void 0, function* () {
            newPayload.actions[0].action_id = actions_1.default.selectDestinationLocation;
            yield user_trip_booking_controller_1.default.confirmLocation(newPayload);
            expect(updatePastMessageHelper_1.default.newUpdateMessage).toHaveBeenCalled();
        }));
    });
    describe('confirmTripRequest', () => {
        beforeEach(() => {
            jest.restoreAllMocks();
            jest.resetAllMocks();
            jest.spyOn(cache_1.default, 'fetch').mockResolvedValue({});
            jest.spyOn(slackHelpers_1.default, 'findOrCreateUserBySlackId').mockResolvedValue({
                id: 1, slackId: 'U1234'
            });
            jest.spyOn(homebase_service_1.homebaseService, 'getHomeBaseBySlackId')
                .mockResolvedValue({ id: 2, name: 'Lagos' });
        });
        it('should confirm trip request', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(schedule_trip_helpers_1.default, 'createTripRequest').mockResolvedValue();
            jest.spyOn(cache_1.default, 'delete').mockResolvedValue();
            yield user_trip_booking_controller_1.default.confirmTripRequest(payload, res);
            expect(cache_1.default.fetch).toHaveBeenCalledWith(expect.stringContaining(payload.user.id));
            expect(cache_1.default.delete).toHaveBeenCalledTimes(1);
            expect(schedule_trip_helpers_1.default.createTripRequest).toHaveBeenCalled();
        }));
        it('should fail when confirming trip request', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                jest.spyOn(schedule_trip_helpers_1.default, 'createTripRequest')
                    .mockRejectedValue(new Error('Create Request error'));
                yield user_trip_booking_controller_1.default.confirmTripRequest(payload, res);
            }
            catch (error) {
                expect(error).toBeDefined();
                expect(res).toHaveBeenCalled();
            }
        }));
    });
    describe('paymentRequest', () => {
        it('save payment request', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(user_trip_helpers_1.default, 'savePayment').mockResolvedValue();
            yield user_trip_booking_controller_1.default.paymentRequest(payload, res);
            expect(user_trip_helpers_1.default.savePayment).toHaveBeenCalled();
        }));
        it('should return errors when request fails', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(user_trip_helpers_1.default, 'savePayment').mockResolvedValue({ errors: 'error' });
            const result = yield user_trip_booking_controller_1.default.paymentRequest(payload, res);
            expect(user_trip_helpers_1.default.savePayment).toHaveBeenCalled();
            expect(result.errors).toBeDefined();
        }));
        it('respond if there is no submission', () => __awaiter(void 0, void 0, void 0, function* () {
            const newPayload = Object.assign(Object.assign({}, payload), { submission: undefined });
            jest.spyOn(user_trip_booking_controller_1.default, 'paymentRequest').mockResolvedValue();
            yield user_trip_booking_controller_1.default.paymentRequest(newPayload, res);
            expect(user_trip_booking_controller_1.default.paymentRequest).toHaveBeenCalled();
            expect(res).toHaveBeenCalledTimes(0);
        }));
    });
});
//# sourceMappingURL=user-trip-booking-controller.spec.js.map