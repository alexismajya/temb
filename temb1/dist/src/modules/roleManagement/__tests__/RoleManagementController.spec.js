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
const RoleManagementController_1 = __importDefault(require("../RoleManagementController"));
const role_service_1 = require("../role.service");
const responseHelper_1 = __importDefault(require("../../../helpers/responseHelper"));
const errorHandler_1 = __importDefault(require("../../../helpers/errorHandler"));
describe('RoleManagementController Unit Test', () => {
    let sendResponseMock;
    let httpErrorMock;
    beforeEach(() => {
        sendResponseMock = jest.spyOn(responseHelper_1.default, 'sendResponse').mockImplementation();
        httpErrorMock = jest.spyOn(errorHandler_1.default, 'sendErrorResponse').mockImplementation();
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    describe('newRole method', () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });
        it('should call the response method with a success message', () => __awaiter(void 0, void 0, void 0, function* () {
            const reqMock = { body: { roleName: 'role' } };
            const roleServiceMock = jest.spyOn(role_service_1.roleService, 'createNewRole').mockResolvedValue('Admin1');
            yield RoleManagementController_1.default.newRole(reqMock, 'res');
            expect(roleServiceMock).toHaveBeenCalledTimes(1);
            expect(roleServiceMock).toHaveBeenCalledWith('role');
            expect(sendResponseMock).toHaveBeenCalledTimes(1);
            expect(sendResponseMock).toHaveBeenCalledWith('res', 201, true, 'Role has been created successfully', 'Admin1');
            expect(httpErrorMock).toHaveBeenCalledTimes(0);
        }));
        it('should throw error and call HttpError method', () => __awaiter(void 0, void 0, void 0, function* () {
            const reqMock = { body: { roleName: 'role' } };
            const errMock = new Error('failed');
            const roleServiceMock = jest.spyOn(role_service_1.roleService, 'createNewRole').mockRejectedValue(errMock);
            yield RoleManagementController_1.default.newRole(reqMock, 'res');
            expect(roleServiceMock).toHaveBeenCalledTimes(1);
            expect(roleServiceMock).toHaveBeenCalledWith('role');
            expect(sendResponseMock).toHaveBeenCalledTimes(0);
            expect(httpErrorMock).toHaveBeenCalledTimes(1);
            expect(httpErrorMock).toHaveBeenCalledWith(errMock, 'res');
        }));
    });
    describe('readRoles method', () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });
        it('should call the response method with a success message', () => __awaiter(void 0, void 0, void 0, function* () {
            const roleServiceMock = jest.spyOn(role_service_1.roleService, 'getRoles').mockResolvedValue('Admin');
            yield RoleManagementController_1.default.readRoles('req', 'res');
            expect(roleServiceMock).toHaveBeenCalledTimes(1);
            expect(sendResponseMock).toHaveBeenCalledTimes(1);
            expect(sendResponseMock).toHaveBeenCalledWith('res', 200, true, 'All available roles', 'Admin');
            expect(httpErrorMock).toHaveBeenCalledTimes(0);
        }));
        it('should throw error and call HttpError method', () => __awaiter(void 0, void 0, void 0, function* () {
            const errMock = new Error('failed');
            const roleServiceMock = jest.spyOn(role_service_1.roleService, 'getRoles').mockRejectedValue(errMock);
            yield RoleManagementController_1.default.readRoles('req', 'res');
            expect(roleServiceMock).toHaveBeenCalledTimes(1);
            expect(sendResponseMock).toHaveBeenCalledTimes(0);
            expect(httpErrorMock).toHaveBeenCalledTimes(1);
            expect(httpErrorMock).toHaveBeenCalledWith(errMock, 'res');
        }));
    });
    describe('readUserRole method', () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });
        it('should call the response method with a success message', () => __awaiter(void 0, void 0, void 0, function* () {
            const reqMock = { query: { email: 'role@email.com' } };
            const roleServiceMock = jest.spyOn(role_service_1.roleService, 'getUserRoles').mockResolvedValue('Admin');
            yield RoleManagementController_1.default.readUserRole(reqMock, 'res');
            expect(roleServiceMock).toHaveBeenCalledTimes(1);
            expect(roleServiceMock).toHaveBeenCalledWith('role@email.com');
            expect(sendResponseMock).toHaveBeenCalledTimes(1);
            expect(sendResponseMock).toHaveBeenCalledWith('res', 200, true, 'User roles', 'Admin');
            expect(httpErrorMock).toHaveBeenCalledTimes(0);
        }));
        it('should throw error and call HttpError method', () => __awaiter(void 0, void 0, void 0, function* () {
            const errMock = new Error('failed');
            const reqMock = { query: { email: 'role@email.com' } };
            const roleServiceMock = jest.spyOn(role_service_1.roleService, 'getUserRoles').mockRejectedValue(errMock);
            yield RoleManagementController_1.default.readUserRole(reqMock, 'res');
            expect(roleServiceMock).toHaveBeenCalledTimes(1);
            expect(roleServiceMock).toHaveBeenCalledWith('role@email.com');
            expect(sendResponseMock).toHaveBeenCalledTimes(0);
            expect(httpErrorMock).toHaveBeenCalledTimes(1);
            expect(httpErrorMock).toHaveBeenCalledWith(errMock, 'res');
        }));
    });
    describe('assignRoleToUser method', () => {
        let reqMock;
        beforeEach(() => {
            reqMock = { body: { email: 'role@email.com', roleName: 'Sweeper', homebaseId: 1 } };
        });
        afterEach(() => {
            jest.restoreAllMocks();
        });
        it('should call the response method with a success message', () => __awaiter(void 0, void 0, void 0, function* () {
            const roleServiceMock = jest.spyOn(role_service_1.roleService, 'createUserRole').mockImplementation();
            yield RoleManagementController_1.default.assignRoleToUser(reqMock, 'res');
            expect(roleServiceMock).toHaveBeenCalledTimes(1);
            expect(roleServiceMock).toHaveBeenCalledWith('role@email.com', 'Sweeper', 1);
            expect(sendResponseMock).toHaveBeenCalledTimes(1);
            expect(sendResponseMock).toHaveBeenCalledWith('res', 201, true, 'Role was successfully assigned to the user', '');
            expect(httpErrorMock).toHaveBeenCalledTimes(0);
        }));
        it('should throw error and call HttpError method', () => __awaiter(void 0, void 0, void 0, function* () {
            const errMock = new Error('failed');
            const roleServiceMock = jest.spyOn(role_service_1.roleService, 'createUserRole').mockRejectedValue(errMock);
            yield RoleManagementController_1.default.assignRoleToUser(reqMock, 'res');
            expect(roleServiceMock).toHaveBeenCalledTimes(1);
            expect(roleServiceMock).toHaveBeenCalledWith('role@email.com', 'Sweeper', 1);
            expect(sendResponseMock).toHaveBeenCalledTimes(0);
            expect(httpErrorMock).toHaveBeenCalledTimes(1);
            expect(httpErrorMock).toHaveBeenCalledWith(errMock, 'res');
        }));
    });
    describe('removeUserToRole', () => {
        const reqMock = { params: { userId: 1 } };
        it('should delete user role', () => __awaiter(void 0, void 0, void 0, function* () {
            const roleServiceMock = jest.spyOn(role_service_1.roleService, 'deleteUserRole').mockImplementation();
            yield RoleManagementController_1.default.removeUserToRole(reqMock, 'res');
            expect(roleServiceMock).toHaveBeenCalledTimes(1);
            expect(sendResponseMock).toHaveBeenCalledTimes(1);
        }));
        it('should throw error when deleting user role fails', () => __awaiter(void 0, void 0, void 0, function* () {
            const errMock = new Error('failed');
            const roleServiceMock = jest.spyOn(role_service_1.roleService, 'deleteUserRole').mockRejectedValue(errMock);
            yield RoleManagementController_1.default.removeUserToRole(reqMock, 'res');
            expect(roleServiceMock).toHaveBeenCalledTimes(1);
            expect(sendResponseMock).toHaveBeenCalledTimes(0);
            expect(httpErrorMock).toHaveBeenCalledTimes(1);
            expect(httpErrorMock).toHaveBeenCalledWith(errMock, 'res');
        }));
    });
});
//# sourceMappingURL=RoleManagementController.spec.js.map