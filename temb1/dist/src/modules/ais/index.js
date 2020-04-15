"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AISController_1 = __importDefault(require("./AISController"));
const UserValidator_1 = __importDefault(require("../../middlewares/UserValidator"));
const aisRouter = express_1.default.Router();
aisRouter.get('/ais', UserValidator_1.default.getUserRoles, AISController_1.default.getUserDataByEmail);
exports.default = aisRouter;
//# sourceMappingURL=index.js.map