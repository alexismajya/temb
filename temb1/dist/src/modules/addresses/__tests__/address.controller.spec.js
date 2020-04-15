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
require("@slack/client");
const web_socket_event_service_1 = __importDefault(require("../../events/web-socket-event.service"));
const app_1 = __importDefault(require("../../../app"));
const address_controller_1 = __importDefault(require("../address.controller"));
const address_service_1 = require("../address.service");
const utils_1 = __importDefault(require("../../../utils"));
const trip_events_handlers_1 = __importDefault(require("../../events/trip-events.handlers"));
const socket_ioMock_1 = __importDefault(require("../../slack/__mocks__/socket.ioMock"));
describe('/Addresses post request for adding new address', () => {
    let validToken;
    const body = {};
    let res;
    let req;
    let req2;
    const socket = socket_ioMock_1.default;
    const mockAddress = {
        id: 2,
        address: 'dojo',
        location: {
            id: 3,
            longitude: 10,
            latitude: 72,
        }
    };
    beforeAll(() => {
        validToken = utils_1.default.generateToken('30m', { userInfo: { roles: ['Super Admin'] } });
        jest.spyOn(trip_events_handlers_1.default, 'getSocketService').mockImplementationOnce(() => (new web_socket_event_service_1.default(socket)));
        res = {
            status: jest.fn(() => ({
                json: jest.fn()
            }))
        };
    });
    describe('user input validations', () => {
        it('should respond with a compulsory property not provided', (done) => {
            supertest_1.default(app_1.default)
                .post('/api/v1/addresses')
                .send({
                longitude: 9,
                address: 'dojo'
            })
                .set({
                Accept: 'application/json',
                authorization: validToken
            })
                .expect(400, {
                success: false,
                message: 'Validation error occurred, see error object for details',
                error: { latitude: 'Please provide latitude' }
            }, done);
        });
        it('should respond with invalid longitude', (done) => {
            supertest_1.default(app_1.default)
                .post('/api/v1/addresses')
                .send({
                longitude: '1234invalid',
                latitude: 9,
                address: 'dojo'
            })
                .set({
                Accept: 'application/json',
                authorization: validToken
            })
                .expect(400, {
                success: false,
                message: 'Validation error occurred, see error object for details',
                error: { longitude: 'longitude should be a number' }
            }, done);
        });
    });
    describe('creating new address', () => {
        let addressSpy;
        beforeEach(() => {
            req = {
                body: {
                    longitude: 12,
                    latitude: 9,
                    address: 'dojo'
                }
            };
            addressSpy = jest.spyOn(address_service_1.addressService, 'createNewAddress');
        });
        it('should create a valid address successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            addressSpy.mockResolvedValue(mockAddress);
            yield address_controller_1.default.addNewAddress(req, res);
            expect(addressSpy).toHaveBeenCalledTimes(1);
        }));
    });
    describe('unsuccessfully creating new address', () => {
        it('should respond unsuccessfully creating address that exists', (done) => {
            supertest_1.default(app_1.default)
                .post('/api/v1/addresses')
                .send({
                longitude: 12,
                latitude: 9,
                address: 'dojo'
            })
                .set({
                Accept: 'application/json',
                authorization: validToken
            })
                .expect(400, {
                message: 'Address already exists',
                data: { address: { address: 'dojo' } }
            }, done);
        });
    });
    describe('/Addresses update addresses', () => {
        describe('user input validations', () => {
            it('should respond unsuccessfully for missing properties', (done) => {
                supertest_1.default(app_1.default)
                    .put('/api/v1/addresses')
                    .send({ address: 'dojo' })
                    .set({
                    Accept: 'application/json',
                    authorization: validToken
                })
                    .expect(400, {
                    success: false,
                    message: 'Validation error occurred, see error object for details',
                    error: {
                        value: '"value" must contain at least one of [newLongitude, newLatitude, newAddress]'
                    }
                }, done);
            });
            it('should respond unsuccessfully for invalid properties', (done) => {
                supertest_1.default(app_1.default)
                    .put('/api/v1/addresses')
                    .send({
                    newLongitude: '1234invalid',
                    newLatitude: 9,
                    address: 'dojo'
                })
                    .set({
                    Accept: 'application/json',
                    authorization: validToken
                })
                    .expect(400, {
                    success: false,
                    message: 'Validation error occurred, see error object for details',
                    error: {
                        newLongitude: 'newLongitude should be a number'
                    }
                }, done);
            });
        });
        describe('updating an address', () => {
            let addressSpy2;
            beforeEach(() => {
                req = {
                    body: {
                        newLongitude: 10,
                        newLatitude: 9,
                        address: 'dojo',
                        newAddress: 'dojo1'
                    }
                };
                req2 = {
                    body: {
                        newLongitude: 12,
                        newLatitude: 9,
                        address: 'dojo',
                        newAddress: 'dojo1'
                    }
                };
                addressSpy2 = jest.spyOn(address_service_1.addressService, 'updateAddress');
            });
            it('should respond unsuccessfully for address that does not exist', (done) => {
                supertest_1.default(app_1.default)
                    .put('/api/v1/addresses')
                    .send({
                    newLongitude: 12,
                    newLatitude: 9,
                    address: 'does not exist'
                })
                    .set({
                    Accept: 'application/json',
                    authorization: validToken
                })
                    .expect(404, {
                    success: false,
                    message: 'Address does not exist'
                }, done);
            });
            it('should update a valid address successfully', () => __awaiter(void 0, void 0, void 0, function* () {
                addressSpy2.mockResolvedValue(mockAddress);
                yield address_controller_1.default.updateAddress(req, res);
                expect(addressSpy2).toHaveBeenCalledTimes(1);
            }));
            it('should update only an address successfully', () => __awaiter(void 0, void 0, void 0, function* () {
                addressSpy2.mockResolvedValue(mockAddress);
                yield address_controller_1.default.updateAddress(req2, res);
                expect(addressSpy2).toHaveBeenCalledTimes(2);
            }));
        });
    });
    describe('/Addresses get addresses', () => {
        it('should return the first page of addresses', (done) => {
            supertest_1.default(app_1.default)
                .get('/api/v1/addresses')
                .set({
                Accept: 'application.json',
                authorization: validToken
            })
                .expect(200, done);
        });
        it('should fail when page does not exist', (done) => {
            supertest_1.default(app_1.default)
                .get('/api/v1/addresses?page=99999999999')
                .set({
                Accept: 'application/json',
                authorization: validToken
            })
                .expect(404, {
                success: false,
                message: 'There are no records on this page.'
            }, done);
        });
        it('pagination should work as expected', (done) => {
            supertest_1.default(app_1.default)
                .get('/api/v1/addresses?page=1&size=2')
                .set({
                Accept: 'application.json',
                authorization: validToken
            })
                .expect(200, done);
        });
        it('should fail when invalid query params are used', (done) => {
            supertest_1.default(app_1.default)
                .get('/api/v1/addresses?page=gh&size=ds')
                .set({
                Accept: 'application.json',
                authorization: validToken
            })
                .expect(400, {
                success: false,
                message: {
                    errorMessage: 'Validation error occurred, see error object for details',
                    page: 'page should be a number',
                    size: 'size should be a number'
                }
            }, done);
        });
        it('get single address should work as expected', (done) => {
            supertest_1.default(app_1.default)
                .get('/api/v1/addresses/2')
                .set({
                Accept: 'application.json',
                authorization: validToken
            })
                .expect(200, done);
        });
        it('should fail when invalid query params is not postive number', (done) => {
            supertest_1.default(app_1.default)
                .get('/api/v1/addresses/-1')
                .set({
                Accept: 'application.json',
                authorization: validToken
            })
                .expect(400, {
                success: false,
                message: 'Please provide a positive integer value'
            }, done);
        });
    });
    describe('AddressController', () => {
        const errorMessage = "Cannot read property 'status' of undefined";
        it('should return error for invalid parameters in addNewAddress', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield address_controller_1.default.addNewAddress(req, res);
            }
            catch (error) {
                expect(error.message).toBe(errorMessage);
            }
        }));
        it('should return error for invalid parameters in updateAddress', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(address_controller_1.default.updateAddress(req, res)).rejects.toThrow(errorMessage);
        }));
    });
});
//# sourceMappingURL=address.controller.spec.js.map