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
const database_1 = __importDefault(require("../../../database"));
const slackHelpers_1 = __importDefault(require("../slackHelpers"));
const teamDetails_service_1 = require("../../../modules/teamDetails/teamDetails.service");
const WebClientSingleton_1 = __importDefault(require("../../../utils/WebClientSingleton"));
const __mocks__1 = require("../__mocks__");
const user_service_1 = __importDefault(require("../../../modules/users/user.service"));
const trip_service_1 = __importDefault(require("../../../modules/trips/trip.service"));
const cab_service_1 = require("../../../modules/cabs/cab.service");
const { models: { TripRequest, User } } = database_1.default;
const webClientMock = {
    users: {
        info: jest.fn(() => Promise.resolve({
            user: __mocks__1.slackUserMock,
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
};
describe('slackHelpers', () => {
    beforeEach(() => {
        jest.spyOn(WebClientSingleton_1.default, 'getWebClient').mockReturnValue(webClientMock);
        jest.spyOn(User, 'findOne').mockResolvedValue(__mocks__1.testUserFromDb);
        jest.spyOn(User, 'findByPk').mockResolvedValue(__mocks__1.testUserFromDb);
        jest.spyOn(User, 'findOrCreate').mockResolvedValue([{ dataValues: __mocks__1.testUserFromDb.dataValues }]);
        jest.spyOn(user_service_1.default, 'getUserBySlackId').mockResolvedValue(__mocks__1.testUserFromDb);
        jest.spyOn(TripRequest, 'findByPk').mockResolvedValue(__mocks__1.testTripFromDb);
    });
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    describe('fetchUserInformationFromSlack', () => {
        it('should call WebClientSingleton.getWebClient', () => __awaiter(void 0, void 0, void 0, function* () {
            const slackUser = yield slackHelpers_1.default.fetchUserInformationFromSlack('slackId', 'token');
            expect(typeof slackUser).toEqual('object');
            expect(slackUser).toEqual(__mocks__1.slackUserMock);
        }));
    });
    describe('getUserInfoFromSlack', () => {
        it('should return user info from slack', () => __awaiter(void 0, void 0, void 0, function* () {
            const slackId = 'U145';
            const teamId = 'TS14';
            const token = 'token';
            jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsBotOauthToken').mockResolvedValue(token);
            slackHelpers_1.default.fetchUserInformationFromSlack = jest
                .fn()
                .mockResolvedValue({ user: __mocks__1.slackUserMock });
            const slackUser = yield slackHelpers_1.default.getUserInfoFromSlack(slackId, teamId);
            expect(teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken).toBeCalledWith(teamId);
            expect(slackHelpers_1.default.fetchUserInformationFromSlack).toBeCalledWith(slackId, token);
            expect(slackUser).toBeInstanceOf(Object);
            expect(slackUser.user).toEqual(__mocks__1.slackUserMock);
        }));
    });
    describe('findOrCreateUserBySlackId', () => {
        const userId = 1;
        const teamId = 'U1GHSGS';
        const validUser = { id: teamId, email: 'tembea@andela.com' };
        beforeEach(() => {
            jest.spyOn(slackHelpers_1.default, 'getUserInfoFromSlack').mockResolvedValue(__mocks__1.slackUserMock);
            jest.spyOn(user_service_1.default, 'createNewUser').mockResolvedValue(validUser);
        });
        afterEach(() => {
            jest.clearAllMocks();
        });
        it('should create and return new user if user does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const nullUser = undefined;
            jest.spyOn(user_service_1.default, 'getUserBySlackId').mockResolvedValue(nullUser);
            const user = yield slackHelpers_1.default.findOrCreateUserBySlackId(userId, teamId);
            expect(user_service_1.default.getUserBySlackId).toBeCalledWith(userId);
            expect(slackHelpers_1.default.getUserInfoFromSlack).toBeCalledWith(userId, teamId);
            expect(user_service_1.default.createNewUser).toBeCalledWith(__mocks__1.createNewUserMock.user);
            expect(user).toEqual(validUser);
        }));
        it('should return user based on slackId if user already exists', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(user_service_1.default, 'getUserBySlackId').mockResolvedValue(validUser);
            const user = yield slackHelpers_1.default.findOrCreateUserBySlackId(userId, teamId);
            expect(user_service_1.default.getUserBySlackId).toBeCalledWith(userId);
            expect(slackHelpers_1.default.getUserInfoFromSlack).toBeCalledTimes(0);
            expect(user_service_1.default.createNewUser).toBeCalledTimes(0);
            expect(user).toEqual(validUser);
        }));
    });
    describe('findUserByIdOrSlackId', () => {
        it('should return user object when slackId is valid', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(user_service_1.default, 'getUserBySlackId').mockResolvedValue(__mocks__1.testUserFromDb.dataValues);
            const user = yield slackHelpers_1.default.findUserByIdOrSlackId('U4500');
            expect(user_service_1.default.getUserBySlackId).toBeCalledTimes(1);
            expect(user_service_1.default.getUserBySlackId).toBeCalledWith('U4500');
            expect(user).toEqual(__mocks__1.testUserFromDb.dataValues);
        }));
        it('should return user object when id is valid', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(user_service_1.default, 'getUserById').mockResolvedValue(__mocks__1.testUserFromDb.dataValues);
            const user = yield slackHelpers_1.default.findUserByIdOrSlackId(10);
            expect(user).toEqual(__mocks__1.testUserFromDb.dataValues);
        }));
    });
    describe('isRequestApproved', () => {
        it('should return trip status object with approved false', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(trip_service_1.default, 'getById').mockResolvedValue(undefined);
            const trip = yield slackHelpers_1.default.isRequestApproved(23, 'UE45');
            expect(trip).toEqual({ approvedBy: null, isApproved: false });
        }));
        it('should return a valid approval status when request exists', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(trip_service_1.default, 'getById').mockResolvedValue({
                tripStatus: 'Approved',
                approvedById: __mocks__1.testUserFromDb.dataValues.slackId
            });
            jest.spyOn(slackHelpers_1.default, 'findUserByIdOrSlackId')
                .mockResolvedValue(__mocks__1.testUserFromDb.dataValues);
            const trip = yield slackHelpers_1.default.isRequestApproved(23, 'UE45');
            expect(trip).toEqual({
                approvedBy: `<@${__mocks__1.testUserFromDb.dataValues.slackId}>`, isApproved: true
            });
        }));
    });
    describe('approveRequest', () => {
        it('should approve request when parameters is valid', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(trip_service_1.default, 'getById').mockResolvedValue({
                tripStatus: 'Approved',
                approvedById: __mocks__1.testUserFromDb.dataValues.slackId
            });
            jest.spyOn(trip_service_1.default, 'updateRequest').mockResolvedValue({});
            jest.spyOn(slackHelpers_1.default, 'findUserByIdOrSlackId').mockResolvedValue({ id: 5 });
            const tripStatus = yield slackHelpers_1.default.approveRequest(23, 'UE45', 'some text');
            expect(trip_service_1.default.updateRequest).toBeCalledTimes(1);
            expect(tripStatus).toBeTruthy();
        }));
        it('should return false when trip is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(trip_service_1.default, 'getById').mockResolvedValue(undefined);
            expect(slackHelpers_1.default.approveRequest(23, 'UE45', 'some text')).rejects
                .toThrow(new Error('Error updating trip request'));
        }));
    });
    describe('handleCancellation', () => {
        it('should return true/false when trip status is Cancelled', () => __awaiter(void 0, void 0, void 0, function* () {
            const tripRequest = {
                tripStatus: 'Cancelled'
            };
            jest.spyOn(trip_service_1.default, 'getById').mockResolvedValue(tripRequest);
            const result = yield slackHelpers_1.default.handleCancellation();
            expect(result).toEqual(true);
        }));
    });
    describe('findOrCreateUserBySlackId', () => {
        beforeEach(() => {
            jest.spyOn(user_service_1.default, 'getUserBySlackId').mockResolvedValue();
            jest.spyOn(slackHelpers_1.default, 'getUserInfoFromSlack').mockResolvedValue(__mocks__1.newUser);
            jest.spyOn(user_service_1.default, 'createNewUser').mockReturnValue({
                username: 'santos',
                email: 'tembea@tem.com'
            });
        });
        afterEach(() => {
            jest.resetAllMocks();
        });
        it("should return new user when user isn't found", () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield slackHelpers_1.default.findOrCreateUserBySlackId('1aaaBa', 'TI34DJ');
            expect(result).toEqual({ username: 'santos', email: 'tembea@tem.com' });
            expect(user_service_1.default.getUserBySlackId).toHaveBeenCalledTimes(1);
            expect(user_service_1.default.createNewUser).toHaveBeenCalledTimes(1);
        }));
        it('should return null when user is found', () => __awaiter(void 0, void 0, void 0, function* () {
            user_service_1.default.getUserBySlackId = jest.fn(() => ({}));
            const result = yield slackHelpers_1.default.findOrCreateUserBySlackId('1aaaBa', 'TI34DJ');
            expect(user_service_1.default.getUserBySlackId).toHaveBeenCalled();
            expect(user_service_1.default.createNewUser).toHaveBeenCalledTimes(0);
            expect(result).toEqual({});
        }));
    });
    describe('noOfPassengers', () => {
        it('should return name value pairs', () => {
            const result = slackHelpers_1.default.noOfPassengers();
            expect(result.length === 10);
            expect(result[0]).toHaveProperty('text');
            expect(result[0]).toHaveProperty('value');
        });
    });
    describe('addMissingTripObjects', () => {
        it('should add decliner object to trip data', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(user_service_1.default, 'getUserById').mockResolvedValue({
                dataValues: {
                    id: 15,
                    name: 'Tembea SuperAdmin',
                    slackId: 'UG93CNE80',
                    phoneNo: null,
                    email: 'ronald.okello@andela.com',
                }
            });
            const result = yield slackHelpers_1.default.addMissingTripObjects({ declinedById: 15 });
            expect(result.decliner).toBeDefined();
            expect(result.decliner.dataValues.slackId).toEqual('UG93CNE80');
        }));
        it('should add confirmer object to trip data', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(user_service_1.default, 'getUserById').mockResolvedValue({
                dataValues: {
                    id: 15,
                    name: 'Tembea SuperAdmin',
                    slackId: 'UG93CNE80',
                    phoneNo: null,
                    email: 'ronald.okello@andela.com',
                }
            });
            const result = yield slackHelpers_1.default.addMissingTripObjects({ confirmedById: 15 });
            expect(result.confirmer).toBeDefined();
            expect(result.confirmer.dataValues.slackId).toEqual('UG93CNE80');
        }));
        it('should add cab object to trip data', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(cab_service_1.cabService, 'getById').mockResolvedValue({
                dataValues: {
                    id: 2,
                    driverName: 'Tembea SuperAdmin',
                    slackId: 'UG93CNE80',
                    driverPhoneNo: null
                }
            });
            const result = yield slackHelpers_1.default.addMissingTripObjects({ cabId: 2 });
            expect(result.cab).toBeDefined();
            expect(result.cab.dataValues.id).toEqual(2);
            expect(result.cab.dataValues.driverName).toEqual('Tembea SuperAdmin');
        }));
    });
    describe('getLocationCountryFlag', () => {
        it('should return the countryflag emoji of a location', () => {
            const flag = '🇳🇬';
            expect(slackHelpers_1.default.getLocationCountryFlag('Nigeria')).toEqual(flag);
        });
    });
});
//# sourceMappingURL=slackHelpers.spec.js.map