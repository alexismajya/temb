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
const utils_1 = __importDefault(require("../utils"));
class TokenValidator {
    constructor(utils, response) {
        this.utils = utils;
        this.response = response;
    }
    authenticateToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.headers.authorization;
            const jwtSecretKey = req.envSecretKey;
            if (!token) {
                const message = 'No token provided';
                return this.response.sendResponse(res, 401, false, message);
            }
            try {
                const decoded = this.utils.verifyToken(token, jwtSecretKey);
                req.currentUser = decoded;
                next();
            }
            catch (error) {
                const errorMessage = 'Failed to authenticate token! Valid token required';
                return this.response.sendResponse(res, 401, false, errorMessage);
            }
        });
    }
    validateRole(req, res, next) {
        const { currentUser: { userInfo: { roles } } } = req;
        const isAuthorized = roles.includes('Super Admin');
        if (!isAuthorized) {
            const errorMessage = 'Unauthorized access';
            return this.response.sendResponse(res, 401, false, errorMessage);
        }
        next();
    }
    attachJwtSecretKey(req, res, next) {
        if (req.path.startsWith('/auth/verify')) {
            req.envSecretKey = 'JWT_ANDELA_KEY';
            return next();
        }
        req.envSecretKey = 'TEMBEA_PUBLIC_KEY';
        next();
    }
}
exports.TokenValidator = TokenValidator;
const tokenValidator = new TokenValidator(utils_1.default, responseHelper_1.default);
exports.default = tokenValidator;
//# sourceMappingURL=TokenValidator.js.map