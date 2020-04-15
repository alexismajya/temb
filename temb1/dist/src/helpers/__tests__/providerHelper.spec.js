"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const providerHelper_1 = __importDefault(require("../providerHelper"));
const providersMock_1 = require("../__mocks__/providersMock");
describe('Providers Helper', () => {
    it('return paginated provider data', () => {
        const result = providerHelper_1.default.paginateData(1, 1, 3, 100, providersMock_1.enteredProvider, 'providers');
        expect(result).toEqual(providersMock_1.returnedObj);
    });
    it('it should convert an array of provider details into provider lable value pairs', (done) => {
        const [providerName, providerId] = ['DbrandTaxify', 1, 'UXTMIE', 1];
        const providerMock = {
            name: providerName,
            id: providerId
        };
        const providersMock = [providerMock];
        const valuePairsData = providerHelper_1.default.generateProvidersLabel(providersMock);
        const expectedData = [
            {
                label: providerName,
                value: providerId.toString()
            }
        ];
        expect(valuePairsData).toEqual(expectedData);
        done();
    });
});
//# sourceMappingURL=providerHelper.spec.js.map