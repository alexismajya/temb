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
const cab_service_1 = require("../cab.service");
const database_1 = __importDefault(require("../../../database"));
const __mocks__1 = require("../../../services/__mocks__");
const { models: { Cab } } = database_1.default;
describe('cabService', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });
    afterAll((done) => database_1.default.close().then(done, done));
    describe('findOrCreateCab', () => {
        it("return newly created cab if it doesn't exist", () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(Cab, 'findOrCreate').mockImplementation((obj) => Promise.resolve([{
                    get: () => obj.defaults,
                }]));
            const { cab } = yield cab_service_1.cabService.findOrCreateCab('Hello', 3, 'Test', 1);
            expect(cab.regNumber).toEqual('Hello');
        }));
    });
    describe('findByRegNumber', () => {
        it('should return cab details from the db', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockCabDetails = {
                get: ({ plain }) => {
                    if (plain) {
                        return {
                            driverName: 'Omari',
                            regNumber: 'AR R3G NMB',
                        };
                    }
                },
            };
            jest.spyOn(Cab, 'findOne').mockResolvedValue(mockCabDetails);
            const cabDetails = yield cab_service_1.cabService.findByRegNumber('AR R3G NMB');
            expect(cabDetails).toEqual(mockCabDetails.get({ plain: true }));
        }));
    });
    describe('getById', () => {
        const strippedData = {
            get: (data) => {
                if (data && data.plain)
                    return { driverName: 'Omari', regNumber: 'AR R3G NMB' };
            },
        };
        const resolvedValue = strippedData.get({ plain: true });
        it('should return cab data successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            Cab.findByPk = jest.fn(() => strippedData);
            const cabDetails = yield cab_service_1.cabService.getById(1);
            expect(cabDetails).toEqual(resolvedValue);
        }));
    });
    describe('getCabs', () => {
        const getAllCabsSpy = jest.spyOn(Cab, 'findAll');
        it('should return array of cabs from the db', () => __awaiter(void 0, void 0, void 0, function* () {
            getAllCabsSpy.mockResolvedValue(__mocks__1.mockCabsData.cabs);
            const result = yield cab_service_1.cabService.getCabs(undefined, undefined);
            expect(result.pageMeta.pageNo).toBe(1);
            expect(result.data.length).toEqual(4);
            expect(result.pageMeta.totalPages).toBe(1);
        }));
        it('total items per page should be 2 when size provided is 2', () => __awaiter(void 0, void 0, void 0, function* () {
            getAllCabsSpy.mockResolvedValue(__mocks__1.mockCabsData.cabsFiltered);
            const pageable = { page: 2, size: 1 };
            const result = yield cab_service_1.cabService.getCabs(pageable);
            expect(result).toEqual(expect.objectContaining({
                data: expect.arrayContaining([]),
                pageMeta: expect.objectContaining({
                    itemsPerPage: expect.any(Number),
                }),
            }));
        }));
        it('pageNo should be 3 when the third page is requested', () => __awaiter(void 0, void 0, void 0, function* () {
            getAllCabsSpy.mockResolvedValue(__mocks__1.mockCabsData.cabsFiltered);
            const pageable = { page: 3, size: 2 };
            const result = yield cab_service_1.cabService.getCabs(pageable);
            expect(result).toEqual(expect.objectContaining({
                data: expect.arrayContaining([]),
                pageMeta: expect.objectContaining({
                    itemsPerPage: expect.any(Number),
                }),
            }));
        }));
    });
    describe('updateCab', () => {
        it('should update cab details successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const data = { id: 1, driverName: 'Muhwezi Dee' };
            const mockData = [1, [{ get: () => data }]];
            jest.spyOn(Cab, 'update').mockResolvedValue(mockData);
            jest.spyOn(Cab, 'findByPk')
                .mockReturnValue({
                get: ({ plain }) => {
                    if (plain)
                        return { id: 1, driverName: 'Muhwezi Dee' };
                },
            });
            const newCab = yield cab_service_1.cabService.updateCab(1, { driverName: 'Muhwezi Dee' });
            expect(newCab).toEqual(data);
        }));
        it('should return not found message if cab doesnot exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield cab_service_1.cabService.updateCab(1, { driverName: 'Muhwezi Dee' });
            expect(result).toEqual({ message: 'Update Failed. Cab does not exist' });
        }));
        it('should catch error in updating', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield cab_service_1.cabService.updateCab({});
            }
            catch (error) {
                expect(error.message).toEqual('Could not update cab details');
            }
        }));
    });
    describe('deleteCab', () => {
        it('should delete a cab successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            Cab.destroy = jest.fn(() => 1);
            const result = yield cab_service_1.cabService.deleteCab(1);
            expect(result).toEqual(1);
        }));
        it('should return zero for unexisting data', () => __awaiter(void 0, void 0, void 0, function* () {
            Cab.destroy = jest.fn(() => 0);
            const result = yield cab_service_1.cabService.deleteCab(1);
            expect(result).toEqual(0);
        }));
    });
});
//# sourceMappingURL=CabService.spec.js.map