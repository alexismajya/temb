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
const startUpHelper_1 = __importDefault(require("../startUpHelper"));
const database_1 = __importDefault(require("../../database"));
const role_service_1 = require("../../modules/roleManagement/role.service");
const route_events_handlers_1 = __importDefault(require("../../modules/events/route-events.handlers"));
const { models: { User } } = database_1.default;
describe('Super Admin test', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
    afterAll((done) => database_1.default.close().then(done));
    it('should test createSuperAdmin successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const UserFindOrCreateMock = jest.spyOn(User, 'findOrCreate');
        UserFindOrCreateMock.mockResolvedValue([{ addRoles: () => { } }]);
        jest.spyOn(role_service_1.roleService, 'findOrCreateUserRole');
        const RoleFindOrCreateMock = jest.spyOn(role_service_1.roleService, 'createOrFindRole');
        RoleFindOrCreateMock.mockResolvedValue(['Basic']);
        yield startUpHelper_1.default.ensureSuperAdminExists();
        expect(role_service_1.roleService.findOrCreateUserRole).toHaveBeenCalledTimes(2);
        expect(RoleFindOrCreateMock).toHaveBeenCalledTimes(1);
    }));
    it('should test getUserNameFromEmail successfully with single name in email', () => {
        const email = 'tembea@gmail.com';
        const userName = startUpHelper_1.default.getUserNameFromEmail(email);
        expect(userName).toEqual('Tembea');
    });
    it('should test getUserNameFromEmail successfully with both names in email', () => {
        const email = 'tembea.devs@gmail.com';
        const userName = startUpHelper_1.default.getUserNameFromEmail(email);
        expect(userName).toEqual('Tembea Devs');
    });
    it('should test createSuperAdmin and throw an error', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockErr = new Error('boo');
        const UserFindOrCreateMock = jest.spyOn(User, 'findOrCreate').mockRejectedValue(mockErr);
        const RoleFindOrCreateMock = jest.spyOn(role_service_1.roleService, 'createOrFindRole');
        RoleFindOrCreateMock.mockResolvedValue(['Basic']);
        try {
            yield startUpHelper_1.default.ensureSuperAdminExists();
        }
        catch (error) {
            expect(error).toEqual(mockErr);
        }
        expect(UserFindOrCreateMock).toHaveBeenCalledTimes(2);
        expect(RoleFindOrCreateMock).toHaveBeenCalledTimes(0);
    }));
    describe('StartUpHelper.registerEventHandlers', () => {
        it('should initalize and create subscriptions', (done) => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(route_events_handlers_1.default, 'init');
            startUpHelper_1.default.registerEventHandlers();
            expect(route_events_handlers_1.default.init).toHaveBeenCalledTimes(1);
            done();
        }));
    });
});
//# sourceMappingURL=startUpHelper.spec.js.map