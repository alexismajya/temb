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
const ScheduleTripController_1 = __importDefault(require("../ScheduleTripController"));
const UserInputValidator_1 = __importDefault(require("../../../../helpers/slack/UserInputValidator"));
const Validators_1 = __importDefault(require("../../../../helpers/slack/UserInputValidator/Validators"));
const dateHelper_1 = __importDefault(require("../../../../helpers/dateHelper"));
const SlackInteractions_mock_1 = require("../../SlackInteractions/__mocks__/SlackInteractions.mock");
const slackHelpers_1 = __importDefault(require("../../../../helpers/slack/slackHelpers"));
const trip_detail_service_1 = __importDefault(require("../../../trips/trip-detail.service"));
const trip_service_1 = __importDefault(require("../../../trips/trip.service"));
const homebase_service_1 = require("../../../homebases/homebase.service");
const teamDetails_service_1 = require("../../../teamDetails/teamDetails.service");
jest.mock('@slack/client', () => ({
    WebClient: jest.fn(() => ({
        users: {
            info: jest.fn(() => Promise.resolve({
                user: { real_name: 'someName', profile: { email: 'someemial@email.com' } },
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
        }
    }))
}));
const err = new Error('Dummy error');
const rejectMock = jest.fn(() => Promise.reject(err));
describe('Test PassedStatus Method', () => {
    const payload = SlackInteractions_mock_1.createPayload();
    beforeEach(() => {
        jest.spyOn(Validators_1.default, 'checkDateTimeIsHoursAfterNow').mockReturnValue([]);
        jest.spyOn(UserInputValidator_1.default, 'validatePickupDestinationEntry').mockResolvedValue([]);
        jest.spyOn(Validators_1.default, 'validateDialogSubmission').mockReturnValue([]);
        jest.spyOn(UserInputValidator_1.default, 'validateLocationEntries').mockReturnValue([]);
        jest.spyOn(UserInputValidator_1.default, 'validateDateAndTimeEntry').mockResolvedValue([]);
        jest.spyOn(UserInputValidator_1.default, 'validateTravelFormSubmission').mockReturnValue([]);
    });
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    it('should test PassedStatus Method when status is "pickup"', () => __awaiter(void 0, void 0, void 0, function* () {
        const { submission } = payload;
        const travelDateTime = submission.flightDateTime;
        const result = yield ScheduleTripController_1.default
            .passedStatus(submission, payload, 'pickup', travelDateTime, 'flightDateTime', 3);
        expect(result.length).toBe(0);
    }));
    it('should test PassedStatus Method when status is "destination"', () => __awaiter(void 0, void 0, void 0, function* () {
        const { submission } = payload;
        const travelDateTime = submission.flightDateTime;
        const result = yield ScheduleTripController_1.default
            .passedStatus(submission, payload, 'destination', travelDateTime, 'flightDateTime', 3);
        expect(result.length).toBe(0);
    }));
    it('should test PassedStatus Method when status is "standard"', () => __awaiter(void 0, void 0, void 0, function* () {
        const { submission } = payload;
        const travelDateTime = submission.flightDateTime;
        const result = yield ScheduleTripController_1.default
            .passedStatus(submission, payload, 'standard', travelDateTime, 'flightDateTime', 3);
        expect(result.length).toBe(0);
    }));
});
describe('ScheduleTripController Tests', () => {
    describe('validateTripDetailsForm', () => {
        let payload;
        beforeEach(() => {
            payload = SlackInteractions_mock_1.createPayload();
            jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsBotOauthToken').mockResolvedValue('xxxx');
            jest.spyOn(UserInputValidator_1.default, 'fetchUserInformationFromSlack').mockResolvedValue({ tz_offset: 1000 });
        });
        it('should return date validation errors if they exist for pickup dialog', () => __awaiter(void 0, void 0, void 0, function* () {
            const errors = yield ScheduleTripController_1.default.validateTripDetailsForm(payload, 'pickup');
            expect(errors.length).toEqual(1);
            expect(errors).toContainEqual({ name: 'dateTime', error: 'Date cannot be in the past.' });
        }));
        it('should return date validation errors if they exist for destination dialog', () => __awaiter(void 0, void 0, void 0, function* () {
            Validators_1.default.validateDialogSubmission = jest.fn(() => []);
            UserInputValidator_1.default.validateLocationEntries = jest.fn(() => []);
            UserInputValidator_1.default.validateDateAndTimeEntry = jest.fn(() => []);
            UserInputValidator_1.default
                .validatePickupDestinationLocationEntries = jest.fn(() => []);
            const errors = yield ScheduleTripController_1.default.validateTripDetailsForm('payload', 'destination');
            expect(errors.length).toEqual(0);
        }));
        it('should return an empty array if no errors in submission for destination', () => __awaiter(void 0, void 0, void 0, function* () {
            UserInputValidator_1.default.validateLocationEntries = jest.fn(() => []);
            UserInputValidator_1.default.validateDateAndTimeEntry = jest.fn(() => []);
            const errors = yield ScheduleTripController_1.default.validateTripDetailsForm(payload, 'destination');
            expect(errors.length).toEqual(0);
        }));
        it('should throw an error', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                UserInputValidator_1.default.validateDateAndTimeEntry = rejectMock;
                yield ScheduleTripController_1.default.validateTripDetailsForm('payload', 'pickup');
            }
            catch (e) {
                expect(e).toEqual(err);
            }
        }));
    });
    describe('getLocationIds', () => {
        afterAll(() => {
            jest.restoreAllMocks();
        });
        it('should return originId and destinationId', () => __awaiter(void 0, void 0, void 0, function* () {
            ScheduleTripController_1.default.createLocation = jest.fn(() => 2);
            const payload = SlackInteractions_mock_1.createPayload();
            const locationIds = yield ScheduleTripController_1.default.getLocationIds(payload.submission);
            expect(locationIds).toEqual({ originId: expect.any(Number), destinationId: expect.any(Number) });
        }));
        it('should return originId and destinationId for "Others"', () => __awaiter(void 0, void 0, void 0, function* () {
            ScheduleTripController_1.default.createLocation = jest.fn(() => 2);
            const tripData = SlackInteractions_mock_1.tripRequestDetails();
            tripData.pickup = 'Others';
            tripData.destination = 'Others';
            const locationIds = yield ScheduleTripController_1.default.getLocationIds(tripData);
            expect(locationIds).toEqual({ originId: expect.any(Number), destinationId: expect.any(Number) });
        }));
    });
    describe('createRequestObject', () => {
        beforeEach(() => {
            jest.spyOn(homebase_service_1.homebaseService, 'getHomeBaseBySlackId').mockResolvedValue({ id: 1, name: 'Nairobi' });
        });
        it('should return an object containing trip request details', () => __awaiter(void 0, void 0, void 0, function* () {
            ScheduleTripController_1.default.getLocationIds = jest.fn(() => 2);
            dateHelper_1.default.changeDateTimeFormat = jest.fn(() => '22/12/2018 22:00');
            const request = yield ScheduleTripController_1.default
                .createRequestObject(SlackInteractions_mock_1.tripRequestDetails(), { id: 4, slackId: 'XXXX' });
            expect(request).toHaveProperty('riderId', 4);
            expect(request).toHaveProperty('reason', SlackInteractions_mock_1.tripRequestDetails().reason);
            expect(request).toHaveProperty('homebaseId', 1);
        }));
        it('should return an object containing trip request details when "pickup" is Others', () => __awaiter(void 0, void 0, void 0, function* () {
            ScheduleTripController_1.default.getLocationIds = jest.fn(() => 2);
            dateHelper_1.default.changeDateTimeFormat = jest.fn(() => '22/12/2018 22:00');
            const tripData = SlackInteractions_mock_1.tripRequestDetails();
            tripData.pickup = 'Others';
            tripData.destination = 'Others';
            const request = yield ScheduleTripController_1.default
                .createRequestObject(tripData, {
                id: 4
            });
            expect(request).toHaveProperty('riderId', 4);
            expect(request).toHaveProperty('reason', SlackInteractions_mock_1.tripRequestDetails().reason);
        }));
        it('should throw an error', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                ScheduleTripController_1.default.getLocationIds = rejectMock;
                yield ScheduleTripController_1.default
                    .createRequestObject(SlackInteractions_mock_1.tripRequestDetails(), { id: 4 });
            }
            catch (e) {
                expect(e).toEqual(err);
            }
        }));
    });
    describe('createRequest', () => {
        let payload;
        beforeEach(() => {
            payload = SlackInteractions_mock_1.createPayload();
            jest.spyOn(homebase_service_1.homebaseService, 'getHomeBaseBySlackId').mockResolvedValue({ id: 1, name: 'Nairobi' });
        });
        it('should return an object with details of the trip to persist', () => __awaiter(void 0, void 0, void 0, function* () {
            slackHelpers_1.default.findOrCreateUserBySlackId = jest.fn(() => 4);
            slackHelpers_1.default.getUserInfoFromSlack = jest.fn(() => 4);
            jest.spyOn(slackHelpers_1.default, 'getUserInfoFromSlack')
                .mockResolvedValue({ tz: 'Africa/Lagos' });
            ScheduleTripController_1.default.createRequestObject = jest.fn(() => SlackInteractions_mock_1.tripRequestDetails());
            const request = yield ScheduleTripController_1.default
                .createRequest(payload, payload.submission);
            expect(request).toHaveProperty('riderId', 4);
            expect(request).toHaveProperty('reason', SlackInteractions_mock_1.tripRequestDetails().reason);
        }));
        it('should return an object with details of the trip to persist when forMe is false', () => __awaiter(void 0, void 0, void 0, function* () {
            payload.submission.forMe = false;
            slackHelpers_1.default.findOrCreateUserBySlackId = jest.fn(() => ({ id: 4 }));
            ScheduleTripController_1.default.createRequestObject = jest.fn(() => SlackInteractions_mock_1.tripRequestDetails());
            const request = yield ScheduleTripController_1.default
                .createRequest(payload, payload.submission);
            expect(slackHelpers_1.default.findOrCreateUserBySlackId).toBeCalledTimes(2);
            expect(request).toHaveProperty('riderId', 4);
            expect(request).toHaveProperty('reason', SlackInteractions_mock_1.tripRequestDetails().reason);
        }));
    });
});
describe('Create trip Detail test', () => {
    beforeAll(() => {
        jest.clearAllMocks();
    });
    it('should create TripDetail', () => __awaiter(void 0, void 0, void 0, function* () {
        const tripInfo = {
            riderPhoneNo: '900009',
            travelTeamPhoneNo: '900009',
            flightNumber: '9AA09'
        };
        const result = yield ScheduleTripController_1.default.createTripDetail(tripInfo);
        expect(result).toHaveProperty('createdAt');
        expect(result).toHaveProperty('updatedAt');
        expect(result).toHaveProperty('id');
    }));
    it("should throw an error when tripDetail isn't created", () => __awaiter(void 0, void 0, void 0, function* () {
        const tripInfo = {
            riderPhoneNo: '',
            travelTeamPhoneNo: '',
            flightNumber: ''
        };
        jest.spyOn(trip_detail_service_1.default, 'createDetails')
            .mockImplementation(() => { throw err; });
        try {
            yield ScheduleTripController_1.default.createTripDetail(tripInfo);
        }
        catch (error) {
            expect(error).toEqual(err);
        }
    }));
});
describe('Create Travel Trip request test', () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    it('should create trip request', () => __awaiter(void 0, void 0, void 0, function* () {
        const createRequestSpy = jest.spyOn(ScheduleTripController_1.default, 'createRequest')
            .mockResolvedValue({ trip: 'Lekki' });
        const createTripDetailSpy = jest.spyOn(ScheduleTripController_1.default, 'createTripDetail')
            .mockResolvedValue({ id: 12 });
        const createTripRequestSpy = jest.spyOn(trip_service_1.default, 'createRequest')
            .mockResolvedValue({ id: 1 });
        const getByIdSpy = jest.spyOn(trip_service_1.default, 'getById')
            .mockResolvedValue({ id: 'data', newPayload: 'payload' });
        const payload = SlackInteractions_mock_1.createPayload();
        const result = yield ScheduleTripController_1.default.createTravelTripRequest(payload, {});
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('newPayload');
        expect(createRequestSpy).toBeCalledTimes(1);
        expect(createTripDetailSpy).toBeCalledTimes(1);
        expect(createTripRequestSpy).toBeCalledTimes(1);
        expect(getByIdSpy).toBeCalledTimes(1);
    }));
    it('should throw an error', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(ScheduleTripController_1.default, 'createRequest')
            .mockImplementation(() => { throw err; });
        const payload = SlackInteractions_mock_1.createPayload();
        try {
            yield ScheduleTripController_1.default.createTravelTripRequest(payload, 'trip');
        }
        catch (error) {
            expect(error).toEqual(new Error('Dummy error'));
        }
    }));
    describe('Validate travel form test', () => {
        const errorMock = [{ boy: 'bou' }];
        it('should test validateTravelContactDetails Method', () => {
            UserInputValidator_1.default.validateTravelContactDetails = jest.fn(() => (errorMock));
            const result = ScheduleTripController_1.default.validateTravelContactDetailsForm('payload');
            expect(result).toEqual(errorMock);
        });
        it('should test validateTravelDetailsForm Method', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(ScheduleTripController_1.default, 'passedStatus').mockResolvedValue([]);
            UserInputValidator_1.default.validateLocationEntries = jest.fn(() => errorMock);
            UserInputValidator_1.default.validateDateAndTimeEntry = jest.fn(() => errorMock);
            const payload = SlackInteractions_mock_1.createPayload();
            const result = yield ScheduleTripController_1.default.validateTravelDetailsForm(payload, 'embassy');
            expect(result.length).toBe(0);
        }));
        it('should test validateTravelDetailsForm Method for embassy visit', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(ScheduleTripController_1.default, 'passedStatus').mockResolvedValue([]);
            UserInputValidator_1.default.validateLocationEntries = jest.fn(() => errorMock);
            UserInputValidator_1.default.validateDateAndTimeEntry = jest.fn(() => errorMock);
            const payload = SlackInteractions_mock_1.createPayload();
            const result = yield ScheduleTripController_1.default.validateTravelDetailsForm(payload, 'embassy');
            expect(result.length).toBe(0);
        }));
        it('should test validateTravelDetailsForm Method for flight date Time', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(ScheduleTripController_1.default, 'passedStatus').mockResolvedValue([]);
            UserInputValidator_1.default.validateLocationEntries = jest.fn(() => errorMock);
            UserInputValidator_1.default.validateDateAndTimeEntry = jest.fn(() => errorMock);
            const payload = SlackInteractions_mock_1.createPayload();
            delete payload.submission.flightDateTime;
            const result = yield ScheduleTripController_1.default.validateTravelDetailsForm(payload, 'flight');
            expect(result.length).toBe(0);
        }));
        it('should test validateTravelDetailsForm', () => __awaiter(void 0, void 0, void 0, function* () {
            UserInputValidator_1.default.validateTravelDetailsForm = jest.fn(() => {
                throw new Error('Not working');
            });
            UserInputValidator_1.default.validateDateAndTimeEntry = jest.fn(() => errorMock);
            jest.spyOn(Validators_1.default, 'checkDateTimeIsHoursAfterNow').mockResolvedValue(errorMock);
            try {
                yield ScheduleTripController_1.default.validateTravelDetailsForm('payload');
            }
            catch (error) {
                expect(error.message).toEqual("Cannot read property 'flightDateTime' of undefined");
            }
        }));
    });
});
//# sourceMappingURL=scheduleTripController.spec.js.map