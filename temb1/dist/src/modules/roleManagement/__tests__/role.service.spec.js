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
const role_service_1 = require("../role.service");
const database_1 = __importDefault(require("../../../database"));
const errorHandler_1 = __importDefault(require("../../../helpers/errorHandler"));
const user_service_1 = __importDefault(require("../../users/user.service"));
const mockData_1 = __importDefault(require("../__mocks__/mockData"));
const notification_1 = __importDefault(require("../notification"));
const { models: { Role, UserRole, User } } = database_1.default;
describe('Role Service', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('should run createNewRole method and return a role', () => __awaiter(void 0, void 0, void 0, function* () {
        const findOrCreateMock = jest.spyOn(Role, 'findOrCreate');
        findOrCreateMock.mockResolvedValue(['Basic', true]);
        const result = yield role_service_1.roleService.createNewRole('Ope');
        expect(result).toEqual('Basic');
        expect(findOrCreateMock).toHaveBeenCalledWith({ where: { name: 'Ope' } });
    }));
    it('should run createNewRole method and call HttpError method when role already exists', () => __awaiter(void 0, void 0, void 0, function* () {
        const findOrCreateMock = jest.spyOn(Role, 'findOrCreate');
        findOrCreateMock.mockResolvedValue(['Basic', false]);
        const httpMock = jest.spyOn(errorHandler_1.default, 'throwErrorIfNull').mockImplementation(() => { });
        yield role_service_1.roleService.createNewRole('John');
        expect(findOrCreateMock).toHaveBeenCalledWith({ where: { name: 'John' } });
        expect(httpMock).toHaveBeenCalledWith(false, 'Role already exists', 409);
    }));
    it('should run createNewRole method and throw an error', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockErr = new Error('boo');
        const findOrCreateMock = jest.spyOn(Role, 'findOrCreate');
        findOrCreateMock.mockRejectedValue(mockErr);
        const httpMock = jest.spyOn(errorHandler_1.default, 'throwErrorIfNull');
        expect.assertions(3);
        try {
            yield role_service_1.roleService.createNewRole('John');
        }
        catch (error) {
            expect(error).toEqual(mockErr);
        }
        expect(findOrCreateMock).toHaveBeenCalledWith({ where: { name: 'John' } });
        expect(httpMock).not.toHaveBeenCalled();
    }));
    it('should run getRoles method and return roles', () => __awaiter(void 0, void 0, void 0, function* () {
        const { mockedRoles, mockdatas } = mockData_1.default;
        const findAllMock = jest.spyOn(Role, 'findAll');
        findAllMock.mockResolvedValue(mockedRoles);
        const httpMock = jest.spyOn(errorHandler_1.default, 'throwErrorIfNull').mockImplementation(() => { });
        const result = yield role_service_1.roleService.getRoles();
        expect(result).toEqual(mockdatas);
        expect(findAllMock).toHaveBeenCalled();
        expect(httpMock).toHaveBeenCalledTimes(1);
        expect(httpMock).toHaveBeenCalledWith(mockdatas, 'No Existing Roles');
    }));
    it('should run getRoles method and throw error', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockErr = new Error('no roles');
        const findAllMock = jest.spyOn(Role, 'findAll').mockRejectedValue(mockErr);
        const httpMock = jest.spyOn(errorHandler_1.default, 'throwErrorIfNull').mockImplementation(() => { });
        try {
            yield role_service_1.roleService.getRoles();
        }
        catch (error) {
            expect(error).toEqual(mockErr);
        }
        expect(findAllMock).toHaveBeenCalled();
        expect(httpMock).toHaveBeenCalledTimes(0);
    }));
    it('should run getUserRoles method and return roles', () => __awaiter(void 0, void 0, void 0, function* () {
        const findUserMock = jest.spyOn(User, 'findOne');
        findUserMock.mockResolvedValue({ id: 1 });
        const httpMock = jest.spyOn(errorHandler_1.default, 'throwErrorIfNull').mockImplementation(() => { });
        const findUserRoles = jest.spyOn(role_service_1.roleService, 'findUserRoles').mockResolvedValue(['Editor']);
        const result = yield role_service_1.roleService.getUserRoles('tomboy@email.com');
        expect(result).toEqual(['Editor']);
        expect(findUserMock).toHaveBeenCalledWith({ where: { email: 'tomboy@email.com' } });
        expect(httpMock).toHaveBeenCalledTimes(1);
        expect(httpMock).toHaveBeenCalledWith('Editor', 'User has no role');
        expect(findUserRoles).toHaveBeenCalled();
    }));
    it('should run getUserRoles method and throw error', () => __awaiter(void 0, void 0, void 0, function* () {
        const errorMock = new Error('no roles');
        const findUserMock = jest.spyOn(User, 'findOne');
        findUserMock.mockRejectedValue(errorMock);
        const httpMock = jest.spyOn(errorHandler_1.default, 'throwErrorIfNull');
        expect.assertions(3);
        try {
            yield role_service_1.roleService.getUserRoles('tom@email.com');
        }
        catch (error) {
            expect(error).toEqual(errorMock);
        }
        expect(findUserMock).toHaveBeenCalledWith({ where: { email: 'tom@email.com' } });
        expect(httpMock).toHaveBeenCalledTimes(0);
    }));
    it('should run getRole method and return roles', () => __awaiter(void 0, void 0, void 0, function* () {
        const { mockRoleDetails } = mockData_1.default;
        const getRoleMock = jest.spyOn(Role, 'findOne');
        getRoleMock.mockResolvedValue(mockRoleDetails);
        const httpMock = jest
            .spyOn(errorHandler_1.default, 'throwErrorIfNull')
            .mockImplementation(() => { });
        const result = yield role_service_1.roleService.getRole('Super Admin');
        expect(result.name).toEqual('Super Admin');
        expect(getRoleMock).toHaveBeenCalledWith({ where: { name: 'Super Admin' } });
        expect(httpMock).toHaveBeenCalledTimes(1);
    }));
    it('should run getRole method and throw error', () => __awaiter(void 0, void 0, void 0, function* () {
        const errorMock = new Error('Rolex');
        const getRoleMock = jest.spyOn(Role, 'findOne').mockRejectedValue(errorMock);
        const httpMock = jest
            .spyOn(errorHandler_1.default, 'throwErrorIfNull')
            .mockImplementation(() => { });
        try {
            yield role_service_1.roleService.getRole('Oba');
        }
        catch (error) {
            expect(error).toEqual(errorMock);
        }
        expect(getRoleMock).toHaveBeenCalledWith({ where: { name: 'Oba' } });
        expect(httpMock).toHaveBeenCalledTimes(0);
    }));
    it('should run createUser method and return userRole', () => __awaiter(void 0, void 0, void 0, function* () {
        const getUserMock = jest.spyOn(user_service_1.default, 'getUser')
            .mockResolvedValue({ id: 1 });
        const getRoleMock = jest.spyOn(role_service_1.roleService, 'getRole')
            .mockResolvedValue({ id: 1, name: 'Executive' });
        jest.spyOn(UserRole, 'create').mockResolvedValue(() => { });
        const result = yield role_service_1.roleService.createUserRole('boss@email.com', 'VIP', 1);
        expect(result).toEqual(true);
        expect(getUserMock).toHaveBeenCalledWith('boss@email.com');
        expect(getRoleMock).toHaveBeenCalledWith('VIP');
    }));
    it('should return an error if user role already exists ', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(user_service_1.default, 'getUser')
            .mockResolvedValue({ id: 1 });
        jest.spyOn(role_service_1.roleService, 'getRole')
            .mockResolvedValue({ id: 1, name: 'Executive' });
        jest.spyOn(UserRole, 'create').mockResolvedValue(Promise.reject());
        const httpMock = jest
            .spyOn(errorHandler_1.default, 'throwErrorIfNull').mockImplementation(() => { });
        const result = yield role_service_1.roleService.createUserRole('boss@email.com', 'VIP', 1);
        expect(result).toEqual(true);
        expect(httpMock).toHaveBeenCalledTimes(1);
        expect(httpMock).toHaveBeenCalledWith('', 'This Role is already assigned to this user', 409);
    }));
    it('should run createUser method and throw error', () => __awaiter(void 0, void 0, void 0, function* () {
        const failMock = new Error('Failed');
        const getUserMock = jest.spyOn(user_service_1.default, 'getUser').mockRejectedValue(failMock);
        const getRoleMock = jest.spyOn(role_service_1.roleService, 'getRole').mockImplementation(() => { });
        const httpMock = jest
            .spyOn(errorHandler_1.default, 'throwErrorIfNull')
            .mockImplementation(() => { });
        try {
            yield role_service_1.roleService.createUserRole('chief@email.com', 'SENATE', 1);
        }
        catch (error) {
            expect(error).toEqual(failMock);
        }
        expect(getUserMock).toHaveBeenCalledWith('chief@email.com');
        expect(getRoleMock).toHaveBeenCalledTimes(1);
        expect(httpMock).toHaveBeenCalledTimes(0);
    }));
    describe('createOrFindRole', () => {
        it('should create new role and return full role object', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(Role, 'findOrCreate').mockResolvedValue({
                id: 1, name: 'Super Admin', createdAt: '2019-01-14 03:00:00+03',
            });
            const role = yield role_service_1.roleService.createOrFindRole('Super Admin');
            expect(role).toEqual({
                id: 1, name: 'Super Admin', createdAt: '2019-01-14 03:00:00+03',
            });
        }));
    });
    describe('findUserRoles', () => {
        it('should create new role and return full role object', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(UserRole, 'findAll').mockResolvedValue([]);
            const roles = yield role_service_1.roleService.findUserRoles(1);
            expect(roles).toEqual([]);
        }));
    });
    describe('createUserRoles', () => {
        it('should create new role and return full role object', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(UserRole, 'findOrCreate').mockResolvedValue([]);
            const roles = yield role_service_1.roleService.findOrCreateUserRole(1, 1, 1);
            expect(roles).toEqual([]);
        }));
    });
    describe('deleteUserRole', () => {
        it('should delete user role', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(UserRole, 'destroy').mockResolvedValue([]);
            const roles = yield role_service_1.roleService.deleteUserRole(1);
            expect(roles).toEqual([]);
        }));
    });
    describe('Notify user of role change', () => {
        it('Should notify user of new role assignment', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = { id: 3, name: 'mike' };
            const message = 'Dear mike, you have been assigned the Guest role on Tembea';
            jest.spyOn(user_service_1.default, 'getUser').mockReturnValue(user);
            jest.spyOn(role_service_1.roleService, 'getRole').mockReturnValue({ id: 2, name: 'Guest' });
            jest.spyOn(UserRole, 'create').mockReturnValue(user);
            jest.spyOn(notification_1.default, 'notifyUser');
            yield role_service_1.roleService.createUserRole('email', 'Guest', 2);
            expect(notification_1.default.notifyUser).toHaveBeenCalledWith(user, message);
        }));
        it('Should notify user of revoked role', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = { id: 3, name: 'mike' };
            const message = 'Dear mike, your role on Tembea has been revoked';
            jest.spyOn(UserRole, 'destroy').mockReturnValue(0);
            jest.spyOn(user_service_1.default, 'getUserById').mockReturnValue(user);
            jest.spyOn(notification_1.default, 'notifyUser');
            yield role_service_1.roleService.deleteUserRole(2);
            expect(notification_1.default.notifyUser).toHaveBeenCalledWith(user, message);
        }));
    });
});
//# sourceMappingURL=role.service.spec.js.map