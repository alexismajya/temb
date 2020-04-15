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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importStar(require("./database"));
const faker_1 = __importDefault(require("faker"));
const trip_request_1 = require("./database/models/trip-request");
const provider_1 = require("./database/models/provider");
const testStartupCollections = {};
const createTestUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const userRepo = database_1.default.getRepository(database_1.User);
    testStartupCollections.homebase = yield database_1.default.getRepository(database_1.Homebase).findOne();
    const usersList = [];
    for (let i = 0; i < 10; i += 1) {
        usersList.push({
            name: faker_1.default.fake('{{name.lastName}}, {{name.firstName}}'),
            slackId: faker_1.default.random.alphaNumeric(6).toLocaleUpperCase(),
            phoneNo: faker_1.default.phone.phoneNumber(),
            email: faker_1.default.internet.email(),
            homebaseId: testStartupCollections.homebase.id,
        });
    }
    testStartupCollections.users = yield userRepo.bulkCreate(usersList);
});
const createTeam = () => __awaiter(void 0, void 0, void 0, function* () {
    const teamRepo = database_1.default.getRepository(database_1.TeamDetails);
    const team = {
        teamId: faker_1.default.random.alphaNumeric(9).toLocaleUpperCase(),
        botId: faker_1.default.random.alphaNumeric(9).toLocaleUpperCase(),
        botToken: faker_1.default.random.alphaNumeric(15),
        teamName: faker_1.default.company.companyName(),
        teamUrl: faker_1.default.internet.url(),
        webhookConfigUrl: faker_1.default.internet.url(),
        userId: faker_1.default.random.alphaNumeric(9).toLocaleUpperCase(),
        userToken: faker_1.default.random.alphaNumeric(9).toLocaleUpperCase(),
        opsChannelId: faker_1.default.random.alphaNumeric(9).toLocaleUpperCase(),
    };
    testStartupCollections.team = yield teamRepo.create(team);
});
const createAddresses = () => __awaiter(void 0, void 0, void 0, function* () {
    testStartupCollections.addresses = yield database_1.default.getRepository(database_1.Address).findAll();
});
const createTestDepartments = () => __awaiter(void 0, void 0, void 0, function* () {
    const departmentRepo = database_1.default.getRepository(database_1.Department);
    const department = {
        name: faker_1.default.lorem.words(1),
        teamId: testStartupCollections.team.teamId,
        headId: testStartupCollections.users[3].id,
        homebaseId: testStartupCollections.homebase.id,
    };
    testStartupCollections.department = yield departmentRepo.create(department);
});
const createTestProviders = () => __awaiter(void 0, void 0, void 0, function* () {
    const providerRepo = database_1.default.getRepository(database_1.Provider);
    const provider = {
        name: faker_1.default.company.companyName(),
        homebaseId: testStartupCollections.homebase.id,
        providerUserId: testStartupCollections.users[4].id,
        notificationChannel: provider_1.ProviderNotificationChannel.directMessage,
        email: testStartupCollections.users[4].email,
        phoneNo: faker_1.default.internet.email(),
    };
    testStartupCollections.provider = yield providerRepo.create(provider);
});
const createTestCabsAndDrivers = () => __awaiter(void 0, void 0, void 0, function* () {
    const driverRepo = database_1.default.getRepository(database_1.Driver);
    const cabRepo = database_1.default.getRepository(database_1.Cab);
    const driver = {
        driverName: faker_1.default.name.findName(),
        driverPhoneNo: faker_1.default.random.number(),
        driverNumber: faker_1.default.random.number(),
        providerId: testStartupCollections.provider.id,
        userId: testStartupCollections.users[1].id,
    };
    const cab = {
        regNumber: faker_1.default.random.alphaNumeric(6).toLocaleUpperCase(),
        capacity: faker_1.default.random.number(),
        model: faker_1.default.random.alphaNumeric(6).toLocaleUpperCase(),
        providerId: testStartupCollections.provider.id,
    };
    testStartupCollections.driver = yield driverRepo.create(driver);
    testStartupCollections.cab = yield cabRepo.create(cab);
});
const createTestTrips = () => __awaiter(void 0, void 0, void 0, function* () {
    const tripRepo = database_1.default.getRepository(database_1.TripRequest);
    const tripList = [];
    const tripDepartureTime = new Date(new Date().getTime() - 864000000).toISOString();
    for (let i = 0; i < 5; i += 1) {
        tripList.push({
            destinationId: testStartupCollections.addresses[i].id,
            riderId: testStartupCollections.users[i].id,
            name: faker_1.default.lorem.words(2),
            reason: faker_1.default.lorem.words(3),
            departmentId: testStartupCollections.department.id,
            tripStatus: trip_request_1.TripStatus.pending,
            departureTime: tripDepartureTime,
            requestedById: testStartupCollections.users[i].id,
            originId: testStartupCollections.addresses[i].id,
            noOfPassengers: faker_1.default.random.number(),
            tripType: trip_request_1.TripTypes.regular,
        });
    }
    testStartupCollections.trips = yield tripRepo.bulkCreate(tripList);
});
const setupJest = () => __awaiter(void 0, void 0, void 0, function* () {
    process.env.TEMBEA_TWILIO_SID = 'ACesgvajhvavjhvashavh';
    process.env.TEMBEA_TWILIO_TOKEN = '1sahbjduihwqb2782his7q';
    yield createTestUsers();
    yield createTeam();
    yield createAddresses();
    yield createTestDepartments();
    yield createTestProviders();
    yield createTestCabsAndDrivers();
    yield createTestTrips();
    process.env.TEST_DATA = JSON.stringify(testStartupCollections);
});
exports.default = setupJest;
//# sourceMappingURL=setup-jest.js.map