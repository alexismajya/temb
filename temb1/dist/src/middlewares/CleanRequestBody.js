"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cleanData_1 = __importDefault(require("../helpers/cleanData"));
class CleanRequestBody {
    static trimAllInputs(req, res, next) {
        if (req.body) {
            req.body = cleanData_1.default.trim(req.body);
        }
        return next();
    }
}
exports.default = CleanRequestBody;
//# sourceMappingURL=CleanRequestBody.js.map