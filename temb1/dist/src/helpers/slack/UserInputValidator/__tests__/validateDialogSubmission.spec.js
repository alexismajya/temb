"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = __importStar(require("@hapi/joi"));
const SlackInteractions_mock_1 = require("../../../../modules/slack/SlackInteractions/__mocks__/SlackInteractions.mock");
const Validators_1 = __importDefault(require("../Validators"));
describe('Validates Dialog Submission Inputs', () => {
    beforeEach(() => {
        jest.spyOn(Validators_1.default, 'checkEmpty');
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should validate inputs with valid data', () => {
        const payload = SlackInteractions_mock_1.createPayload();
        const invalidInputs = Validators_1.default.validateDialogSubmission(payload);
        expect(Validators_1.default.checkEmpty).toHaveBeenCalled();
        expect(invalidInputs.length).toEqual(0);
    });
    it('should validate inputs with only whitespaces', () => {
        const payload = SlackInteractions_mock_1.createPayload();
        const copyPayload = Object.assign({}, payload);
        copyPayload.submission.reason = '  ';
        const invalidInputs = Validators_1.default.validateDialogSubmission(copyPayload);
        expect(Validators_1.default.checkEmpty).toHaveBeenCalled();
        expect(invalidInputs.length).toEqual(1);
    });
});
describe('validate submission', () => {
    it('should return value if valid', () => {
        const data = {
            name: 'Mubarak  ',
            email: '  tester@tembea.com',
            amount: '500',
            paid: 'false'
        };
        const result = Validators_1.default.validateSubmission(data, Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().trim().email().required(),
            amount: Joi.number().required(),
            paid: Joi.boolean().required()
        }));
        expect(result.amount).toEqual(500);
    });
    it('should throw an error when validation fails', () => {
        const data = {
            name: 'Mubarak  ',
            email: '  tester@tembea.com'
        };
        try {
            Validators_1.default.validateSubmission(data, Joi.object().keys({
                name: Joi.string().required(),
                email: Joi.string().trim().email().required(),
                amount: Joi.number().required(),
                paid: Joi.boolean().required()
            }));
        }
        catch (err) {
            expect(err.errors.details.length).toEqual(2);
        }
    });
});
//# sourceMappingURL=validateDialogSubmission.spec.js.map