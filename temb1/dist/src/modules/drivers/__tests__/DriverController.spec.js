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
const DriverController_1 = __importDefault(require("../DriverController"));
const responseHelper_1 = __importDefault(require("../../../helpers/responseHelper"));
const driver_service_1 = require("../driver.service");
const driver_1 = __importDefault(require("../../../database/models/driver"));
const provider_service_1 = require("../../providers/provider.service");
const mockData_1 = require("./mockData");
const bugsnagHelper_1 = __importDefault(require("../../../helpers/bugsnagHelper"));
const driversMocks_1 = __importDefault(require("../__mocks__/driversMocks"));
const errorHandler_1 = __importDefault(require("../../../helpers/errorHandler"));
const routeBatch_service_1 = require("../../routeBatches/routeBatch.service");
const providersController_mock_1 = require("../../slack/RouteManagement/__mocks__/providersController.mock");
describe('DriverController', () => {
    bugsnagHelper_1.default.log = jest.fn();
    let createDriverSpy;
    let updateDriverSpy;
    let res;
    responseHelper_1.default.sendResponse = jest.fn();
    beforeEach(() => {
        createDriverSpy = jest.spyOn(driver_service_1.driverService, 'create');
        res = {
            status: jest.fn(() => ({
                json: jest.fn(() => { })
            })).mockReturnValue({ json: jest.fn() })
        };
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe('DriverController_addDriver', () => {
        it('should create driver successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(provider_service_1.providerService, 'findByPk').mockReturnValue({});
            createDriverSpy.mockReturnValue(mockData_1.mockData);
            yield DriverController_1.default.addProviderDriver(mockData_1.createReq, res);
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalled();
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalledWith(res, 201, true, 'Driver added successfully', mockData_1.expected);
        }));
        it('should return errors if they exist', () => __awaiter(void 0, void 0, void 0, function* () {
            createDriverSpy.mockReturnValue({
                errors: [
                    {
                        message: 'driverPhoneNo must be unique'
                    }
                ]
            });
            yield DriverController_1.default.addProviderDriver({}, res);
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalled();
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalledWith(res, 400, false, 'driverPhoneNo must be unique');
        }));
        it('should return error if a driver with a number exists', () => __awaiter(void 0, void 0, void 0, function* () {
            createDriverSpy.mockReturnValue(mockData_1.existingUserMock);
            yield DriverController_1.default.addProviderDriver(mockData_1.createReq, res);
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalled();
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalledWith(res, 409, false, `Driver with  driver Number ${mockData_1.createReq.body.driverNumber} already exists`);
        }));
        it('should throw an error if creating a driver fails', () => __awaiter(void 0, void 0, void 0, function* () {
            createDriverSpy.mockRejectedValue('Something went wrong');
            yield DriverController_1.default.addProviderDriver(mockData_1.createReq, res);
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalled();
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalledWith(res, 500, false, 'An error occurred in the creation of the driver');
        }));
        describe('Update driver', () => {
            beforeEach(() => {
                updateDriverSpy = jest.spyOn(driver_service_1.driverService, 'update');
                mockData_1.createReq.params = { driverId: 1 };
                jest.spyOn(driver_service_1.driverService, 'update').mockResolvedValue({});
            });
            it('update a driver', () => __awaiter(void 0, void 0, void 0, function* () {
                updateDriverSpy.mockResolvedValue({});
                yield DriverController_1.default.update(mockData_1.createReq, res);
                expect(responseHelper_1.default.sendResponse).toHaveBeenCalledWith(res, 200, true, 'Driver updated successfully', {});
            }));
            it('should respond with an error if the driver does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
                updateDriverSpy.mockResolvedValue({ message: 'Driver not found' });
                yield DriverController_1.default.update(mockData_1.createReq, res);
                expect(responseHelper_1.default.sendResponse).toHaveBeenCalledWith(res, 404, false, 'Driver not found');
            }));
            it('should catch errors', () => __awaiter(void 0, void 0, void 0, function* () {
                jest.spyOn(bugsnagHelper_1.default, 'log');
                jest.spyOn(errorHandler_1.default, 'sendErrorResponse');
                updateDriverSpy.mockRejectedValue({ error: 'could not update the driver details' });
                yield DriverController_1.default.update(mockData_1.createReq, res);
                expect(bugsnagHelper_1.default.log).toHaveBeenCalledWith(Error('could not update the driver details'));
                expect(errorHandler_1.default.sendErrorResponse).toHaveBeenCalled();
            }));
        });
    });
    describe('DriverController.deleteDriver', () => {
        it('should successfully delete a driver', () => __awaiter(void 0, void 0, void 0, function* () {
            const driver = { dataValues: { id: 2, providerId: 1 } };
            const req = { body: { slackUrl: 'adaeze-tembea.slack.com' } };
            res.locals = { driver };
            jest.spyOn(routeBatch_service_1.routeBatchService, 'findActiveRouteWithDriverOrCabId').mockResolvedValue([providersController_mock_1.route]);
            jest.spyOn(driver_service_1.driverService, 'deleteDriver').mockResolvedValue(1);
            yield DriverController_1.default.deleteDriver(req, res);
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalled();
        }));
    });
    describe('DriversController_getAllDrivers', () => {
        let req;
        beforeEach(() => {
            req = {
                query: {
                    page: 1, size: 3
                }
            };
            res = {
                status: jest.fn(() => ({
                    json: jest.fn(() => { })
                })).mockReturnValue({ json: jest.fn() })
            };
            jest.spyOn(driver_service_1.driverService, 'findAll').mockResolvedValue(driversMocks_1.default.findAllMock);
        });
        afterEach(() => {
            jest.resetAllMocks();
            jest.restoreAllMocks();
        });
        it('Should get all drivers and return a success message', () => __awaiter(void 0, void 0, void 0, function* () {
            const { successMessage, returnedData } = driversMocks_1.default;
            jest.spyOn(responseHelper_1.default, 'sendResponse');
            req.query.providerId = 1;
            jest.spyOn(driver_1.default, 'findAll')
                .mockResolvedValue(driversMocks_1.default.drivers.data);
            const getAllDriversSpy = jest.spyOn(driver_service_1.driverService, 'getDrivers');
            yield DriverController_1.default.getDrivers(req, res);
            expect(getAllDriversSpy).toBeCalledWith({ page: 1, size: 3 }, { providerId: 1 });
            expect(responseHelper_1.default.sendResponse).toBeCalledWith(res, 200, true, successMessage, returnedData);
        }));
        it('Should catch errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error('Something went wrong');
            jest.spyOn(driver_1.default, 'findAll')
                .mockRejectedValue(error);
            jest.spyOn(bugsnagHelper_1.default, 'log');
            jest.spyOn(errorHandler_1.default, 'sendErrorResponse');
            yield DriverController_1.default.getDrivers(req, res);
            expect(bugsnagHelper_1.default.log).toBeCalledWith(error);
            expect(errorHandler_1.default.sendErrorResponse).toBeCalledWith(error, res);
        }));
    });
});
//# sourceMappingURL=DriverController.spec.js.map