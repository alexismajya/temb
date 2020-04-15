"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = __importDefault(require("faker"));
const mainValidor_1 = __importStar(require("../mainValidor"));
const JoiHelper_1 = __importDefault(require("../../helpers/JoiHelper"));
const ValidationSchemas_1 = require("../ValidationSchemas");
describe('Main validator', () => {
    let req;
    let res;
    let next;
    const email = faker_1.default.internet.email();
    beforeEach(() => {
        res = {
            status: jest.fn(() => ({
                json: jest.fn(),
            })).mockReturnValue({ json: jest.fn() }),
        };
        req = {
            method: 'random',
            body: {
                name: 'Updated Department',
                headEmail: 1,
                homebaseId: 1,
            },
            params: { id: 1 },
        };
        next = jest.fn(() => { });
    });
    describe('Request properties validator', () => {
        it('should validate the body of the request and return validation messages', (done) => {
            const joiHelperSpy = jest.spyOn(JoiHelper_1.default, 'validateSubmission');
            const errorObject = mainValidor_1.validateProperties(req, ValidationSchemas_1.updateDepartment);
            expect(joiHelperSpy).toHaveBeenCalled();
            expect(errorObject).toEqual({
                errorMessage: 'Validation error occurred, see error object for details',
                errors: {
                    headEmail: 'headEmail must be a string',
                    homebaseId: 'homebaseId is not allowed'
                },
                success: false
            });
            done();
        });
        it('should validate the body successfully', (done) => {
            const joiHelperSpy = jest.spyOn(JoiHelper_1.default, 'validateSubmission');
            req.body = {
                name: 'Updated Department',
                headEmail: email,
            };
            const errorObject = mainValidor_1.validateProperties(req, ValidationSchemas_1.updateDepartment);
            expect(joiHelperSpy).toHaveBeenCalled();
            expect(errorObject).toEqual({ success: true });
            done();
        });
    });
    describe('Main validator', () => {
        it('fails because of unsupported method', (done) => {
            const callbackFunction = mainValidor_1.default(ValidationSchemas_1.updateDepartment);
            callbackFunction(req, res, next);
            expect(res.status).toHaveBeenCalledWith(405);
            expect(res.status().json).toHaveBeenCalledWith({
                message: 'Http method Not Allowed',
                success: false
            });
            done();
        });
        it('validates the body and returns an error message', (done) => {
            req.method = 'put';
            const joiHelperSpy = jest.spyOn(JoiHelper_1.default, 'validateSubmission');
            const callbackFunction = mainValidor_1.default(ValidationSchemas_1.updateDepartment);
            callbackFunction(req, res, next);
            expect(joiHelperSpy).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.status().json).toHaveBeenCalledWith({
                message: 'Validation error occurred, see error object for details',
                success: false,
                error: {
                    headEmail: 'headEmail must be a string',
                    homebaseId: 'homebaseId is not allowed'
                }
            });
            expect(next).toHaveBeenCalledTimes(0);
            done();
        });
        it('validates the body successfully', (done) => {
            req.method = 'put';
            req.body = {
                name: 'Updated Department',
                headEmail: email,
            };
            const joiHelperSpy = jest.spyOn(JoiHelper_1.default, 'validateSubmission');
            const callbackFunction = mainValidor_1.default(ValidationSchemas_1.updateDepartment);
            callbackFunction(req, res, next);
            expect(joiHelperSpy).toHaveBeenCalled();
            expect(next).toHaveBeenCalledTimes(1);
            done();
        });
    });
});
//# sourceMappingURL=mainValidator.spec.js.map