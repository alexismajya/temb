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
const responseHelper_1 = __importDefault(require("../../helpers/responseHelper"));
const HomeBaseFilterValidator_1 = __importDefault(require("../HomeBaseFilterValidator"));
describe('HomeBaseFilterValidator', () => {
    let ResponseSpy;
    let next;
    let req;
    let res;
    beforeAll(() => {
        ResponseSpy = jest.spyOn(responseHelper_1.default, 'sendResponse');
        next = jest.fn();
        res = {
            status: jest.fn(() => ({
                json: jest.fn()
            }))
        };
        req = { headers: {}, currentUser: { userInfo: { roles: ['Super Admin'], locations: [] } } };
    });
    it('should throw error if homebaseId is missing in headers', () => __awaiter(void 0, void 0, void 0, function* () {
        yield HomeBaseFilterValidator_1.default.validateHomeBaseAccess(req, res, next);
        expect(ResponseSpy).toHaveBeenCalledWith(res, 400, false, 'Missing HomebaseId in request headers');
    }));
    it('should throw permission error if user doesnot permission to view location info', () => __awaiter(void 0, void 0, void 0, function* () {
        req.headers = { homebaseid: 1 };
        yield HomeBaseFilterValidator_1.default.validateHomeBaseAccess(req, res, next);
        expect(ResponseSpy).toHaveBeenCalledWith(res, 403, false, 'You dont have permissions to view this location data');
    }));
    it('should call next if the user has permission to view other location data', () => __awaiter(void 0, void 0, void 0, function* () {
        req.currentUser.userInfo.locations = [{ id: 1 }];
        req.headers = { homebaseid: 1 };
        yield HomeBaseFilterValidator_1.default.validateHomeBaseAccess(req, res, next);
        expect(next).toHaveBeenCalled();
    }));
});
//# sourceMappingURL=HomeBaseFilterValidator.spec.js.map