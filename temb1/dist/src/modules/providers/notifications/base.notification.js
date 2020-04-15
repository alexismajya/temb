"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __importDefault(require("../../../utils"));
const environment_1 = __importDefault(require("../../../config/environment"));
class BaseNotification {
    generateToken(payload) {
        return utils_1.default.generateToken('3d', payload);
    }
    getTripApprovalUrl(payload) {
        const token = this.generateToken(payload);
        return `${environment_1.default.TEMBEA_FRONTEND_URL}/trips/confirm?token=${token}`;
    }
}
exports.BaseNotification = BaseNotification;
//# sourceMappingURL=base.notification.js.map