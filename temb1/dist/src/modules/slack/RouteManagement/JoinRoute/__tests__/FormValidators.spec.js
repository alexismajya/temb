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
const JoinRouteFormValidators_1 = __importDefault(require("../JoinRouteFormValidators"));
const SlackDialogModels_1 = require("../../../SlackModels/SlackDialogModels");
const dateHelper_1 = __importDefault(require("../../../../../helpers/dateHelper"));
const cache_1 = __importDefault(require("../../../../shared/cache"));
const Validators_1 = __importDefault(require("../../../../../helpers/slack/UserInputValidator/Validators"));
describe('FormValidators: validateFellowDetailsForm()', () => {
    const submission = {
        workHours: '18:00-00:00'
    };
    const user = {
        id: 'UHX123DR',
        name: 'John Doe'
    };
    const cacheValues = ['12/01/2018', '12/01/2022', 'Mastercard'];
    beforeEach(() => {
        jest.spyOn(dateHelper_1.default, 'changeDateTimeFormat');
        jest.spyOn(Validators_1.default, 'checkEmpty');
        jest.spyOn(JoinRouteFormValidators_1.default, 'validateWorkHours');
        jest.spyOn(cache_1.default, 'fetch').mockResolvedValue(cacheValues);
    });
    it('should return an empty list if no errors are found', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { submission, user };
        const result = yield JoinRouteFormValidators_1.default.validateFellowDetailsForm(data);
        expect(dateHelper_1.default.changeDateTimeFormat).toHaveBeenCalledWith(cacheValues[0]);
        expect(dateHelper_1.default.changeDateTimeFormat).toHaveBeenCalledWith(cacheValues[1]);
        expect(Validators_1.default.checkEmpty).toHaveBeenCalled();
        expect(JoinRouteFormValidators_1.default.validateWorkHours).toHaveBeenCalledWith(submission.workHours);
        expect(result).toEqual([]);
    }));
    it('should return a list of errors if time format is not hh:mm-hh:mm', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { submission: { workHours: 'a random string' }, user: Object.assign({}, user) };
        const result = yield JoinRouteFormValidators_1.default.validateFellowDetailsForm(data);
        const error = new SlackDialogModels_1.SlackDialogError('workHours', 'Work hours should be in the format hh:mm - hh:mm. See hint.');
        expect(result).toEqual([error]);
    }));
    it('should return a list of errors if time is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { submission: { workHours: '18:00-30:00' }, user: Object.assign({}, user) };
        const result = yield JoinRouteFormValidators_1.default.validateFellowDetailsForm(data);
        const error = new SlackDialogModels_1.SlackDialogError('workHours', 'Invalid time.');
        expect(result).toEqual([error]);
    }));
});
//# sourceMappingURL=FormValidators.spec.js.map