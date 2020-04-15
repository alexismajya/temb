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
const supertest_1 = __importDefault(require("supertest"));
const web_socket_event_service_1 = __importDefault(require("../../events/web-socket-event.service"));
const app_1 = __importDefault(require("../../../app"));
const utils_1 = __importDefault(require("../../../utils"));
const database_1 = __importDefault(require("../../../database"));
const cabsMocks_1 = __importDefault(require("../__mocks__/cabsMocks"));
const cab_service_1 = require("../cab.service");
const CabsController_1 = __importDefault(require("../CabsController"));
const responseHelper_1 = __importDefault(require("../../../helpers/responseHelper"));
const bugsnagHelper_1 = __importDefault(require("../../../helpers/bugsnagHelper"));
const errorHandler_1 = __importDefault(require("../../../helpers/errorHandler"));
const provider_1 = require("../../../database/models/provider");
const trip_events_handlers_1 = __importDefault(require("../../events/trip-events.handlers"));
const socket_ioMock_1 = __importDefault(require("../../slack/__mocks__/socket.ioMock"));
const { models: { Cab, User, Provider } } = database_1.default;
const apiURL = '/api/v1/cabs';
beforeEach(() => {
    jest.spyOn(trip_events_handlers_1.default, 'getSocketService').mockImplementationOnce(() => (new web_socket_event_service_1.default(socket_ioMock_1.default)));
});
describe(CabsController_1.default, () => {
    let req;
    let res;
    let cabServiceSpy;
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
        cabServiceSpy = jest.spyOn(cab_service_1.cabService, 'getCabs');
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe(CabsController_1.default.getAllCabs, () => {
        it('Should get all cabs and return a success message', () => __awaiter(void 0, void 0, void 0, function* () {
            const { cabs, successMessage, returnedData } = cabsMocks_1.default;
            cabServiceSpy.mockResolvedValue(cabs);
            jest.spyOn(responseHelper_1.default, 'sendResponse').mockReturnValue();
            yield CabsController_1.default.getAllCabs(req, res);
            expect(responseHelper_1.default.sendResponse).toBeCalledWith(res, 200, true, successMessage, returnedData);
        }));
        it('Should catch errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error('Something went wrong');
            cabServiceSpy.mockRejectedValue(error);
            jest.spyOn(bugsnagHelper_1.default, 'log').mockReturnValue();
            jest.spyOn(errorHandler_1.default, 'sendErrorResponse').mockReturnValue();
            yield CabsController_1.default.getAllCabs(req, res);
            expect(bugsnagHelper_1.default.log).toBeCalledWith(error);
            expect(errorHandler_1.default.sendErrorResponse).toBeCalledWith(error, res);
        }));
    });
});
describe(CabsController_1.default, () => {
    let validToken;
    let headers;
    let providerId;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const testUser = yield User.create({
            slackId: 'UE1DDAR4M',
            phoneNo: '+243455345675784',
            email: 'cabcontroller@test.com',
            name: 'Cab Controller',
        });
        ({ id: providerId } = yield Provider.create({
            name: 'hello',
            email: 'randomprovider@whatever.com',
            phoneNo: '+2341718267838',
            providerUserId: testUser.id,
            notificationChannel: provider_1.ProviderNotificationChannel.directMessage,
        }));
        cabsMocks_1.default.payload.providerId = providerId;
        validToken = utils_1.default.generateToken('30m', { userInfo: { roles: ['Super Admin'] } });
        headers = {
            Accept: 'application/json',
            Authorization: validToken
        };
    }), 10000);
    afterAll((done) => database_1.default.close().then(done, done));
    describe(CabsController_1.default.createCab, () => {
        it('should return success true', (done) => {
            supertest_1.default(app_1.default)
                .post(apiURL)
                .send(cabsMocks_1.default.payload)
                .set(headers)
                .expect(201, (err, res) => {
                const { body } = res;
                expect(body).toHaveProperty('success');
                expect(body.success).toBe(true);
                expect(body).toHaveProperty('message');
                expect(body.message).toBe('You have successfully created a cab');
                expect(body.cab).toEqual(expect.objectContaining({
                    regNumber: 'KCA 545',
                    capacity: '1',
                    model: 'Limo'
                }));
                done();
            });
        });
        it('should return success false if there is a conflict', (done) => {
            supertest_1.default(app_1.default)
                .post(apiURL)
                .send(cabsMocks_1.default.payload)
                .set(headers)
                .expect(409, {
                success: false,
                message: 'Cab with this registration number already exists'
            }, done);
        });
    });
    describe('Get All Cabs', () => {
        it('should return the first page of cabs by default', (done) => {
            supertest_1.default(app_1.default)
                .get(apiURL)
                .set(headers)
                .expect(200, (err, res) => {
                const { body } = res;
                expect(body.message).toBe('1 of 1 page(s).');
                expect(body).toHaveProperty('data');
                expect(body.data).toHaveProperty('pageMeta');
                expect(body.data).toHaveProperty('data');
                done();
            });
        });
        it('pagination should work as expected', (done) => {
            supertest_1.default(app_1.default)
                .get(`${apiURL}?size=2&page=2`)
                .set(headers)
                .expect(200, (err, res) => {
                const { body } = res;
                expect(body).toEqual({
                    message: '1 of 1 page(s).',
                    success: true,
                    data: {
                        data: [],
                        pageMeta: {
                            itemsPerPage: 2,
                            pageNo: 1,
                            totalItems: 0,
                            totalPages: 1,
                        },
                    }
                });
                done();
            });
        });
        it('should fail when invalid query params are provided', (done) => {
            supertest_1.default(app_1.default)
                .get(`${apiURL}?page=a&size=b`)
                .set(headers)
                .expect(400, {
                success: false,
                message: {
                    errorMessage: 'Validation error occurred, see error object for details',
                    page: 'page should be a number',
                    size: 'size should be a number'
                }
            }, done);
        });
    });
    describe('updateCabDetails', () => {
        it('should fail to update if parameter is not a valid integer', () => __awaiter(void 0, void 0, void 0, function* () {
            yield supertest_1.default(app_1.default)
                .put(`${apiURL}/udd`)
                .send(cabsMocks_1.default.updateData)
                .set(headers)
                .expect(400, {
                message: 'Please provide a positive integer value',
                success: false
            });
        }));
        it('should fail to update if no data is provided', (done) => {
            supertest_1.default(app_1.default)
                .put(`${apiURL}/1`)
                .send({})
                .set(headers)
                .expect(400, {
                success: false,
                message: 'Validation error occurred, see error object for details',
                error: { regNumber: 'Please provide regNumber' }
            }, done);
        });
        it('should update cab details successfully', (done) => {
            supertest_1.default(app_1.default)
                .put(`${apiURL}/1`)
                .send(cabsMocks_1.default.updateData)
                .set(headers)
                .expect(200)
                .end((err, res) => {
                expect(err).toBe(null);
                const { body, status } = res;
                expect(body.data.regNumber).toEqual(cabsMocks_1.default.updateData.regNumber);
                expect(status).toEqual(200);
                done();
            });
        });
        it('should return 404 if cab not found', (done) => {
            supertest_1.default(app_1.default)
                .put(`${apiURL}/200`)
                .send(cabsMocks_1.default.updateDatamock)
                .set(headers)
                .expect(404)
                .end((err, res) => {
                expect(err).toBe(null);
                const { body, status } = res;
                expect(body).toEqual({ success: false, message: 'Update Failed. Cab does not exist' });
                expect(status).toEqual(404);
                done();
            });
        });
        it('should return 409 if there is a conflict', (done) => {
            supertest_1.default(app_1.default)
                .put(`${apiURL}/200`)
                .send(cabsMocks_1.default.updateData)
                .set(headers)
                .expect(409)
                .end((err, res) => {
                expect(err).toBe(null);
                const { body, status } = res;
                expect(body).toEqual({
                    success: false, message: 'Cab with registration number already exists'
                });
                expect(status).toEqual(409);
                done();
            });
        });
        it('should handle internal server error', (done) => {
            jest.spyOn(cab_service_1.cabService, 'updateCab')
                .mockRejectedValue(new Error('dummy error'));
            supertest_1.default(app_1.default)
                .put(`${apiURL}/1`)
                .send(cabsMocks_1.default.updateData)
                .set(headers)
                .expect(500)
                .end((err, res) => {
                const { body } = res;
                expect(body).toHaveProperty('message');
                expect(body).toHaveProperty('success');
                expect(body).toEqual({ message: 'dummy error', success: false });
                done();
            });
        });
    });
    describe('deleteCab', () => {
        let deleteCabId;
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            ({ id: deleteCabId } = yield Cab.create({
                regNumber: 'KCA-SDD-3453',
                model: 'Audi',
                capacity: 3,
            }));
        }));
        it('should delete a cab successfully', (done) => {
            supertest_1.default(app_1.default)
                .delete(`${apiURL}/${deleteCabId}`)
                .set(headers)
                .expect(200, {
                success: true,
                message: 'Cab successfully deleted'
            }, done);
        });
        it('should return an error when a cab does not exist', (done) => {
            supertest_1.default(app_1.default)
                .delete(`${apiURL}/89`)
                .set(headers)
                .expect(404, {
                success: false,
                message: 'Cab does not exist'
            }, done);
        });
        it('should return a server error when something goes wrong', (done) => {
            jest.spyOn(cab_service_1.cabService, 'deleteCab').mockRejectedValue();
            supertest_1.default(app_1.default)
                .delete(`${apiURL}/89`)
                .set(headers)
                .expect(500, {
                success: false,
                message: 'Server Error. Could not complete the request'
            }, done);
        });
    });
    describe('deleteCab', () => {
        let req;
        let res;
        beforeEach(() => {
            req = {
                params: {
                    id: 1
                },
                body: 'segun-andela.slack.com'
            };
            res = {
                status: jest.fn(() => ({
                    json: jest.fn(() => { })
                })).mockReturnValue({ json: jest.fn() })
            };
            jest.spyOn(cab_service_1.cabService, 'findById').mockResolvedValue({
                id: 1,
                regNumber: 'HJS-1234-JK',
                model: 'Toyota',
                providerId: '2',
            });
        });
        it('should delete a cab successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(cab_service_1.cabService, 'deleteCab').mockResolvedValue(1);
            yield CabsController_1.default.deleteCab(req, res);
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.status().json).toHaveBeenCalledWith({
                success: true,
                message: 'Cab successfully deleted'
            });
        }));
        it('should return cab does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(cab_service_1.cabService, 'deleteCab').mockResolvedValue(0);
            yield CabsController_1.default.deleteCab(req, res);
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.status().json).toHaveBeenCalledWith({
                success: false,
                message: 'Cab does not exist'
            });
        }));
        it('should return server error', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(cab_service_1.cabService, 'deleteCab').mockRejectedValue();
            yield CabsController_1.default.deleteCab(req, res);
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.status().json).toHaveBeenCalledWith({
                success: false,
                message: 'Server Error. Could not complete the request'
            });
        }));
        it('should find or create cab', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(CabsController_1.default, 'createCab').mockRejectedValue();
        }));
    });
});
//# sourceMappingURL=CabsController.spec.js.map