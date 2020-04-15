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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importStar(require("../../database"));
const base_service_1 = require("../shared/base.service");
class EngagementService extends base_service_1.BaseService {
    constructor(engagement = database_1.default.getRepository(database_1.Engagement)) {
        super(engagement);
    }
    findOrCreateEngagement(workHours, { id: fellowId }, { id: partnerId }, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const [engagement] = yield database_1.Engagement.findOrCreate({
                where: { fellowId, partnerId },
                defaults: {
                    startDate,
                    endDate,
                    workHours,
                    fellowId,
                    partnerId,
                },
            });
            return engagement;
        });
    }
    getEngagement(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_1.Engagement.findByPk(id, { include: ['partner', 'fellow'] });
        });
    }
    updateEngagement(id, { startDate, endDate, workHours }) {
        return __awaiter(this, void 0, void 0, function* () {
            const engagement = yield this.getEngagement(id);
            yield engagement.update({ startDate, endDate, workHours });
            return engagement;
        });
    }
}
exports.engagementService = new EngagementService();
exports.default = EngagementService;
//# sourceMappingURL=engagement.service.js.map