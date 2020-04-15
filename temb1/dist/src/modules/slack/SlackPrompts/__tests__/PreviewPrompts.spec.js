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
const PreviewPrompts_1 = __importDefault(require("../PreviewPrompts"));
const SlackMessageModels_1 = require("../../SlackModels/SlackMessageModels");
const cache_1 = __importDefault(require("../../../shared/cache"));
describe('RouteInputHandlerHelper', () => {
    const data = {
        staticMapUrl: 'https://staticImageUrl',
        homeToDropOffDistance: { distanceInMetres: 1330 },
        dojoToDropOffDistance: { distanceInMetres: 2330 },
        savedBusStop: {
            address: 'address'
        },
        savedHomeAddress: {
            address: 'home'
        },
    };
    const addFieldActionsSpy = jest.spyOn(SlackMessageModels_1.SlackAttachment.prototype, 'addFieldsOrActions');
    const addOptionalProps = jest.spyOn(SlackMessageModels_1.SlackAttachment.prototype, 'addOptionalProps');
    const result = ['12/01/2019', '12/12/2022', 'Safaricom'];
    jest.spyOn(cache_1.default, 'fetch').mockResolvedValue(result);
    afterEach(() => {
        jest.resetAllMocks();
    });
    it('sendPartnerInfoPreview', () => __awaiter(void 0, void 0, void 0, function* () {
        const payload = {
            submission: {
                manager: 'manager',
                nameOfPartner: 'partner',
                workingHours: '16:00 - 23:00'
            }
        };
        const previewData = Object.assign({}, data);
        yield PreviewPrompts_1.default.sendPartnerInfoPreview(payload, previewData, 'fellow');
        expect(addFieldActionsSpy).toBeCalledTimes(2);
        expect(addOptionalProps).toBeCalledTimes(1);
    }));
    it('displayDestinationPreview', () => {
        PreviewPrompts_1.default.displayDestinationPreview(Object.assign({}, data));
        expect(addFieldActionsSpy).toBeCalledTimes(3);
        expect(addOptionalProps).toBeCalledTimes(2);
    });
});
//# sourceMappingURL=PreviewPrompts.spec.js.map