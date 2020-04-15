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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = __importDefault(require("faker"));
const user_service_1 = __importStar(require("../user.service"));
const database_1 = __importStar(require("../../../database"));
const user_1 = __importDefault(require("../../../database/models/user"));
const homebase_1 = __importDefault(require("../../../database/models/homebase"));
describe(user_service_1.UserService, () => {
    let testUser;
    let userRepo;
    const getMockSlackUserInfo = (email) => {
        const realName = faker_1.default.name.findName();
        return {
            id: faker_1.default.random.word().toLocaleUpperCase(),
            real_name: realName,
            team_id: 'U1234',
            name: realName,
            profile: {
                email: email || faker_1.default.internet.email(),
                real_name: realName,
            },
        };
    };
    const webMock = {
        users: {
            lookupByEmail: ({ email }) => {
                const realName = faker_1.default.name.findName();
                return Promise.resolve({
                    ok: true,
                    user: getMockSlackUserInfo(email),
                });
            },
        },
    };
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const testUserDetails = {
            name: faker_1.default.name.findName(),
            slackId: `U${faker_1.default.random.word()}1`,
            phoneNo: faker_1.default.phone.phoneNumber(),
            email: `z${faker_1.default.internet.email()}`,
        };
        userRepo = database_1.default.getRepository(user_1.default);
        const result = yield userRepo.create(testUserDetails);
        testUser = result.get();
    }));
    afterAll((done) => database_1.default.close().then(done, done));
    it('should be a valid instance', () => {
        expect(user_service_1.default).toBeDefined();
    });
    describe(user_service_1.UserService.prototype.createNewUser, () => {
        it('should create a user', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockSlackUserInfo = getMockSlackUserInfo();
            const result = yield user_service_1.default.createNewUser(mockSlackUserInfo);
            expect(result).toEqual(expect.objectContaining({
                email: mockSlackUserInfo.profile.email,
                name: mockSlackUserInfo.profile.real_name,
            }));
        }));
        it('should not be able to create user', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(user_service_1.default.createNewUser({}))
                .rejects.toThrow('Could not create user');
        }));
    });
    describe(user_service_1.UserService.prototype.getUserInfo, () => {
        it('should return an instance if ISlackUserInfo', () => __awaiter(void 0, void 0, void 0, function* () {
            const testEmail = 'tester@tembea.com';
            jest.spyOn(user_service_1.default, 'getSlackClient').mockResolvedValue(webMock);
            const result = yield user_service_1.default.getUserInfo('tembea.slack.com', testEmail);
            expect(result).toEqual(expect.objectContaining({
                profile: expect.objectContaining({
                    email: testEmail,
                }),
            }));
        }));
    });
    describe(user_service_1.UserService.prototype.getUsersFromDB, () => {
        it('should return paginated users', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield user_service_1.default.getUsersFromDB(2, 1);
            expect(result).toBeDefined();
            expect(result.rows.length).toBe(2);
        }));
    });
    describe(user_service_1.UserService.prototype.getUserSlackInfo, () => {
        beforeEach(() => jest.restoreAllMocks());
        it('should return valid user info', () => __awaiter(void 0, void 0, void 0, function* () {
            const testEmail = 'hello@example.com';
            const result = yield user_service_1.default.getUserSlackInfo(webMock, testEmail);
            expect(result.profile.email).toEqual(testEmail);
        }));
        it('should not get User SlackInfo', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(webMock.users, 'lookupByEmail').mockRejectedValue(null);
            expect(user_service_1.default.getUserSlackInfo(webMock, 'hello@email.com'))
                .rejects.toThrowError(/^User not found/g);
        }));
    });
    describe(user_service_1.UserService.prototype.getUser, () => {
        it('should return user with specified email', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield user_service_1.default.getUser(testUser.email);
            expect(result.id).toEqual(testUser.id);
        }));
        it('should throw an error when user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(user_service_1.default.getUser('idonttknow'))
                .rejects.toThrowError(/^User not found/g);
        }));
    });
    describe(user_service_1.UserService.prototype.saveNewRecord, () => {
        it('should update user info', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockSlackUserInfo = getMockSlackUserInfo();
            const result = yield user_service_1.default.saveNewRecord(testUser, mockSlackUserInfo);
            expect(result.slackId).toEqual(mockSlackUserInfo.id);
            yield userRepo.update({ slackId: testUser.slackId }, { where: { id: testUser.id } });
        }));
        it('should not update the user in the database', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(user_service_1.default.saveNewRecord(testUser, null)).rejects.toThrow();
        }));
    });
    describe(user_service_1.UserService.prototype.getUserById, () => {
        it('should return valid user when found', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield user_service_1.default.getUserById(testUser.id);
            expect(user).toEqual(expect.objectContaining({
                id: testUser.id,
            }));
        }));
    });
    describe(user_service_1.UserService.prototype.getUserBySlackId, () => {
        it('should return valid user when found', () => __awaiter(void 0, void 0, void 0, function* () {
            const existingUser = yield userRepo.findOne({ where: { id: testUser.id } });
            const user = yield user_service_1.default.getUserBySlackId(existingUser.slackId);
            expect(user).toEqual(expect.objectContaining({
                id: testUser.id,
            }));
        }));
    });
    describe(user_service_1.UserService.prototype.getUserByEmail, () => {
        it('should return valid user when found', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield user_service_1.default.getUserByEmail(testUser.email);
            expect(user).toEqual(expect.objectContaining({
                id: testUser.id,
            }));
        }));
    });
    describe(user_service_1.UserService.prototype.updateUser, () => {
        it('should update a user object', () => __awaiter(void 0, void 0, void 0, function* () {
            const testSlackId = 'U0000123';
            const result = yield user_service_1.default.updateUser(testUser.id, { slackId: testSlackId });
            expect(result.slackId).toEqual(testSlackId);
            yield userRepo.update({ slackId: testUser.slackId }, { where: { id: testUser.id } });
        }));
    });
    describe(user_service_1.UserService.prototype.getPagedFellowsOnOrOffRoute, () => {
        it('should get fellows not on route', () => __awaiter(void 0, void 0, void 0, function* () {
            const data = yield user_service_1.default.getPagedFellowsOnOrOffRoute(false, { page: 1, size: 1 }, { homebaseId: testUser.homebaseId });
            expect(data.data).toBeInstanceOf(Array);
            expect(data.pageMeta).toBeInstanceOf(Object);
        }));
        it('should get fellows on route', () => __awaiter(void 0, void 0, void 0, function* () {
            const data = yield user_service_1.default.getPagedFellowsOnOrOffRoute(true, { size: 1, page: 1 }, { homebaseId: testUser.homebaseId });
            expect(data.data).toBeInstanceOf(Array);
            expect(data.pageMeta).toBeInstanceOf(Object);
        }));
    });
    describe(user_service_1.UserService.prototype.findOrCreateNewUserWithSlackId, () => {
        beforeEach(() => {
            jest.restoreAllMocks();
        });
        it('should find or create a fellow by specific slackId', () => __awaiter(void 0, void 0, void 0, function* () {
            const userData = {
                slackId: faker_1.default.random.word(),
                name: faker_1.default.name.firstName(),
                email: faker_1.default.internet.email(),
            };
            const result = yield user_service_1.default.findOrCreateNewUserWithSlackId(userData);
            expect(result.slackId).toBe(userData.slackId);
            expect(result.email).toBe(userData.email);
        }));
    });
    describe(user_service_1.UserService.prototype.updateDefaultHomeBase, () => {
        it('should update homebase id of user', () => __awaiter(void 0, void 0, void 0, function* () {
            const otherHomebase = yield database_1.default.getRepository(homebase_1.default).findOne({ where: {
                    id: { [database_1.Op.not]: testUser.homebaseId },
                } });
            const homeBaseId = yield user_service_1.default.updateDefaultHomeBase(testUser.slackId, otherHomebase.id);
            expect(homeBaseId).toEqual(otherHomebase.id);
            yield userRepo.update({ homebaseId: testUser.homebaseId }, { where: { id: testUser.id } });
        }));
    });
    describe(user_service_1.UserService.prototype.createUserByEmail, () => {
        beforeEach(() => {
            jest.spyOn(user_service_1.default, 'getSlackClient').mockResolvedValue(webMock);
        });
        it('should create a user if they do not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield user_service_1.default.createUserByEmail('team.slack.com', `z${faker_1.default.internet.email()}`);
            expect(user.id).toBeDefined();
        }));
        it('should not create a user if they do not exists on the workspace', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(user_service_1.default, 'getUserInfo').mockResolvedValue(null);
            expect(user_service_1.default.createUserByEmail('team.slack.com', 'email@email.com'))
                .rejects.toThrow();
        }));
    });
    describe(user_service_1.UserService.prototype.getWeeklyCompletedTrips, () => {
        it('should return users with their weekly completed trips trips', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(user_service_1.default, 'findAll').mockResolvedValue([]);
            yield user_service_1.default.getWeeklyCompletedTrips('date');
            expect(user_service_1.default.findAll).toBeCalled();
        }));
    });
    describe(user_service_1.UserService.prototype.getWeeklyCompletedRoutes, () => {
        it('should return users with their weekly completed trips trips', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(user_service_1.default, 'findAll').mockResolvedValue([]);
            yield user_service_1.default.getWeeklyCompletedRoutes('date');
            expect(user_service_1.default.findAll).toBeCalled();
        }));
    });
});
//# sourceMappingURL=user.service.spec.js.map