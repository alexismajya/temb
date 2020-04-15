"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CabsHelper_1 = __importDefault(require("../CabsHelper"));
describe('ManagerActionsHelper', () => {
    const cabMock = {
        id: 1,
        model: 'subaru',
        regNumber: 'FHD - 484',
        capacity: 8,
        driverName: 'ade',
        driverPhoneNo: '94840383038',
    };
    const cabsMock = [
        cabMock
    ];
    it('it should generate a label for a cab', (done) => {
        const labelFormat = CabsHelper_1.default.generateCabLabel(cabMock);
        const expectedFormat = `${cabMock.model.toUpperCase()} - ${cabMock.regNumber} - Seats up to ${cabMock.capacity} people`;
        expect(labelFormat).toEqual(expectedFormat);
        done();
    });
    it('it should convert an array of cab details into cab lable value pairs', (done) => {
        const valuePairsData = CabsHelper_1.default.toCabLabelValuePairs(cabsMock);
        const expectedData = [
            {
                label: `${cabMock.model.toUpperCase()} - ${cabMock.regNumber} - Seats up to ${cabMock.capacity} people`,
                value: cabMock.id
            }
        ];
        expect(valuePairsData).toEqual(expectedData);
        done();
    });
    it('it should convert an array of cab details into cab text value pairs', (done) => {
        const valuePairsData = CabsHelper_1.default.toCabLabelValuePairs(cabsMock, true);
        const expectedData = [
            {
                text: `${cabMock.model.toUpperCase()} - ${cabMock.regNumber} - Seats up to ${cabMock.capacity} people`,
                value: cabMock.id
            }
        ];
        expect(valuePairsData).toEqual(expectedData);
        done();
    });
});
//# sourceMappingURL=CabsHelper.spec.js.map