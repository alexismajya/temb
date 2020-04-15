"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DepartmentsController_1 = __importDefault(require("./DepartmentsController"));
const middlewares_1 = __importDefault(require("../../middlewares"));
const HomeBaseFilterValidator_1 = __importDefault(require("../../middlewares/HomeBaseFilterValidator"));
const ValidationSchemas_1 = __importStar(require("../../middlewares/ValidationSchemas"));
const departmentRouter = express_1.default.Router();
const { mainValidator } = middlewares_1.default;
const { readDepartmentRecords } = ValidationSchemas_1.default;
departmentRouter.put('/departments/:id', mainValidator(ValidationSchemas_1.updateDepartment), DepartmentsController_1.default.updateDepartment);
departmentRouter.post('/departments', mainValidator(ValidationSchemas_1.addDepartment), DepartmentsController_1.default.addDepartment);
departmentRouter.get('/departments', mainValidator(readDepartmentRecords), DepartmentsController_1.default.readRecords);
departmentRouter.delete('/departments', mainValidator(ValidationSchemas_1.deleteDepartmentOrCountry), DepartmentsController_1.default.deleteRecord);
departmentRouter.post('/departments/trips', mainValidator(ValidationSchemas_1.fetchDepartmentTrips), HomeBaseFilterValidator_1.default.validateHomeBaseAccess, DepartmentsController_1.default.fetchDepartmentTrips);
exports.default = departmentRouter;
//# sourceMappingURL=index.js.map