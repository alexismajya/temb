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
const CabsValidator_1 = __importDefault(require("../CabsValidator"));
const CabsValidatorMocks_1 = __importDefault(require("../__mocks__/CabsValidatorMocks"));
const errorHandler_1 = __importDefault(require("../../helpers/errorHandler"));
const responseHelper_1 = __importDefault(require("../../helpers/responseHelper"));
describe('CabsValidator', () => {
    let res;
    let next;
    const { correctReq, incompleteReq, invalidCapacityReq, emptySpacesReq, errorMessages, emptyValueInBody, invalidCapacityError, emptyInputError, invalidReqParams, invalidParamsError, noValueErrors, validUpdateBody, } = CabsValidatorMocks_1.default;
    beforeEach(() => {
        res = {
            status: jest.fn(() => ({
                json: jest.fn()
            })).mockReturnValue({ json: jest.fn() })
        };
        next = jest.fn();
        errorHandler_1.default.sendErrorResponse = jest.fn();
        responseHelper_1.default.sendResponse = jest.fn();
    });
    afterEach((done) => {
        jest.restoreAllMocks();
        done();
    });
    describe('validateAllInputs', () => {
        it('should return next if there are no validation errors', () => __awaiter(void 0, void 0, void 0, function* () {
            yield CabsValidator_1.default.validateAllInputs(correctReq, res, next);
            expect(next).toHaveBeenCalledTimes(1);
        }));
        it('should return errors if some inputs have been left out', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(errorHandler_1.default, 'sendErrorResponse').mockResolvedValue(errorMessages, res);
            const response = yield CabsValidator_1.default.validateAllInputs(incompleteReq, res, next);
            expect(errorHandler_1.default.sendErrorResponse).toHaveBeenCalledTimes(1);
            expect(response).toEqual(errorMessages);
        }));
        it('should return capacity should be a number greater than zero', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(errorHandler_1.default, 'sendErrorResponse').mockResolvedValue(invalidCapacityError, res);
            const response = yield CabsValidator_1.default.validateAllInputs(invalidCapacityReq, res);
            expect(errorHandler_1.default.sendErrorResponse).toHaveBeenCalledTimes(1);
            expect(response).toEqual(invalidCapacityError);
        }));
        it('should return empty inputs errors', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(errorHandler_1.default, 'sendErrorResponse').mockResolvedValue(emptyInputError, res);
            const response = yield CabsValidator_1.default.validateAllInputs(emptySpacesReq, res, next);
            expect(errorHandler_1.default.sendErrorResponse).toHaveBeenCalledTimes(1);
            expect(response).toEqual(emptyInputError);
        }));
    });
    describe('validateCabUpdateBody', () => {
        it('should validate Params', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(errorHandler_1.default, 'sendErrorResponse').mockResolvedValue(invalidParamsError, res);
            yield CabsValidator_1.default.validateCabUpdateBody(invalidReqParams, res, next);
            expect(errorHandler_1.default.sendErrorResponse).toHaveBeenCalledTimes(1);
        }));
        it('should check empty input data', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(errorHandler_1.default, 'sendErrorResponse').mockResolvedValue(noValueErrors, res);
            yield CabsValidator_1.default.validateCabUpdateBody(emptyValueInBody, res, next);
            expect(errorHandler_1.default.sendErrorResponse).toHaveBeenCalledTimes(1);
        }));
        it('should skip checkInputValidity if Phone, capacity and location are null', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(errorHandler_1.default, 'sendErrorResponse');
            yield CabsValidator_1.default.validateCabUpdateBody(validUpdateBody, res, next);
            expect(next).toBeCalled();
            expect(errorHandler_1.default.sendErrorResponse).not.toBeCalled();
        }));
    });
    describe('validateDeleteCabIdParam', () => {
        it('should return invalid cab id if number not used', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                params: {
                    id: 'string'
                }
            };
            yield CabsValidator_1.default.validateDeleteCabIdParam(req, res, next);
            expect(res.status).toBeCalledWith(400);
            expect(res.status().json).toHaveBeenCalledWith({
                message: 'Please provide a positive integer value',
                success: false
            });
        }));
        it('should return next', () => {
            const req = {
                params: {
                    id: 7
                }
            };
            CabsValidator_1.default.validateDeleteCabIdParam(req, res, next);
            expect(errorHandler_1.default.sendErrorResponse).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=CabsValidator.spec.js.map