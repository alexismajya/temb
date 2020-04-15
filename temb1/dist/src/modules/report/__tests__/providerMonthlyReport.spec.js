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
const providerMonthlyReportMock_1 = require("../__mocks__/providerMonthlyReportMock");
const providerMonthlyReport_1 = __importStar(require("../providerMonthlyReport"));
const homebase_service_1 = require("../../../modules/homebases/homebase.service");
const providerReportMock_1 = require("../../../helpers/email/__mocks__/providerReportMock");
describe('Provider Monthly Report', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe('generateData', () => {
        it('should generate data for email', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(homebase_service_1.homebaseService, 'getMonthlyCompletedTrips').mockResolvedValue(providerMonthlyReportMock_1.homebaseProviders);
            const result = yield providerMonthlyReport_1.default.generateData(providerMonthlyReport_1.CommChannel.email);
            expect(homebase_service_1.homebaseService.getMonthlyCompletedTrips).toHaveBeenCalled();
            expect(result).toEqual(Object.assign(Object.assign({}, providerReportMock_1.finalData2), providerReportMock_1.finalData1));
        }));
        it('should generate data to be sent to slack', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(homebase_service_1.homebaseService, 'getMonthlyCompletedTrips').mockResolvedValue(providerMonthlyReportMock_1.homebaseProviders);
            yield providerMonthlyReport_1.default.generateData(providerMonthlyReport_1.CommChannel.slack);
            expect(homebase_service_1.homebaseService.getMonthlyCompletedTrips).toHaveBeenCalled();
        }));
    });
});
//# sourceMappingURL=providerMonthlyReport.spec.js.map