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
const homebase_service_1 = require("./homebase.service");
const errorHandler_1 = __importDefault(require("../../helpers/errorHandler"));
const bugsnagHelper_1 = __importDefault(require("../../helpers/bugsnagHelper"));
const constants_1 = require("../../helpers/constants");
class HomebaseController {
    static addHomeBase(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { homebaseName, channel, address, countryId, currency, opsEmail, travelEmail } = req.body;
            try {
                const { homebase, isNewHomebase } = yield homebase_service_1.homebaseService.createHomebase({
                    name: homebaseName, channel, address, countryId, currency, opsEmail, travelEmail
                });
                if (isNewHomebase) {
                    delete homebase.deletedAt;
                    return res.status(201)
                        .json({
                        success: true,
                        message: 'Homebase created successfully',
                        homeBase: homebase
                    });
                }
                return res.status(409).json({
                    success: false,
                    message: `The homebase with name: '${homebaseName.trim()}' already exists`
                });
            }
            catch (err) {
                bugsnagHelper_1.default.log(err);
                errorHandler_1.default.sendErrorResponse(err, res);
            }
        });
    }
    static getHomebases(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { page, size } = req.query;
                page = page || 1;
                size = size || constants_1.DEFAULT_SIZE;
                const where = homebase_service_1.homebaseService.getWhereClause(req.query);
                const pageable = { page, size };
                const result = yield homebase_service_1.homebaseService.getHomebases(pageable, where);
                const message = `${result.pageNo} of ${result.totalPages} page(s).`;
                const pageMeta = {
                    totalPages: result.totalPages,
                    page: result.pageNo,
                    totalResults: result.totalItems,
                    pageSize: result.itemsPerPage
                };
                return (result.homebases.length === 1 ? res.status(200).json({
                    success: true, message, homebase: result.homebases
                }) : res.status(200).json({
                    success: true, message, pageMeta, homebases: result.homebases
                }));
            }
            catch (error) {
                errorHandler_1.default.sendErrorResponse(error, res);
                bugsnagHelper_1.default.log(error);
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { homebaseName: name, channel, countryId, address, currency, opsEmail, travelEmail }, params: { id: homebaseId } } = req;
            try {
                const result = yield homebase_service_1.homebaseService.updateDetails(name, homebaseId, channel, countryId, address, currency, opsEmail, travelEmail);
                if (result.error)
                    throw new Error(result.error);
                if (result.errors)
                    throw new Error(result.errors[0].message);
                const message = 'HomeBase Updated successfully';
                res.status(200).json({
                    success: true, message, homebase: result
                });
            }
            catch (error) {
                const message = 'Homebase with specified name already exists';
                bugsnagHelper_1.default.log(error);
                return res.status(409).json({
                    success: false,
                    message
                });
            }
        });
    }
}
exports.default = HomebaseController;
//# sourceMappingURL=HomebaseController.js.map