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
const batchUseRecord_service_1 = require("../batchUseRecords/batchUseRecord.service");
const errorHandler_1 = __importDefault(require("../../helpers/errorHandler"));
const constants_1 = require("../../helpers/constants");
const user_service_1 = __importDefault(require("../users/user.service"));
const bugsnagHelper_1 = __importDefault(require("../../helpers/bugsnagHelper"));
const AISService_1 = __importDefault(require("../../services/AISService"));
const responseHelper_1 = __importDefault(require("../../helpers/responseHelper"));
class FellowController {
    static getFellowRouteActivity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { query: { page = 1, size = constants_1.DEFAULT_SIZE, id: userId }, headers: { homebaseid: homebaseId } } = req;
                const pageable = { page, size };
                const fellowRouteActivity = yield batchUseRecord_service_1.batchUseRecordService.getBatchUseRecord(pageable, { homebaseId, userId });
                return res
                    .status(200)
                    .json(Object.assign({ success: true, message: 'Successful' }, fellowRouteActivity));
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                errorHandler_1.default.sendErrorResponse(error, res);
            }
        });
    }
    static getAllFellows(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { query: { onRoute, page = 1, size = constants_1.DEFAULT_SIZE }, headers: { homebaseid: homebaseId } } = req;
            try {
                const data = yield user_service_1.default.getPagedFellowsOnOrOffRoute(onRoute, { size, page }, { homebaseId });
                const fellowsData = yield Promise.all(data.data.map((fellow) => FellowController.mergeFellowData(fellow.id, fellow.email)));
                return responseHelper_1.default.sendResponse(res, 200, true, 'Request was successful', {
                    fellows: fellowsData,
                    pageMeta: data.pageMeta,
                });
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                errorHandler_1.default.sendErrorResponse(error, res);
            }
        });
    }
    static mergeFellowData(id, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const [user, ais] = yield Promise.all([
                batchUseRecord_service_1.batchUseRecordService.getUserRouteRecord(id),
                AISService_1.default.getUserDetails(email)
            ]);
            const { name, picture, placement } = ais;
            const finalUserData = Object.assign({ name,
                picture,
                placement }, user);
            return finalUserData;
        });
    }
}
exports.default = FellowController;
//# sourceMappingURL=FellowsController.js.map