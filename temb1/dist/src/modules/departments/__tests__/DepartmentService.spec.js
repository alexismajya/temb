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
const faker_1 = __importDefault(require("faker"));
const department_service_1 = require("../department.service");
const database_1 = __importDefault(require("../../../database"));
const __mocks__1 = require("../__mocks__");
const cache_1 = __importDefault(require("../../shared/cache"));
const { models: { Department, TripRequest } } = database_1.default;
describe('/DepartmentService', () => {
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield database_1.default.close();
    }));
    describe('Create department', () => {
        it('should find OR create the department', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = {
                id: 1,
                name: faker_1.default.name.findName(),
                slackId: faker_1.default.random.word().toUpperCase(),
                phoneNo: faker_1.default.phone.phoneNumber('080########'),
                email: faker_1.default.internet.email(),
                homebaseId: 3,
            };
            const department = yield department_service_1.departmentService.createDepartment(user, 'tembea', 'UIDG453', 3);
            expect(department).toBeDefined();
        }));
    });
    describe('Departments update', () => {
        afterEach(() => {
            jest.restoreAllMocks();
            jest.resetAllMocks();
        });
        it('should run the saveChanges catchBlock on error', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(Department, 'findByPk').mockResolvedValue(1);
            const result = yield department_service_1.departmentService.updateDepartment(null, null, null);
            expect(Department.findByPk).toHaveBeenCalled();
            expect(result).toEqual({ message: 'Error updating department' });
        }));
        it('should update the department', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(Department, 'findByPk').mockResolvedValue(__mocks__1.departmentMocks2[0]);
            jest.spyOn(Department, 'update').mockResolvedValue([{}, [__mocks__1.departmentMocks2[1]]]);
            const result = yield department_service_1.departmentService.updateDepartment(1, __mocks__1.departmentMocks2[1].get());
            expect(Department.findByPk).toHaveBeenCalled();
            expect(Department.update).toHaveBeenCalled();
            expect(result).toEqual(__mocks__1.departmentMocks2[1].get());
        }));
        it('should return a single instance of a department', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(Department, 'findByPk').mockResolvedValue(__mocks__1.departmentMocks2[0]);
            jest.spyOn(department_service_1.departmentService, 'findById')
                .mockImplementationOnce(() => (__mocks__1.departmentMocks2[1].get()));
            const dept = yield department_service_1.departmentService.getById(1);
            expect(typeof dept).toEqual('object');
            expect(dept).toEqual(__mocks__1.departmentMocks2[1].get());
        }));
    });
    describe('getDepartments', () => {
        afterEach(() => {
            jest.restoreAllMocks();
            jest.resetAllMocks();
        });
        beforeAll(() => {
            jest.spyOn(Department, 'findAll').mockResolvedValue(__mocks__1.departmentMocks);
        });
        it('should return an array with department entries', () => __awaiter(void 0, void 0, void 0, function* () {
            const departments = yield department_service_1.departmentService.getDepartmentsForSlack();
            expect(departments).toBeInstanceOf(Array);
            expect(departments).toHaveLength(__mocks__1.departmentMocks.length);
        }));
    });
    describe('DepartmentService_getById', () => {
        beforeAll(() => {
            cache_1.default.saveObject = jest.fn(() => { });
            afterEach(() => {
                jest.clearAllMocks();
            });
        });
        it('should throw an error when given non-integer as departmentId', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield department_service_1.departmentService.getById('x');
            expect(result).toEqual({
                message: 'The parameter provided is not valid. It must be a valid number',
            });
        }));
        it('should test that database queries are cached', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(Department, 'findByPk').mockResolvedValue(__mocks__1.departmentMocks2[0]);
            yield department_service_1.departmentService.getById(2);
            expect(cache_1.default.saveObject).toBeCalled();
        }));
        it('should return a single department', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(Department, 'findByPk').mockResolvedValue(__mocks__1.departmentMocks2[0]);
            const department = yield department_service_1.departmentService.getById(1);
            expect(department).toBeDefined();
            expect(department.head).toBeDefined();
        }));
    });
    describe('DepartmentService_getHeadByDeptId', () => {
        it('should show that this method returns the head data', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(Department, 'findByPk').mockResolvedValue(__mocks__1.departmentMocks2[0]);
            const head = yield department_service_1.departmentService.getHeadByDeptId(2);
            expect(head).toBeDefined();
        }));
    });
    describe('DepartmentService_getDepartmentAnalytics', () => {
        afterEach(() => {
            jest.restoreAllMocks();
            jest.resetAllMocks();
        });
        beforeAll(() => {
            jest.spyOn(Department, 'findAll').mockResolvedValue(__mocks__1.departmentMocks2[1]);
        });
        it('should return an array with department analytics data', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(department_service_1.departmentService, 'mapDepartmentId')
                .mockResolvedValue(['tdd', 'travel', 'Mathematics']);
            jest.spyOn(TripRequest, 'findAll').mockResolvedValue({ get: () => [{}] });
            const departmentData = yield department_service_1.departmentService
                .getDepartmentAnalytics(null, null, ['tdd', 'travel', 'Mathematics'], 'Embassy Visit', null);
            expect(departmentData.get()).toBeInstanceOf(Array);
        }));
        it('should return an empty array of department analytics data', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(department_service_1.departmentService, 'mapDepartmentId').mockResolvedValue([]);
            jest.spyOn(TripRequest, 'findAll').mockResolvedValue({});
            const departmentData = yield department_service_1.departmentService.getDepartmentAnalytics();
            expect(departmentData).toEqual({});
        }));
    });
    describe('DepartmentService_mapDepartmentId', () => {
        afterEach(() => {
            jest.restoreAllMocks();
            jest.resetAllMocks();
        });
        beforeEach(() => {
            jest.spyOn(Department, 'findOne').mockResolvedValue(__mocks__1.departmentMocks2[0]);
        });
        it('should map departmentId to department names', () => __awaiter(void 0, void 0, void 0, function* () {
            const departmentIds = yield department_service_1.departmentService.mapDepartmentId(['people', 'tdd', 'travel', 'Mathematics']);
            expect(departmentIds[0]).toEqual(__mocks__1.departmentMocks2[1].get().id);
        }));
        it('should not map departmentId to department names', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(department_service_1.departmentService, 'findOneByProp').mockImplementationOnce(() => ({}));
            const departmentIds = yield department_service_1.departmentService.mapDepartmentId([]);
            expect(departmentIds.length).toBe(0);
        }));
    });
});
//# sourceMappingURL=DepartmentService.spec.js.map