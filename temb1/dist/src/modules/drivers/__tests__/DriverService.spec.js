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
const driver_service_1 = __importStar(require("../driver.service"));
const database_1 = __importDefault(require("../../../database"));
const providerHelper_1 = __importDefault(require("../../../helpers/providerHelper"));
const driversMocks_1 = __importDefault(require("../__mocks__/driversMocks"));
const { models: { Driver }, } = database_1.default;
describe('Driver Service', () => {
    let testDriver;
    let providerId;
    describe('test', () => {
        beforeAll(() => {
            providerId = 1;
        });
        afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield testDriver.destroy({ force: true });
        }));
        it('should create driver successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const driver = yield driver_service_1.driverService.create({
                providerId,
                driverName: 'Muhwezi Deo2',
                driverPhoneNo: '070533111166',
                driverNumber: 'UB5422424344',
            });
            expect(driver).toBeDefined();
            expect(driver.driverName).toEqual('Muhwezi Deo2');
        }));
    });
    it('should return not create driver if driverNumber exists', () => __awaiter(void 0, void 0, void 0, function* () {
        const drivers = yield Driver.findAll({ limit: 1 });
        const driver = yield driver_service_1.driverService.create({
            providerId,
            driverName: 'Muhwezi Deo2',
            driverPhoneNo: '0700000011',
            driverNumber: drivers[0].driverNumber,
        });
        const { _options: { isNewRecord } } = driver;
        expect(isNewRecord).toBeFalsy();
    }));
    describe('getProviders', () => {
        beforeEach(() => {
            providerHelper_1.default.serializeDetails = jest.fn();
        });
        it('returns a list of drivers', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(Driver, 'findAll').mockResolvedValue(driversMocks_1.default.drivers.data);
            const driversDetails = driversMocks_1.default.drivers.data.map((driver) => driver.get());
            const result = yield driver_service_1.driverService.getDrivers({ page: 2, size: 10 }, {});
            expect(result.data).toEqual(driversDetails);
            expect(result).toHaveProperty('pageMeta');
        }));
    });
    describe('Update Driver', () => {
        const driverDetails = {
            get: ({ plain }) => {
                if (plain) {
                    return {
                        driverName: 'Muhwezi De',
                        driverPhoneNo: '070533111',
                        driverNumber: 'UB5422424',
                        email: 'james@andela.com',
                    };
                }
            },
        };
        const driverDetailsMock = {
            get: () => ({
                driverName: 'Muhwezi De',
                driverPhoneNo: '070533111',
                driverNumber: 'UB5422424',
                email: 'james@andela.com',
            }),
        };
        it('Should return an error if driver does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(Driver, 'findByPk').mockResolvedValue(undefined);
            const result = yield driver_service_1.driverService.driverUpdate(1, null);
            expect(Driver.findByPk).toHaveBeenCalled();
            expect(result).toEqual({ message: 'Update Failed. Driver does not exist' });
        }));
        it('should update a driver', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(Driver, 'update')
                .mockResolvedValue([{}, [driverDetailsMock]]);
            jest.spyOn(Driver, 'findByPk')
                .mockResolvedValue(driverDetails);
            const result = yield driver_service_1.driverService.driverUpdate(1, driverDetailsMock.get());
            expect(Driver.update).toHaveBeenCalled();
            expect(result).toEqual(driverDetailsMock.get());
        }));
        it('should get driver by id', () => __awaiter(void 0, void 0, void 0, function* () {
            driverDetails.id = 1;
            jest.spyOn(Driver, 'findByPk').mockResolvedValue(driverDetails);
            const driver = yield driver_service_1.driverService.getDriverById(1);
            expect(driver).toEqual(driverDetails.get({ plain: true }));
        }));
        it('should check if a driver already exists when updating', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(database_1.default, 'query').mockResolvedValue([[{ count: true }]]);
            const driverExists = yield driver_service_1.default.exists('deo@andela.com', '891293', '123123', 1);
            expect(driverExists).toBe(true);
        }));
        it('should check if a driver already exists when adding a driver', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(database_1.default, 'query').mockResolvedValue([[{ count: true }]]);
            const driverExists = yield driver_service_1.default.exists('deo@andela.com', '891293', '123123');
            expect(driverExists).toBe(true);
        }));
    });
    describe('Delete Driver', () => {
        it('Should delete driver', () => __awaiter(void 0, void 0, void 0, function* () {
            const driverInfo = {
                driverName: 'Muhwezi Deo',
                driverPhoneNo: '070533111',
                driverNumber: 'UB5422424',
                email: 'james@andela.com',
            };
            jest.spyOn(driver_service_1.driverService, 'deleteDriver').mockResolvedValue({});
            const result = yield driver_service_1.driverService.deleteDriver(driverInfo);
            expect(Driver.update).toHaveBeenCalled();
            expect(result).toEqual({});
        }));
    });
    describe('findOneDriver', () => {
        it('Should findOne driver', () => __awaiter(void 0, void 0, void 0, function* () {
            const driverInfo = {
                driverName: 'Muhwezi Deo',
                driverPhoneNo: '070533111',
                driverNumber: 'UB5422424',
                email: 'james@andela.com',
            };
            jest.spyOn(Driver, 'findOne').mockResolvedValue(driverInfo);
            const options = { where: { id: 1 } };
            const result = yield driver_service_1.default.findOneDriver(options);
            expect(Driver.findOne).toHaveBeenCalled();
            expect(result).toEqual(driverInfo);
            yield database_1.default.close();
        }));
    });
});
//# sourceMappingURL=DriverService.spec.js.map