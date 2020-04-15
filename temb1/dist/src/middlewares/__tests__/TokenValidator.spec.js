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
Object.defineProperty(exports, "__esModule", { value: true });
const TokenValidator_1 = require("../TokenValidator");
describe(TokenValidator_1.TokenValidator, () => {
    let tokenValidator = new TokenValidator_1.TokenValidator();
    let responseMock;
    let utilsMock;
    beforeEach(() => {
        responseMock = {
            sendResponse: jest.fn(),
        };
        utilsMock = {
            verifyToken: jest.fn()
        };
        tokenValidator = new TokenValidator_1.TokenValidator(utilsMock, responseMock);
    });
    describe('Authenticate token method', () => {
        let nextMock;
        beforeEach(() => {
            nextMock = jest.fn();
        });
        afterEach(() => {
            jest.restoreAllMocks();
        });
        it('should call sendResponse function with No token provided message', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { headers: {}, envSecretKey: 'secret' };
            yield tokenValidator.authenticateToken(req, 'res', nextMock);
            expect(responseMock.sendResponse).toHaveBeenCalledTimes(1);
            expect(responseMock.sendResponse).toHaveBeenCalledWith('res', 401, false, 'No token provided');
            expect(nextMock).toHaveBeenCalledTimes(0);
        }));
        it('should decode token and call next method', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { headers: { authorization: 'token' }, envSecretKey: 'secret' };
            jest.spyOn(utilsMock, 'verifyToken').mockReturnValue('decoded');
            yield tokenValidator.authenticateToken(req, 'res', nextMock);
            expect(responseMock.sendResponse).toHaveBeenCalledTimes(0);
            expect(utilsMock.verifyToken).toHaveBeenCalledTimes(1);
            expect(utilsMock.verifyToken).toHaveBeenCalledWith('token', 'secret');
            expect(req.currentUser).toEqual('decoded');
            expect(nextMock).toHaveBeenCalledTimes(1);
        }));
        it('should throw an error and call sendResponse function with authentication failed message', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { headers: { authorization: 'token' }, envSecretKey: 'secret' };
            const errMock = new Error('Fail');
            jest.spyOn(utilsMock, 'verifyToken').mockImplementationOnce(() => { throw errMock; });
            yield tokenValidator.authenticateToken(req, 'res', nextMock);
            expect(utilsMock.verifyToken).toHaveBeenCalledTimes(1);
            expect(utilsMock.verifyToken).toHaveBeenCalledWith('token', 'secret');
            expect(nextMock).toHaveBeenCalledTimes(0);
        }));
    });
    describe('Validate Role method', () => {
        let nextMock;
        beforeEach(() => {
            nextMock = jest.fn();
        });
        afterEach(() => {
            jest.restoreAllMocks();
        });
        it('should call sendResponse method with Unauthorized message', () => __awaiter(void 0, void 0, void 0, function* () {
            const reqMock = { currentUser: { userInfo: { roles: ['Admin'] } } };
            yield tokenValidator.validateRole(reqMock, 'res', nextMock);
            expect(responseMock.sendResponse).toHaveBeenCalledTimes(1);
            expect(responseMock.sendResponse).toHaveBeenCalledWith('res', 401, false, 'Unauthorized access');
            expect(nextMock).toHaveBeenCalledTimes(0);
        }));
        it('should call next method', () => __awaiter(void 0, void 0, void 0, function* () {
            const reqMock = { currentUser: { userInfo: { roles: ['Super Admin'] } } };
            yield tokenValidator.validateRole(reqMock, 'res', nextMock);
            expect(responseMock.sendResponse).toHaveBeenCalledTimes(0);
            expect(nextMock).toHaveBeenCalledTimes(1);
        }));
    });
    describe('attachJWTSecretKey method', () => {
        let nextMock;
        beforeEach(() => {
            nextMock = jest.fn();
        });
        afterEach(() => {
            jest.restoreAllMocks();
        });
        it('should attach andelaJWTKey to req object and call next method', () => __awaiter(void 0, void 0, void 0, function* () {
            const reqMock = { path: '/auth/verify' };
            yield tokenValidator.attachJwtSecretKey(reqMock, 'res', nextMock);
            expect(reqMock.envSecretKey).toEqual('JWT_ANDELA_KEY');
            expect(nextMock).toHaveBeenCalledTimes(1);
        }));
        it('should attach andelaJWTKey to req object and call next method', () => __awaiter(void 0, void 0, void 0, function* () {
            const reqMock = { path: '/user' };
            yield tokenValidator.attachJwtSecretKey(reqMock, 'res', nextMock);
            expect(reqMock.envSecretKey).toEqual('TEMBEA_PUBLIC_KEY');
            expect(nextMock).toHaveBeenCalledTimes(1);
        }));
    });
});
//# sourceMappingURL=TokenValidator.spec.js.map