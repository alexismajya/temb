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
const homebase_service_1 = require("../../modules/homebases/homebase.service");
const utils_1 = __importDefault(require("../../utils"));
class ProviderReportGenerator {
    generateData(channel) {
        return __awaiter(this, void 0, void 0, function* () {
            const homebaseProvidersReport = {};
            const homebaseData = yield homebase_service_1.homebaseService.getMonthlyCompletedTrips();
            homebaseData.map((homebase) => {
                const providerData = this.calculateTotal(homebase.providers);
                const singleHomebaseReport = this.getPercantage(providerData);
                singleHomebaseReport.name = homebase.name;
                singleHomebaseReport.month = utils_1.default.getPreviousMonth();
                if (channel === 'email') {
                    homebaseProvidersReport[homebase.opsEmail] = singleHomebaseReport;
                }
                else if (channel === 'slack') {
                    homebaseProvidersReport[homebase.channel] = singleHomebaseReport;
                }
            });
            return homebaseProvidersReport;
        });
    }
    calculateTotal(providers) {
        let total = 0;
        const providersData = providers.map((provider) => {
            total += provider.trips.length;
            return Object.assign(Object.assign({}, provider), { trips: provider.trips.length });
        });
        return { total, providersData };
    }
    getPercantage(data) {
        const newProviderData = data.providersData.map((provider) => {
            provider.percantage = (provider.trips / data.total) * 100;
            return provider;
        });
        return Object.assign(Object.assign({}, data), { providersData: newProviderData });
    }
}
const providerReportGenerator = new ProviderReportGenerator();
exports.default = providerReportGenerator;
var CommChannel;
(function (CommChannel) {
    CommChannel["email"] = "email";
    CommChannel["slack"] = "slack";
})(CommChannel = exports.CommChannel || (exports.CommChannel = {}));
//# sourceMappingURL=providerMonthlyReport.js.map