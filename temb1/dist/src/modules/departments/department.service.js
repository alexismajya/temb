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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importStar(require("sequelize"));
const user_1 = __importDefault(require("../../database/models/user"));
const database_1 = __importDefault(require("../../database"));
const trip_request_1 = __importDefault(require("../../database/models/trip-request"));
const user_service_1 = __importDefault(require("../../modules/users/user.service"));
const errorHandler_1 = __importDefault(require("../../helpers/errorHandler"));
const cache_1 = __importDefault(require("../shared/cache"));
const department_1 = __importStar(require("../../database/models/department"));
const base_service_1 = require("../shared/base.service");
const HomeBaseHelper_1 = require("../../helpers/HomeBaseHelper");
const getDeptKey = (id) => `dept_${id}`;
const userInclude = {
    model: user_1.default,
    as: 'head',
    required: true,
    attributes: ['name', 'email'],
    where: {},
};
exports.departmentDataAttributes = {
    attributes: [
        'departmentId',
        [sequelize_1.default.literal('department.name'), 'departmentName'],
        [sequelize_1.default.fn('avg', sequelize_1.default.col('rating')), 'averageRating'],
        [sequelize_1.default.fn('count', sequelize_1.default.col('department.id')), 'totalTrips'],
        [sequelize_1.default.fn('sum', sequelize_1.default.col('cost')), 'totalCost'],
    ],
    group: ['department.id', 'departmentId'],
};
class DepartmentService extends base_service_1.BaseService {
    constructor(department = database_1.default.getRepository(department_1.default)) {
        super(department);
    }
    createDepartment(user, name, teamId, homebaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.model.findOrCreate({
                where: { homebaseId, name: { [sequelize_1.Op.iLike]: `${name}%` } },
                defaults: {
                    teamId,
                    homebaseId,
                    name,
                    headId: user.id,
                },
            });
            const department = Object.assign({}, data[0].get());
            yield this.update(department.id, { status: 'Active', headId: user.id });
            return [department, true];
        });
    }
    getHeadId(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const headOfDepartment = yield user_service_1.default.getUser(email);
                return headOfDepartment.id;
            }
            catch (error) {
                if (error instanceof errorHandler_1.default)
                    throw error;
                errorHandler_1.default.throwErrorIfNull(null, 'Error getting the head of department', 500);
            }
        });
    }
    updateDepartment(id, name, headId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const oldDepartment = yield this.findById(id, [userInclude]);
                if (!oldDepartment) {
                    errorHandler_1.default.throwErrorIfNull(oldDepartment, 'Department not found. To add a new department use POST /api/v1/departments');
                }
                const department = yield this.update(id, { name, headId });
                return department;
            }
            catch (error) {
                if (error instanceof errorHandler_1.default)
                    throw error;
                return { message: 'Error updating department' };
            }
        });
    }
    getAllDepartments(size, page, homebaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return department_1.default.findAndCountAll({
                raw: true,
                limit: size,
                where: homebaseId ? { homebaseId } : undefined,
                include: [
                    { model: user_1.default, as: 'head' },
                    HomeBaseHelper_1.homeBaseModelHelper(),
                ],
                offset: (size * (page - 1)),
                order: [['id', 'DESC']],
            });
        });
    }
    deleteDepartmentByNameOrId(id = -1, name = '') {
        return __awaiter(this, void 0, void 0, function* () {
            const department = yield department_1.default.findOne({
                where: {
                    [sequelize_1.Op.or]: [{ id }, { name: { [sequelize_1.Op.iLike]: `${name.trim()}` } }],
                },
            });
            errorHandler_1.default.throwErrorIfNull(department, 'Department not found', 404);
            department.status = department_1.DepartmentStatuses.inactive;
            department.save();
            return true;
        });
    }
    getById(departmentId, includeOptions = ['head']) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Number.isNaN(parseInt(`${departmentId}`, 10))) {
                return { message: 'The parameter provided is not valid. It must be a valid number' };
            }
            const department = yield this.findById(departmentId, includeOptions);
            yield cache_1.default.saveObject(getDeptKey(departmentId), department);
            return department;
        });
    }
    getHeadByDeptId(departmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const department = yield this.findById(departmentId);
            const { head } = department;
            return head;
        });
    }
    getDepartmentsForSlack(teamId, homebaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const departments = teamId ? yield this.findAll({
                where: { teamId, homebaseId },
                include: ['head'],
            }) : yield this.model.findAll({
                include: ['head'],
                where: { homebaseId },
            });
            return departments.map((item) => ({
                label: item.name,
                value: item.id,
                head: item.head ? item.head : item.head,
            }));
        });
    }
    mapDepartmentId(departmentNames) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield Promise.all(departmentNames.map((departmentName) => __awaiter(this, void 0, void 0, function* () {
                const { id } = (yield this.findOneByProp({ prop: 'name', value: { [sequelize_1.Op.iLike]: `${String(departmentName).trim()}` } })) || { id: -1 };
                return id;
            })));
            return data;
        });
    }
    getDepartmentAnalytics(startDate, endDate, departments, tripType, homebaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const departmentId = yield exports.departmentService.mapDepartmentId(departments);
            let where = {};
            if (departmentId.length) {
                where = { id: { [sequelize_1.Op.in]: departmentId } };
            }
            const tripFilter = { homebaseId, tripType, tripStatus: 'Completed',
                createdAt: { [sequelize_1.Op.between]: [startDate, endDate] },
            };
            if (tripType) {
                tripFilter.tripType = tripType;
            }
            const result = yield trip_request_1.default.findAll(Object.assign(Object.assign({ where: tripFilter, include: [{ where, model: department_1.default, as: 'department' }] }, exports.departmentDataAttributes), { raw: true }));
            return result;
        });
    }
}
exports.departmentService = new DepartmentService();
exports.default = DepartmentService;
//# sourceMappingURL=department.service.js.map