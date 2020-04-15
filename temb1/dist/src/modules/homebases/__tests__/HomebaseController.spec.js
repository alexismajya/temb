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
const errorHandler_1 = __importDefault(require("../../../helpers/errorHandler"));
const bugsnagHelper_1 = __importDefault(require("../../../helpers/bugsnagHelper"));
const HomebaseController_1 = __importDefault(require("../HomebaseController"));
const country_service_1 = require("../../countries/country.service");
const homebase_service_1 = require("../homebase.service");
const __mocks__1 = require("../../../services/__mocks__");
describe('Test HomebaseController', () => {
    let req;
    const res = {
        status() {
            return this;
        },
        json() {
            return this;
        }
    };
    errorHandler_1.default.sendErrorResponse = jest.fn();
    bugsnagHelper_1.default.log = jest.fn();
    beforeEach(() => {
        jest.spyOn(res, 'status');
        jest.spyOn(res, 'json');
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    describe('test addHomebase', () => {
        let homebaseSpy;
        let countrySpy;
        beforeEach(() => {
            req = {
                body: {
                    homebaseName: 'Nairobi',
                    channel: 'UOP23',
                    address: {
                        address: 'nairobi',
                        location: {
                            longitude: '23', latitude: '53'
                        }
                    },
                    countryId: 1
                }
            };
            homebaseSpy = jest.spyOn(homebase_service_1.homebaseService, 'createHomebase');
            countrySpy = jest.spyOn(country_service_1.countryService, 'findCountry');
        });
        it('should create a homebase successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            homebaseSpy.mockResolvedValue(__mocks__1.mockCreatedHomebase);
            yield HomebaseController_1.default.addHomeBase(req, res);
            expect(homebaseSpy).toHaveBeenCalledWith({
                name: 'Nairobi',
                channel: 'UOP23',
                address: {
                    address: 'nairobi',
                    location: {
                        longitude: '23', latitude: '53'
                    }
                },
                countryId: 1
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Homebase created successfully',
                homeBase: __mocks__1.mockCreatedHomebase.homebase
            });
        }));
        it('should return a 409 status if homebase exists', () => __awaiter(void 0, void 0, void 0, function* () {
            countrySpy.mockResolvedValue(__mocks__1.mockCountry);
            homebaseSpy.mockResolvedValue(__mocks__1.mockExistingHomebase);
            yield HomebaseController_1.default.addHomeBase(req, res);
            expect(res.status).toHaveBeenCalledWith(409);
        }));
        it('should send a HTTP error response if err', () => __awaiter(void 0, void 0, void 0, function* () {
            const err = 'validationError: There was a conflict';
            countrySpy.mockResolvedValue(__mocks__1.mockCountry);
            homebaseSpy.mockRejectedValue(err);
            yield HomebaseController_1.default.addHomeBase(req, res);
            expect(bugsnagHelper_1.default.log).toHaveBeenCalledWith(err);
            expect(errorHandler_1.default.sendErrorResponse).toHaveBeenCalledWith(err, res);
        }));
    });
    describe('test getHomebases', () => {
        const newReq = {
            query: {
                page: 1, size: 5
            }
        };
        const { query: { page, size } } = newReq;
        const pageable = { page, size };
        let getHomebaseSpy;
        beforeEach(() => {
            jest.spyOn(homebase_service_1.homebaseService, 'getWhereClause');
            getHomebaseSpy = jest.spyOn(homebase_service_1.homebaseService, 'getHomebases');
        });
        it('returns a single homebase', () => __awaiter(void 0, void 0, void 0, function* () {
            const where = {};
            getHomebaseSpy.mockResolvedValue(__mocks__1.mockGetHomebaseResponse);
            yield HomebaseController_1.default.getHomebases(newReq, res);
            expect(homebase_service_1.homebaseService.getWhereClause).toHaveBeenCalledWith(newReq.query);
            expect(homebase_service_1.homebaseService.getHomebases).toHaveBeenCalledWith(pageable, where);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: '1 of 1 page(s).',
                homebase: __mocks__1.mockGetHomebaseResponse.homebases
            });
        }));
        it('returns multiple homebases', () => __awaiter(void 0, void 0, void 0, function* () {
            const where = {};
            const pageMeta = {
                totalPages: 1,
                page: 1,
                totalResults: 2,
                pageSize: 10
            };
            getHomebaseSpy.mockResolvedValue(__mocks__1.mockHomebaseResponse);
            yield HomebaseController_1.default.getHomebases(newReq, res);
            expect(homebase_service_1.homebaseService.getWhereClause).toHaveBeenCalledWith(newReq.query);
            expect(homebase_service_1.homebaseService.getHomebases).toHaveBeenCalledWith(pageable, where);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: '1 of 1 page(s).',
                pageMeta,
                homebases: __mocks__1.mockHomebaseResponse.homebases
            });
        }));
        it('should send HTTP errors', () => __awaiter(void 0, void 0, void 0, function* () {
            getHomebaseSpy.mockRejectedValueOnce('an error');
            yield HomebaseController_1.default.getHomebases(newReq, res);
            expect(errorHandler_1.default.sendErrorResponse).toHaveBeenCalled();
            expect(bugsnagHelper_1.default.log).toHaveBeenCalled();
        }));
    });
    describe('Update homebase', () => {
        let findCountrySpy;
        let findHomeBase;
        beforeEach(() => {
            req = {
                body: {
                    homebaseName: 'Cairo',
                    countryName: 'Rwanda',
                    channel: 'UIO0ED',
                    countryId: 1,
                },
                params: {
                    id: 3,
                }
            };
            jest.spyOn(res, 'status');
            findCountrySpy = jest.spyOn(country_service_1.countryService, 'findCountry');
            findHomeBase = jest.spyOn(homebase_service_1.homebaseService, 'getById');
            jest.spyOn(errorHandler_1.default, 'sendErrorResponse');
        });
        it('should return an error if homebase already  exists ', () => __awaiter(void 0, void 0, void 0, function* () {
            findCountrySpy.mockImplementation(() => Promise.resolve({
                dataValues: {
                    id: 1
                }
            }));
            jest.spyOn(homebase_service_1.homebaseService, 'updateDetails').mockRejectedValue();
            req = {
                body: {
                    homebaseName: 'Nairobi'
                },
                params: {
                    id: 2
                }
            };
            yield HomebaseController_1.default.update(req, res);
            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Homebase with specified name already exists',
                success: false
            });
        }));
        it('should handle successful update of homebase', () => __awaiter(void 0, void 0, void 0, function* () {
            findCountrySpy.mockImplementation(() => Promise.resolve({
                dataValues: {
                    id: 1
                }
            }));
            findHomeBase.mockImplementation(() => Promise.resolve({ id: 1, countryId: 1, name: 'Cairo' }));
            const homeBaseResponse = {
                id: 1, countryId: 1, name: 'Cairo'
            };
            jest.spyOn(homebase_service_1.homebaseService, 'updateDetails').mockResolvedValue(homeBaseResponse);
            yield HomebaseController_1.default.update(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                homebase: Object.assign({}, homeBaseResponse),
                message: 'HomeBase Updated successfully',
                success: true
            });
        }));
    });
});
//# sourceMappingURL=HomebaseController.spec.js.map