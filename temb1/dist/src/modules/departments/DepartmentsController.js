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
const errorHandler_1 = __importDefault(require("../../helpers/errorHandler"));
const department_service_1 = require("./department.service");
const user_service_1 = __importDefault(require("../users/user.service"));
const bugsnagHelper_1 = __importDefault(require("../../helpers/bugsnagHelper"));
const constants_1 = require("../../helpers/constants");
const teamDetails_service_1 = require("../teamDetails/teamDetails.service");
const responseHelper_1 = __importDefault(require("../../helpers/responseHelper"));
const TripHelper_1 = __importDefault(require("../../helpers/TripHelper"));
const homebase_service_1 = require("../homebases/homebase.service");
class DepartmentController {
    static updateDepartment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { name, headEmail }, params: { id } } = req;
            try {
                const { id: headId, success } = yield DepartmentController
                    .validateHeadExistence(headEmail, res);
                if (success) {
                    const department = yield department_service_1.departmentService.updateDepartment(id, name, headId);
                    return res
                        .status(200)
                        .json({
                        success: true,
                        message: 'Department record updated',
                        department
                    });
                }
                return errorHandler_1.default.sendErrorResponse({
                    statusCode: 404, message: 'Department Head with specified Email does not exist'
                }, res);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                errorHandler_1.default.sendErrorResponse(error, res);
            }
        });
    }
    static addDepartment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { name, email, slackUrl, homebaseId } } = req;
            try {
                const homeBase = yield homebase_service_1.homebaseService.getById(homebaseId);
                let message = 'Homebase with provided homebaseId not found';
                if (homeBase) {
                    const [user, { teamId }] = yield Promise.all([user_service_1.default.getUser(email), teamDetails_service_1.teamDetailsService.getTeamDetailsByTeamUrl(slackUrl) || {}]);
                    if (teamId) {
                        const [dept, created] = yield department_service_1.departmentService.createDepartment(user, name, teamId, homebaseId);
                        return DepartmentController.returnCreateDepartmentResponse(res, created, dept);
                    }
                    message = 'Team with provided slackURl not found';
                }
                return errorHandler_1.default.sendErrorResponse({
                    statusCode: 404, message
                }, res);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                errorHandler_1.default.sendErrorResponse(error, res);
            }
        });
    }
    static readRecords(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { headers: { homebaseid } } = req;
                const page = req.query.page || 1;
                const size = req.query.size || constants_1.DEFAULT_SIZE;
                const data = yield department_service_1.departmentService.getAllDepartments(size, page, homebaseid);
                const { count, rows } = data;
                if (rows <= 0) {
                    throw new errorHandler_1.default('There are no records on this page.', 404);
                }
                const totalPages = Math.ceil(count / size);
                return res.status(200).json({
                    success: true,
                    message: `${page} of ${totalPages} page(s).`,
                    pageMeta: { totalPages, totalResults: count, page },
                    departments: rows,
                });
            }
            catch (error) {
                errorHandler_1.default.sendErrorResponse(error, res);
            }
        });
    }
    static deleteRecord(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body: { id: departmentId, name: departmentName } } = req;
                const success = yield department_service_1.departmentService.deleteDepartmentByNameOrId(departmentId, departmentName);
                if (success) {
                    return res.status(200).json({
                        success,
                        message: 'The department has been deleted'
                    });
                }
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                errorHandler_1.default.sendErrorResponse(error, res);
            }
        });
    }
    static fetchDepartmentTrips(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { query: { tripType }, body: { startDate, endDate, departments }, headers: { homebaseid } } = req;
                const analyticsData = yield department_service_1.departmentService.getDepartmentAnalytics(startDate, endDate, departments, tripType, homebaseid);
                const deptData = [];
                const { finalCost, finalAverageRating, count } = yield TripHelper_1.default.calculateSums(analyticsData);
                analyticsData.map((departmentTrip) => {
                    const deptObject = departmentTrip;
                    deptObject.averageRating = parseFloat(departmentTrip.averageRating).toFixed(2);
                    return deptData.push(deptObject);
                });
                const data = {
                    trips: analyticsData, finalCost, finalAverageRating, count
                };
                return responseHelper_1.default.sendResponse(res, 200, true, 'Request was successful', data);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                errorHandler_1.default.sendErrorResponse(error, res);
            }
        });
    }
    static validateHeadExistence(headEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_service_1.default.getUserByEmail(headEmail);
            if (!user)
                return { success: false };
            return Object.assign(Object.assign({}, user), { success: true });
        });
    }
    static returnCreateDepartmentResponse(res, created, dept) {
        if (created) {
            return res.status(201)
                .json({
                success: true,
                message: 'Department created successfully',
                department: dept.dataValues
            });
        }
        return res.status(409)
            .json({
            success: false,
            message: 'Department already exists.',
        });
    }
}
exports.default = DepartmentController;
//# sourceMappingURL=DepartmentsController.js.map