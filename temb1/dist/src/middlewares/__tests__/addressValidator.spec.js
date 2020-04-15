"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AddressValidator_1 = __importDefault(require("../AddressValidator"));
const errorHandler_1 = __importDefault(require("../../helpers/errorHandler"));
let res;
let next;
describe('AddressValidator_validateAddressBody', () => {
    beforeEach(() => {
        res = {
            status: jest.fn(() => ({
                json: jest.fn()
            }))
        };
        next = jest.fn();
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('should return error for invalid longitude and latitude', (done) => {
        jest.spyOn(errorHandler_1.default, 'sendErrorResponse');
        AddressValidator_1.default.validateAddressBody({ body: {} }, res, next);
        expect(errorHandler_1.default.sendErrorResponse).toHaveBeenCalled();
        done();
    });
});
//# sourceMappingURL=addressValidator.spec.js.map