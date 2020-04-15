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
const address_service_1 = __importDefault(require("../address.service"));
const location_service_1 = require("../../locations/__mocks__/location.service");
const logger_1 = require("../../shared/logging/__mocks__/logger");
const address_service_2 = require("../__mocks__/address.service");
describe(address_service_1.default, () => {
    let mockAddress;
    let addressService;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        addressService = new address_service_1.default(address_service_2.mockAddressRepo, location_service_1.mockLocationService, logger_1.mockLogger);
        mockAddress = yield address_service_2.mockAddressRepo.create({ address: 'This is a test address' });
    }));
    beforeEach(() => {
        jest.spyOn(logger_1.mockLogger, 'log');
        jest.spyOn(logger_1.mockLogger, 'error');
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe(address_service_1.default.prototype.createNewAddress, () => {
        it('should create new address', () => __awaiter(void 0, void 0, void 0, function* () {
            const testAddress = {
                longitude: 5677,
                latitude: 908998,
                address: 'Another test address',
            };
            const result = yield addressService.createNewAddress(testAddress.longitude, testAddress.latitude, testAddress.address);
            expect(result).toEqual(expect.objectContaining(testAddress));
        }));
        it('should raise error when having invalid parameters', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(logger_1.mockLogger, 'log');
            expect(addressService.createNewAddress(1.0, null, 'Address'))
                .rejects.toThrowError('Could not create address');
        }));
    });
    describe(address_service_1.default.prototype.updateAddress, () => {
        it.only('should update address model', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockAddressModel = {
                get: () => ({
                    address: 'newAddress',
                    location: { longitude: -1.0, latitude: 1.0 },
                }),
            };
            jest.spyOn(address_service_2.mockAddressRepo, 'findOne').mockResolvedValue(mockAddressModel);
            jest.spyOn(address_service_2.mockAddressRepo, 'findByPk').mockResolvedValue(mockAddressModel);
            jest.spyOn(address_service_2.mockAddressRepo, 'update').mockResolvedValueOnce([, [mockAddressModel]]);
            const updatedAddress = yield addressService.updateAddress('This is a test address', -1, 1, 'newAddress2');
            expect(updatedAddress.address).toEqual('newAddress2');
        }));
        it('should raise error when having invalid parameters', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(address_service_2.mockAddressRepo, 'update').mockRejectedValue(new Error());
            expect(yield addressService.updateAddress('This is a test address', null, null, 'newAddress'))
                .rejects.toThrowError('Could not update address record');
        }));
    });
    describe(address_service_1.default.prototype.findAddress, () => {
        it('should find and return address', () => __awaiter(void 0, void 0, void 0, function* () {
            const value = {
                get: (plainProp = { plain: false }) => {
                    if (plainProp.plain) {
                        return { address: 'This is a test address', id: 2 };
                    }
                },
            };
            jest.spyOn(address_service_2.mockAddressRepo, 'findOne').mockResolvedValue(value);
            const result = yield addressService.findAddress('');
            expect(result).toEqual(value.get({ plain: true }));
        }));
        it('should raise error when having invalid parameters', () => __awaiter(void 0, void 0, void 0, function* () {
            const value = { address: 'This is a test address' };
            jest.spyOn(address_service_2.mockAddressRepo, 'findOne').mockRejectedValue(value);
            const res = yield addressService.findAddress('');
            jest.spyOn(logger_1.mockLogger, 'log');
            logger_1.mockLogger.log = jest.fn().mockRejectedValue({});
        }));
        it('should get address when ID is passed', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield addressService.findAddressById(1);
            expect(result.address).toEqual('Another test address');
        }));
    });
    describe(address_service_1.default.prototype.getAddressesFromDB, () => {
        it('should return all addresses in the database', () => __awaiter(void 0, void 0, void 0, function* () {
            const value = [{
                    get: () => {
                        return { address: 'This is a test address' };
                    },
                }];
            jest.spyOn(address_service_2.mockAddressRepo, 'findAll').mockResolvedValue(value);
            jest.spyOn(address_service_2.mockAddressRepo, 'count').mockResolvedValue(2);
            const result = yield addressService.getAddressesFromDB(1, 2);
            expect(result.rows)
                .toEqual(value.map((entry) => entry.get()));
        }));
    });
    describe(address_service_1.default.prototype.findOrCreateAddress, () => {
        beforeEach(() => {
            jest.spyOn(address_service_2.mockAddressRepo, 'findOrCreate').mockImplementation((value) => {
                const id = Math.ceil(Math.random() * 100);
                const newAddress = {
                    get: () => (Object.assign(Object.assign({}, value.defaults), { id })),
                };
                return [newAddress];
            });
        });
        it('should create a new address with supplied location', () => __awaiter(void 0, void 0, void 0, function* () {
            const testAddress = {
                address: 'Andela, Nairobi',
                location: {
                    longitude: 100,
                    latitude: 180,
                },
            };
            const result = yield addressService.findOrCreateAddress(testAddress.address, testAddress.location);
            expect(result.longitude).toEqual(100);
            expect(result.latitude).toEqual(180);
            expect(result.id).toBeDefined();
        }));
        it('should not create location when location is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const testAddress = {
                address: 'Andela, Nairobi',
            };
            const result = yield addressService.findOrCreateAddress(testAddress.address, '');
            expect(result.id).toBeDefined();
            expect(result.longitude).toBeUndefined();
        }));
    });
    describe(address_service_1.default.prototype.findCoordinatesByAddress, () => {
        it('should get location when address is requested', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield addressService.findCoordinatesByAddress('This is a test address');
            expect(result.address).toEqual('This is a test address');
            expect(result.id).toBeDefined();
        }));
    });
    describe(address_service_1.default.prototype.findAddressByCoordinates, () => {
        let addressDetails;
        beforeEach(() => {
            addressDetails = {
                id: 1,
                longitude: 1.2222,
                latitude: 34.4444,
                address: {
                    id: 1,
                    address: 'Sample Provider',
                },
            };
            jest.spyOn(location_service_1.mockLocationService, 'findLocation').mockResolvedValue(addressDetails);
        });
        afterEach(() => {
            jest.resetAllMocks();
        });
        it('should get address when coordinated are passed', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield addressService.findAddressByCoordinates(1.2343, -1.784);
            expect(result).toEqual(addressDetails.address);
        }));
    });
    describe(address_service_1.default.prototype.getAddressListByHomebase, () => {
        const addresses = [
            {
                get: (plainProp = { plain: false }) => {
                    if (plainProp.plain) {
                        return { address: 'address1' };
                    }
                },
            },
            {
                get: (plainProp = { plain: false }) => {
                    if (plainProp.plain) {
                        return { address: 'address2' };
                    }
                },
            },
        ];
        it('should return a list of addresses', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(address_service_2.mockAddressRepo, 'findAll').mockResolvedValue(addresses);
            const response = yield addressService.getAddressListByHomebase('SomeHomebase');
            expect(response).toEqual(addresses.map((e) => e.get({ plain: true }).address));
        }));
    });
});
//# sourceMappingURL=address.service.spec.js.map