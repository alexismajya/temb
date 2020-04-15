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
const DepartmentsController_1 = __importDefault(require("../DepartmentsController"));
const department_1 = __importDefault(require("../../../database/models/department"));
const user_service_1 = __importDefault(require("../../users/user.service"));
const department_service_1 = require("../../../modules/departments/department.service");
const teamDetails_service_1 = require("../../teamDetails/teamDetails.service");
const errorHandler_1 = __importDefault(require("../../../helpers/errorHandler"));
const homebase_1 = __importDefault(require("../../../database/models/homebase"));
const utils_1 = __importDefault(require("../../../utils"));
const addDepartments_1 = require("../__mocks__/addDepartments");
const responseHelper_1 = __importDefault(require("../../../helpers/responseHelper"));
const bugsnagHelper_1 = __importDefault(require("../../../helpers/bugsnagHelper"));
describe('DepartmentControllers', () => {
    let req;
    let res;
    let userSpy;
    let teamServiceSpy;
    let validToken;
    beforeAll(() => {
        userSpy = jest.spyOn(user_service_1.default, 'getUserByEmail');
        teamServiceSpy = jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsByTeamUrl');
        res = {
            status: jest.fn(() => ({
                json: jest.fn(),
            })).mockReturnValue({ json: jest.fn() }),
        };
        req = {
            body: {
                name: 'Updated Department',
                headEmail: 1,
                homebaseId: 1,
            },
            params: { id: 1 },
        };
        validToken = utils_1.default.generateToken('30m', { userInfo: { roles: ['Super Admin'] } });
    });
    describe('DepartmentsController.updateDepartments', () => {
        it('should validate Location Existence', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(homebase_1.default, 'findOne').mockResolvedValue(null);
            const response = {
                success: false, message: 'Homebase with provided homebaseId not found',
            };
            yield DepartmentsController_1.default.addDepartment(req, res);
            expect(res.status).toBeCalledWith(404);
            expect(res.status().json).toBeCalledWith(response);
        }));
        it('should validate head Existence', () => __awaiter(void 0, void 0, void 0, function* () {
            userSpy.mockReturnValue(null);
            const { success } = yield DepartmentsController_1.default.validateHeadExistence(req.body.headEmail);
            yield DepartmentsController_1.default.updateDepartment(req, res);
            expect(res.status).toBeCalledWith(404);
            expect(res.status().json).toBeCalledWith({
                message: 'Department Head with specified Email does not exist',
                success: false,
            });
            expect(success).toBe(false);
        }));
        it('should return a department not found error with wrong id', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(department_1.default, 'update')
                .mockReturnValue([{}, {}]);
            jest.spyOn(DepartmentsController_1.default, 'validateHeadExistence')
                .mockReturnValue({ id: 1, success: true });
            yield DepartmentsController_1.default.updateDepartment(req, res);
            expect(res.status).toBeCalledWith(404);
            expect(res.status().json).toBeCalledWith({
                success: false,
                message: 'Department Head with specified Email does not exist',
            });
        }));
        it('should update Department successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = {
                success: true,
                message: 'Department record updated',
                department: {
                    id: 14,
                    name: 'Technicalwdde',
                    head: {
                        name: 'Arthur Kalule',
                        email: 'arthur.kalule@andela.com',
                    },
                },
            };
            jest.spyOn(DepartmentsController_1.default, 'validateHeadExistence').mockReturnValue({
                id: 1, success: true,
            });
            jest.spyOn(department_service_1.departmentService, 'updateDepartment').mockReturnValue(response.department);
            yield DepartmentsController_1.default.updateDepartment(req, res);
            expect(res.status).toBeCalledWith(200);
            expect(res.status().json).toBeCalledWith(response);
        }));
    });
    describe('DepartmentControllers.addDepartment', () => {
        req = {
            email: 'test@test.com',
            name: 'TDD',
            slackUrl: 'Andela.slack.com',
            homebaseId: 1,
        };
        userSpy = jest.spyOn(user_service_1.default, 'getUser').mockReturnValue({});
        it('should create department successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(department_service_1.departmentService, 'createDepartment').mockReturnValue([{}, true]);
            jest.spyOn(homebase_1.default, 'findByPk').mockResolvedValue({
                get: ({ plain }) => {
                    if (plain)
                        return {};
                },
            });
            jest.spyOn(DepartmentsController_1.default, 'returnCreateDepartmentResponse');
            teamServiceSpy.mockReturnValue({ teamId: 1 });
            yield DepartmentsController_1.default.addDepartment(req, res);
            expect(DepartmentsController_1.default.returnCreateDepartmentResponse).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.status().json).toHaveBeenCalledWith({
                success: true,
                message: 'Department created successfully',
            });
        }));
        it('should return error on failure to create department', () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error('Something went wrong');
            jest.spyOn(department_service_1.departmentService, 'createDepartment').mockRejectedValue(error);
            jest.spyOn(errorHandler_1.default, 'sendErrorResponse');
            yield DepartmentsController_1.default.addDepartment(req, res);
            expect(errorHandler_1.default.sendErrorResponse).toBeCalled();
            expect(res.status).toBeCalledWith(500);
            expect(res.status().json).toBeCalledWith({
                success: false,
                message: 'Something went wrong',
            });
        }));
        it('should respond with missing homebaseId error', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(homebase_1.default, 'findOne').mockResolvedValue(null);
            yield DepartmentsController_1.default.addDepartment(req, res);
            expect(res.status().json).toBeCalledWith({
                success: false,
                message: 'Homebase with provided homebaseId not found',
            });
        }));
        it('should validate the department existence', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(homebase_1.default, 'findOne').mockResolvedValue({});
            jest.spyOn(department_service_1.departmentService, 'createDepartment').mockResolvedValue([{}, false]);
            yield DepartmentsController_1.default.addDepartment(req, res);
            expect(res.status).toBeCalledWith(409);
            expect(res.status().json).toBeCalledWith({
                success: false,
                message: 'Department already exists.',
            });
        }));
    });
    describe('DepartmentControllers.deleteDepartment', () => {
        it('should return a 404 if department is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            req.body = {
                name: 'no department',
            };
            yield DepartmentsController_1.default.deleteRecord(req, res);
            expect(res.status).toBeCalledWith(404);
            expect(res.status().json).toBeCalledWith({
                success: false,
                message: 'Department not found',
            });
        }));
        it('should delete the department', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(department_service_1.departmentService, 'deleteDepartmentByNameOrId')
                .mockResolvedValue(true);
            yield DepartmentsController_1.default.deleteRecord(req, res);
            expect(res.status).toBeCalledWith(200);
            expect(res.status().json).toBeCalledWith({
                success: true,
                message: 'The department has been deleted',
            });
        }));
    });
    describe('DepartmentControllers.readRecords', () => {
        it('should fail when page does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            req.query = {
                page: 1000000,
                size: 2,
            };
            req.headers = {
                homebaseid: 1,
            };
            jest.spyOn(user_service_1.default, 'getUserByEmail').mockImplementation(() => ({ homebaseId: 1 }));
            jest.spyOn(department_service_1.departmentService, 'getAllDepartments').mockImplementation(() => ({ count: 0, rows: 0 }));
            yield DepartmentsController_1.default.readRecords(req, res);
            expect(res.status).toBeCalledWith(404);
            expect(res.status().json).toBeCalledWith({
                success: false,
                message: 'There are no records on this page.',
            });
        }));
        it('should paginate the departments record', () => __awaiter(void 0, void 0, void 0, function* () {
            req.query = {
                page: 1000000,
                size: 2,
            };
            req.headers = {
                homebaseid: 1,
            };
            jest.spyOn(user_service_1.default, 'getUserByEmail').mockImplementation(() => ({ homebaseId: 1 }));
            jest.spyOn(department_service_1.departmentService, 'getAllDepartments').mockImplementation(() => ({ count: 1, rows: 2 }));
            const totalPages = Math.ceil(1 / 2);
            yield DepartmentsController_1.default.readRecords(req, res);
            expect(res.status).toBeCalledWith(200);
            expect(res.status().json).toHaveBeenCalledWith({
                success: true,
                message: `${req.query.page} of ${totalPages} page(s).`,
                pageMeta: { totalPages, totalResults: 1, page: req.query.page },
                departments: 2,
            });
        }));
    });
    describe('DepartmentControllers.fetchDepartmentTrips', () => {
        it('should fetch department trip analytics', () => __awaiter(void 0, void 0, void 0, function* () {
            responseHelper_1.default.sendResponse = jest.fn(() => { });
            jest.spyOn(department_service_1.departmentService, 'getDepartmentAnalytics')
                .mockResolvedValue(addDepartments_1.departmentAnalytics);
            yield DepartmentsController_1.default.fetchDepartmentTrips(req, res);
            expect(res.status).toBeCalledWith(200);
            expect(responseHelper_1.default.sendResponse).toHaveBeenCalledTimes(1);
        }));
        it('Should catch errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error('There is an error flagged');
            jest.spyOn(department_service_1.departmentService, 'getDepartmentAnalytics').mockRejectedValue(error);
            jest.spyOn(bugsnagHelper_1.default, 'log');
            jest.spyOn(errorHandler_1.default, 'sendErrorResponse');
            yield DepartmentsController_1.default.fetchDepartmentTrips(req, res);
            expect(bugsnagHelper_1.default.log).toBeCalledWith(error);
            expect(errorHandler_1.default.sendErrorResponse).toBeCalledWith(error, res);
        }));
    });
});
//# sourceMappingURL=departmentsController.spec.js.map