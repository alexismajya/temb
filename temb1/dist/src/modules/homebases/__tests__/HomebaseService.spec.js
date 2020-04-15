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
const faker_1 = __importDefault(require("faker"));
const homebase_service_1 = require("../homebase.service");
const database_1 = __importDefault(require("../../../database"));
const __mocks__1 = require("../../../services/__mocks__");
const user_service_1 = __importDefault(require("../../users/user.service"));
const helpers_1 = require("../../../../integrations/support/helpers");
const homebase_1 = __importDefault(require("../../../database/models/homebase"));
const { models: { Country, Provider, TripRequest } } = database_1.default;
describe('test HomebaseService', () => {
    let createHomebaseSpy;
    const homebaseDetails = {
        id: 1,
        name: 'Nairobi',
        createdAt: '2019-05-05T10:57:31.476Z',
        updatedAt: '2019-05-05T10:57:31.476Z',
        addressId: 1,
    };
    const homebaseMock = [
        [{
                get: () => (homebaseDetails),
            }],
        [{
                get: ({ plain }) => {
                    if (plain)
                        return homebaseDetails;
                },
            }],
    ];
    const filterParams = {
        country: 'kenya',
        name: 'NairobI',
    };
    const where = {
        country: 'Kenya',
    };
    beforeEach(() => {
        createHomebaseSpy = jest.spyOn(homebase_1.default, 'findOrCreate');
        jest.spyOn(homebase_service_1.homebaseService, 'formatName');
        jest.spyOn(homebase_service_1.homebaseService, 'createFilter');
        jest.spyOn(homebase_service_1.homebaseService, 'getAllHomebases');
        jest.spyOn(homebase_service_1.homebaseService, 'getHomeBaseBySlackId');
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    it('creates a homebase successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const testData = {
            name: 'Nairobi',
            channel: 'UO23D',
            address: {
                address: 'nairobi',
                location: {
                    longitude: '23', latitude: '53',
                },
            },
            countryId: 1,
            currency: 'KES',
        };
        createHomebaseSpy.mockResolvedValue([__mocks__1.mockNewHomebase]);
        const result = yield homebase_service_1.homebaseService.createHomebase(testData);
        expect(createHomebaseSpy).toHaveBeenCalled();
        expect(homebase_service_1.homebaseService.formatName).toHaveBeenCalledWith(testData.name);
        expect(result).toEqual(__mocks__1.mockCreatedHomebase);
    }));
    it('createFilter', () => {
        const res = homebase_service_1.homebaseService.createFilter(where);
        expect(Object.keys(res).length).toEqual(2);
        expect(res).toHaveProperty('where');
        expect(res).toHaveProperty('include');
    });
    it('formatName', () => {
        const res = homebase_service_1.homebaseService.formatName('naIRoBi');
        expect(res).toEqual('Nairobi');
    });
    it('whereClause', () => {
        const res = homebase_service_1.homebaseService.getWhereClause(filterParams);
        expect(homebase_service_1.homebaseService.formatName).toHaveBeenCalledTimes(2);
        expect(res).toEqual({
            country: 'Kenya', name: 'Nairobi',
        });
    });
    it('getHomebases', () => __awaiter(void 0, void 0, void 0, function* () {
        const pageable = {
            page: 1,
            size: 10,
        };
        jest.spyOn(homebase_1.default, 'findAll').mockResolvedValue(homebaseMock[0]);
        const homebases = yield homebase_service_1.homebaseService.getHomebases(pageable);
        expect(homebases).toHaveProperty('homebases', [{
                id: 1,
                homebaseName: 'Nairobi',
                createdAt: '2019-05-05T10:57:31.476Z',
                updatedAt: '2019-05-05T10:57:31.476Z',
                addressId: 1,
                country: null,
                channel: undefined,
                locationId: undefined,
            }]);
        expect(homebase_service_1.homebaseService.createFilter).toHaveBeenCalledWith({});
    }));
    it('should get all Homebases', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(homebase_1.default, 'findAll').mockResolvedValue(homebaseMock[1]);
        const homebases = yield homebase_service_1.homebaseService.getAllHomebases();
        expect(homebase_1.default.findAll).toBeCalledWith({
            attributes: ['id', 'name', 'channel', 'addressId', 'locationId', 'currency', 'opsEmail', 'travelEmail'],
            include: [],
            order: [['name', 'ASC']],
        });
        expect(homebases).toEqual([homebaseMock[1][0].get({ plain: true })]);
    }));
    it('should get all Homebases with foreignKey', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(homebase_1.default, 'findAll').mockResolvedValue(homebaseMock[1]);
        yield homebase_service_1.homebaseService.getAllHomebases(true);
        expect(homebase_1.default.findAll).toBeCalledWith({
            attributes: ['id', 'name', 'channel', 'addressId', 'locationId', 'currency', 'opsEmail', 'travelEmail'],
            include: [{ as: 'country', attributes: ['name'], model: Country }],
            order: [['name', 'ASC']],
        });
    }));
    it('should get homebase by User slack ID', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(user_service_1.default, 'getUserBySlackId').mockResolvedValue({ homebaseId: 1 });
        jest.spyOn(homebase_1.default, 'findByPk').mockResolvedValue(homebaseMock[1][0]);
        const homebase = yield homebase_service_1.homebaseService.getHomeBaseBySlackId(1);
        expect(homebase_1.default.findByPk).toBeCalled();
        expect(homebase).toEqual(homebaseMock[1][0].get({ plain: true }));
    }));
    it('should get homebase by User slack ID with foreignKey', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(user_service_1.default, 'getUserBySlackId').mockResolvedValue({ homebaseId: 1 });
        jest.spyOn(homebase_1.default, 'findByPk').mockResolvedValue(homebaseMock[1][0]);
        const homebase = yield homebase_service_1.homebaseService.getHomeBaseBySlackId(1, true);
        expect(homebase_1.default.findByPk).toBeCalled();
        expect(homebase_1.default.findByPk).toBeCalledWith(1, {
            attributes: ['id', 'name', 'channel', 'addressId', 'locationId', 'currency', 'opsEmail', 'travelEmail'],
            include: [{ as: 'country', attributes: ['name'], model: Country }],
        });
        expect(homebase).toEqual(homebaseMock[1][0].get({ plain: true }));
    }));
    it('should get homebase by Slack Channel ID', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(homebase_1.default, 'findOne').mockResolvedValue(homebaseMock[1][0]);
        const result = yield homebase_service_1.homebaseService.findHomeBaseByChannelId('CELT35X40');
        expect(homebase_1.default.findOne).toBeCalled();
        expect(result).toEqual(homebaseMock[1][0].get({ plain: true }));
    }));
    it('should get all Homebases with providers and trips', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(homebase_1.default, 'findAll').mockResolvedValue(homebaseMock[1]);
        yield homebase_service_1.homebaseService.getMonthlyCompletedTrips();
        expect(homebase_1.default.findAll).toBeCalled();
    }));
});
describe('update HomeBase', () => {
    let mockHomeBase;
    const testAddress = {
        address: faker_1.default.address.county(),
        location: {
            longitude: '123',
            latitude: '86',
        },
    };
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const mockCountry = yield helpers_1.createCountry({ name: faker_1.default.address.country().concat('z') });
        mockHomeBase = yield homebase_service_1.homebaseService.createHomebase({
            name: faker_1.default.address.city().concat('z'),
            channel: 'U123K',
            countryId: mockCountry.id,
            address: testAddress,
            currency: 'NGN',
            opsEmail: 'Kigali@andela.com',
            travelEmail: 'kigali@andela.com',
        });
        yield homebase_service_1.homebaseService.createHomebase({
            name: 'Duplicatetest',
            channel: 'U123K',
            countryId: mockCountry.id,
            address: testAddress,
        });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield database_1.default.close();
    }));
    it('should update the homebase', () => __awaiter(void 0, void 0, void 0, function* () {
        const { homebase: { id, countryId, currency, opsEmail, travelEmail } } = mockHomeBase;
        const homeBaseName = faker_1.default.address.county().concat('w');
        const result = yield homebase_service_1.homebaseService.updateDetails(homeBaseName, id, 'U08ETD', countryId, testAddress, currency, opsEmail, travelEmail);
        expect(result.name).toBe(homeBaseName);
    }));
    it('should filter the homebase', () => __awaiter(void 0, void 0, void 0, function* () {
        const filtered = homebase_service_1.homebaseService.filterHomebase({ name: 'name' }, [{ name: 'name' }, { name: 'name 1' }]);
        expect(filtered).toEqual([{ name: 'name 1' }]);
    }));
    it('should filte the homebase', () => __awaiter(void 0, void 0, void 0, function* () {
        const filtered = homebase_service_1.homebaseService.filterHomebase({ name: 'name 1' }, [{ name: 'name' }]);
        expect(filtered).toEqual([{ name: 'name' }]);
    }));
});
//# sourceMappingURL=HomebaseService.spec.js.map