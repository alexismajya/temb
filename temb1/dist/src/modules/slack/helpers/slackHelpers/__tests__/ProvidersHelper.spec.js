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
const ProvidersHelper_1 = __importDefault(require("../ProvidersHelper"));
const provider_service_1 = require("../../../../providers/provider.service");
const providersMock_1 = require("../../../../../helpers/__mocks__/providersMock");
const user_service_1 = __importDefault(require("../../../../users/user.service"));
describe('ProvidersHelpers (Slack)', () => {
    describe('getProviderUserDetails', () => {
        const payload = Object.assign({}, providersMock_1.returnedObj.providers[0]);
        beforeEach((() => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(provider_service_1.providerService, 'getProviderById').mockResolvedValue(payload);
            jest.spyOn(user_service_1.default, 'getUserById').mockResolvedValue({
                id: 1,
                name: 'Test Provider',
                slackId: 'UKXXXXXXX'
            });
        })));
        it('should get provider details', () => __awaiter(void 0, void 0, void 0, function* () {
            const providerUser = yield ProvidersHelper_1.default.getProviderUserDetails(1);
            expect(provider_service_1.providerService.getProviderById).toHaveBeenCalled();
            expect(user_service_1.default.getUserById).toHaveBeenCalled();
            expect(providerUser).toEqual({
                providerUserSlackId: 'UKXXXXXXX',
                providerName: 'Uber Kenya'
            });
        }));
    });
});
//# sourceMappingURL=ProvidersHelper.spec.js.map