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
const user_service_1 = __importDefault(require("./user.service"));
const bugsnagHelper_1 = __importDefault(require("../../helpers/bugsnagHelper"));
class UsersController {
    static updateRecord(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { slackUrl, email, newEmail, newName, newPhoneNo } = req.body;
            try {
                const slackUserInfo = yield user_service_1.default.getUserInfo(slackUrl, email, newEmail);
                let user = yield user_service_1.default.getUser(email);
                user = yield user_service_1.default.saveNewRecord(user, slackUserInfo, newName, newEmail, newPhoneNo);
                return res.status(200).json({
                    success: true,
                    message: 'User record updated',
                    user: {
                        name: user.name,
                        email: user.email,
                        phoneNo: user.phoneNo
                    }
                });
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                errorHandler_1.default.sendErrorResponse(error, res);
            }
        });
    }
    static newUserRecord(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { slackUrl, email } = req.body;
            try {
                let message = 'User already exists';
                let user = yield user_service_1.default.getUserByEmail(email);
                if (!user) {
                    const slackUserInfo = yield user_service_1.default.getUserInfo(slackUrl, email);
                    user = yield user_service_1.default.createNewUser(slackUserInfo);
                    message = 'User has been successfully created';
                }
                return res.status(200).json({
                    success: true,
                    message,
                    user: {
                        name: user.name,
                        email: user.email,
                        phoneNo: user.phoneNo
                    }
                });
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
                const size = req.query.size || 100;
                const page = req.query.page || 1;
                const filter = req.query.name || null;
                const data = yield user_service_1.default.getUsersFromDB(size, page, filter);
                if (data.rows <= 0) {
                    throw new errorHandler_1.default('There are no records on this page.', 404);
                }
                const totalPages = data.count / size;
                return res.status(200).json({
                    success: true,
                    message: `${page} of ${Math.ceil(totalPages)} page(s).`,
                    users: data.rows
                });
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                errorHandler_1.default.sendErrorResponse(error, res);
            }
        });
    }
    static deleteRecord(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.params;
            try {
                const user = yield user_service_1.default.getUser(email);
                yield user_service_1.default.deleteUser(user.id);
                return res.status(200).json({
                    success: true,
                    message: 'User deleted successfully',
                    user: {
                        email,
                    }
                });
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                errorHandler_1.default.sendErrorResponse(error, res);
            }
        });
    }
}
exports.default = UsersController;
//# sourceMappingURL=UsersController.js.map