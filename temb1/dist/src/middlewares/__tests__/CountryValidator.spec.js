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
const CountryValidator_1 = __importDefault(require("../CountryValidator"));
const GeneralValidator_1 = __importDefault(require("../GeneralValidator"));
const errorHandler_1 = __importDefault(require("../../helpers/errorHandler"));
const CountryHelper_1 = __importDefault(require("../../helpers/CountryHelper"));
const responseHelper_1 = __importDefault(require("../../helpers/responseHelper"));
const CountryValidatorMocks_1 = __importDefault(require("../__mocks__/CountryValidatorMocks"));
const errorMessage = 'Validation error occurred, see error object for details';
describe('CountryValidator', () => {
    let res;
    let validReq;
    let invalidRequest;
    let next;
    let req;
    let message;
    beforeEach(() => {
        res = {
            status: jest.fn(() => ({
                json: jest.fn()
            }))
        };
        validReq = {
            body: {
                name: 'Nigeria'
            }
        };
        invalidRequest = {
            body: {
                name: ''
            }
        };
        next = jest.fn();
        errorHandler_1.default.sendErrorResponse = jest.fn();
        responseHelper_1.default.sendResponse = jest.fn();
    });
    afterEach((done) => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
        done();
    });
    describe('validateCountryReqBody', () => {
        it('test with valid request data', () => {
            CountryValidator_1.default.validateCountryReqBody(validReq, res, next);
            expect(next).toHaveBeenCalled();
        });
        it('test with invalid request data', () => {
            CountryValidator_1.default.validateCountryReqBody(invalidRequest, res, next);
            expect(errorHandler_1.default.sendErrorResponse)
                .toHaveBeenCalledWith({
                statusCode: 400,
                message: errorMessage,
                error: { name: 'please provide a valid name' }
            }, res);
        });
    });
    describe('validateUpdateReqBody', () => {
        beforeEach(() => {
            req = { body: { name: '', newName: 'Kenya' } };
            message = 'name is not allowed to be empty\nplease provide a valid name\n';
        });
        it('test with valid request body', () => {
            req = { body: { name: 'Uganda', newName: 'Kenya' } };
            CountryValidator_1.default.validateUpdateReqBody(req, res, next);
            expect(next).toHaveBeenCalled();
        });
        it('test with request body missing name/newName', () => {
            CountryValidator_1.default.validateUpdateReqBody(req, res, next);
            expect(errorHandler_1.default.sendErrorResponse)
                .toHaveBeenCalledWith({
                statusCode: 400,
                message: errorMessage,
                error: { name: 'please provide a valid name' }
            }, res);
        });
    });
    describe('validateCountryExistence', () => {
        let countryExistSpy;
        beforeEach(() => {
            req = { body: { name: 'Nigeria' }, query: { action: '' } };
            message = 'Country named: \'Nigeria\' is not listed globally';
            countryExistSpy = jest.spyOn(CountryHelper_1.default, 'checkCountry');
        });
        it('test when country exists', () => __awaiter(void 0, void 0, void 0, function* () {
            countryExistSpy.mockResolvedValue(true);
            yield CountryValidator_1.default.validateCountryExistence(req, res, next);
            expect(countryExistSpy).toHaveBeenCalledWith(req.body.name);
            expect(next).toHaveBeenCalled();
        }));
        it('test when country does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            countryExistSpy.mockResolvedValue(false);
            yield CountryValidator_1.default.validateCountryExistence(req, res, next);
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalledWith(res, 404, false, message);
        }));
        it('test when req.query.action is true', () => __awaiter(void 0, void 0, void 0, function* () {
            req = { body: { name: 'Nigeria' }, query: { action: 'doSomething' } };
            yield CountryValidator_1.default.validateCountryExistence(req, res, next);
            expect(countryExistSpy).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
        }));
    });
    describe('validateNamedCountryExists', () => {
        let countryExistSpy;
        beforeEach(() => {
            req = { body: { name: 'Nigeria' }, query: { action: '' } };
            message = `Country with name: '${req.body.name}' does not exist`;
            countryExistSpy = jest.spyOn(CountryHelper_1.default, 'checkIfCountryExists');
        });
        it('test when country exists', () => __awaiter(void 0, void 0, void 0, function* () {
            countryExistSpy.mockResolvedValue(true);
            yield CountryValidator_1.default.validateNamedCountryExists(req, res, next);
            expect(next).toHaveBeenCalled();
        }));
        it('test when country does not exist and id is passed', () => __awaiter(void 0, void 0, void 0, function* () {
            req = { body: { id: 1 }, query: { action: '' } };
            message = `Country with id: '${req.body.id}' does not exist`;
            countryExistSpy.mockResolvedValue(null);
            yield CountryValidator_1.default.validateNamedCountryExists(req, res, next);
            expect(countryExistSpy).toHaveBeenCalledWith(undefined, req.body.id);
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalledWith(res, 404, false, message);
        }));
        it('test when country does not exist and name is passed', () => __awaiter(void 0, void 0, void 0, function* () {
            countryExistSpy.mockResolvedValue(null);
            yield CountryValidator_1.default.validateNamedCountryExists(req, res, next);
            expect(countryExistSpy).toHaveBeenCalledWith(req.body.name, undefined);
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalledWith(res, 404, false, message);
        }));
        it('test when req.query.action is true', () => __awaiter(void 0, void 0, void 0, function* () {
            req = { body: { name: 'Nigeria' }, query: { action: 'doSomething' } };
            yield CountryValidator_1.default.validateNamedCountryExists(req, res, next);
            expect(countryExistSpy).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
        }));
    });
    describe('validateIfCountryNameIsTaken', () => {
        let countryExistSpy;
        let isEmptySpy;
        beforeEach(() => {
            req = { body: { newName: 'Nigeria' } };
            message = `The country name: '${req.body.newName}' is already taken`;
            isEmptySpy = jest.spyOn(GeneralValidator_1.default, 'isEmpty');
            countryExistSpy = jest.spyOn(CountryHelper_1.default, 'checkIfCountryExists');
        });
        it('test country name taken', () => __awaiter(void 0, void 0, void 0, function* () {
            isEmptySpy.mockReturnValue(false);
            countryExistSpy.mockResolvedValue(true);
            yield CountryValidator_1.default.validateIfCountryNameIsTaken(req, res, next);
            expect(isEmptySpy).toHaveBeenCalledWith(req.body.newName);
            expect(countryExistSpy).toHaveBeenCalledWith(req.body.newName);
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalledWith(res, 400, false, message);
        }));
        it('test empty country name in request body', () => __awaiter(void 0, void 0, void 0, function* () {
            req = { body: { newName: ' ' } };
            isEmptySpy.mockResolvedValue(true);
            yield CountryValidator_1.default.validateIfCountryNameIsTaken(req, res, next);
            expect(countryExistSpy).not.toHaveBeenCalled();
            expect(isEmptySpy).toHaveBeenCalledWith(req.body.newName);
            expect(next).toHaveBeenCalled();
        }));
        it('test country does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            isEmptySpy.mockReturnValue(false);
            countryExistSpy.mockResolvedValue(false);
            yield CountryValidator_1.default.validateIfCountryNameIsTaken(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(responseHelper_1.default.sendResponse).not.toHaveBeenCalled();
        }));
    });
    describe('setToActiveIfDeleted', () => {
        let countryDeletedSpy;
        beforeEach(() => {
            req = { body: { name: 'Uganda' } };
            countryDeletedSpy = jest.spyOn(CountryHelper_1.default, 'validateIfCountryIsDeleted');
        });
        it('test country status is set to active', () => __awaiter(void 0, void 0, void 0, function* () {
            countryDeletedSpy.mockResolvedValue(CountryValidatorMocks_1.default);
            yield CountryValidator_1.default.setToActiveIfDeleted(req, res, next);
            expect(CountryValidatorMocks_1.default.status).toBe('Active');
            expect(CountryValidatorMocks_1.default.save).toHaveBeenCalled();
        }));
        it('test when the return value is a null', () => __awaiter(void 0, void 0, void 0, function* () {
            countryDeletedSpy.mockResolvedValue(null);
            yield CountryValidator_1.default.setToActiveIfDeleted(req, res, next);
            expect(countryDeletedSpy).toHaveBeenCalledWith(req.body.name);
            expect(next).toHaveBeenCalled();
        }));
    });
});
//# sourceMappingURL=CountryValidator.spec.js.map