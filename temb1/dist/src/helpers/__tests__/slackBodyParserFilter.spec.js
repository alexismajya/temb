"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const slackBodyParserFilter_1 = __importDefault(require("../slackBodyParserFilter"));
describe('SlackBodyParserFilter', () => {
    it('should call next if /slack/actions provided', () => {
        const req = {
            path: '/slack/actions',
        };
        const next = jest.fn();
        const maybeFn = slackBodyParserFilter_1.default.maybe(() => { });
        maybeFn(req, {}, next);
        expect(next).toHaveBeenCalled();
    });
});
//# sourceMappingURL=slackBodyParserFilter.spec.js.map