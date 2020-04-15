"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cleanData_1 = __importDefault(require("../cleanData"));
describe('Clean Data', () => {
    const data = {
        name: ' sokool',
        email: ' paula@gmail.com',
        locations: [{ location: ' Uganda ' }, { location: ' Kampala ' }],
        details: { firstName: '  soko ', lastName: ' paul ' }
    };
    const result = {
        name: 'sokool',
        email: 'paula@gmail.com',
        locations: [{ location: 'Uganda' }, { location: 'Kampala' }],
        details: { firstName: 'soko', lastName: 'paul' }
    };
    describe('trim ', () => {
        it('should fail if time format does not match requirement', () => {
            const output = cleanData_1.default.trim(data);
            expect(output).toEqual(result);
        });
    });
});
//# sourceMappingURL=cleanData.spec.js.map