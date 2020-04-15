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
const responseHelper_1 = __importDefault(require("../helpers/responseHelper"));
class HomeBaseFilterValidator {
    static validateHomeBaseAccess(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { headers: { homebaseid }, currentUser: { userInfo: { locations } } } = req;
            if (!homebaseid) {
                return responseHelper_1.default.sendResponse(res, 400, false, 'Missing HomebaseId in request headers');
            }
            const [canViewLocationData] = locations.filter((location) => location.id === parseInt(homebaseid, 10));
            if (!canViewLocationData) {
                return responseHelper_1.default.sendResponse(res, 403, false, 'You dont have permissions to view this location data');
            }
            return next();
        });
    }
}
exports.default = HomeBaseFilterValidator;
//# sourceMappingURL=HomeBaseFilterValidator.js.map