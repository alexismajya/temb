"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthenticationController_1 = __importDefault(require("./AuthenticationController"));
const middlewares_1 = __importDefault(require("../../middlewares"));
exports.authenticationRouter = express_1.default.Router();
const { TokenValidator } = middlewares_1.default;
exports.authenticator = [
    TokenValidator.attachJwtSecretKey.bind(TokenValidator),
    TokenValidator.authenticateToken.bind(TokenValidator),
];
exports.authenticationRouter.get('/auth/verify', ...exports.authenticator, AuthenticationController_1.default.verifyUser);
//# sourceMappingURL=index.js.map