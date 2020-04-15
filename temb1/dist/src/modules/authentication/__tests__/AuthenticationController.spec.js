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
const AuthenticationController_1 = __importDefault(require("../AuthenticationController"));
const responseHelper_1 = __importDefault(require("../../../helpers/responseHelper"));
const errorHandler_1 = __importDefault(require("../../../helpers/errorHandler"));
const utils_1 = __importDefault(require("../../../utils"));
const role_service_1 = require("../../roleManagement/role.service");
const user_service_1 = __importDefault(require("../../users/user.service"));
const RolesHelper_1 = __importDefault(require("../../../helpers/RolesHelper"));
describe('AuthenticationController Unit Test', () => {
    let sendResponseMock;
    let httpErrorMock;
    beforeEach(() => {
        sendResponseMock = jest.spyOn(responseHelper_1.default, 'sendResponse').mockImplementation();
        httpErrorMock = jest.spyOn(errorHandler_1.default, 'sendErrorResponse').mockImplementation();
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    describe('Verify User method', () => {
        let reqMock;
        beforeEach(() => {
            reqMock = { currentUser: { UserInfo: { email: 'boy@email.com' } } };
            jest.spyOn(user_service_1.default, 'getUserByEmail').mockReturnValue({
                id: 1,
                roles: [{ name: 'Admin' }]
            });
        });
        afterEach(() => {
            jest.restoreAllMocks();
            jest.resetAllMocks();
        });
        it('should call the response method with success message', () => __awaiter(void 0, void 0, void 0, function* () {
            const utilsMock = jest.spyOn(utils_1.default, 'mapThroughArrayOfObjectsByKey')
                .mockReturnValue('user');
            jest.spyOn(role_service_1.roleService, 'findUserRoles').mockReturnValue([]);
            jest.spyOn(RolesHelper_1.default, 'mapLocationsAndRoles').mockReturnValue({});
            yield AuthenticationController_1.default.verifyUser(reqMock, 'res');
            expect(utilsMock).toHaveBeenCalledTimes(1);
            expect(utilsMock).toHaveBeenCalledWith(expect.any(Array), 'name');
            expect(sendResponseMock).toHaveBeenCalledTimes(1);
            expect(httpErrorMock).toHaveBeenCalledTimes(0);
        }));
        it('should throw error and call HttpError method', () => __awaiter(void 0, void 0, void 0, function* () {
            const errMock = new Error('failed');
            const roleServiceMock = jest.spyOn(role_service_1.roleService, 'findUserRoles').mockRejectedValue(errMock);
            yield AuthenticationController_1.default.verifyUser(reqMock, 'res');
            expect(roleServiceMock).toHaveBeenCalledTimes(1);
            expect(sendResponseMock).toHaveBeenCalledTimes(0);
            expect(httpErrorMock).toHaveBeenCalledTimes(1);
            expect(httpErrorMock).toHaveBeenCalledWith(errMock, 'res');
        }));
    });
});
//# sourceMappingURL=AuthenticationController.spec.js.map