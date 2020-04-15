"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InteractivePromptsHelpers_1 = __importDefault(require("../InteractivePromptsHelpers"));
describe('InteractivePromptsHelpers', () => {
    it('should generate trip fields', (done) => {
        const tripInfo = {
            requester: {
                dataValues: {
                    slackId: 'XXXXXXXX'
                }
            },
            department: {
                dataValues: {
                    name: 'people'
                }
            },
            rider: {
                dataValues: {
                    slackId: 'XXXXXXXXX'
                }
            },
            origin: {
                dataValues: {
                    address: 'Lagos'
                }
            },
            destination: {
                dataValues: {
                    address: 'Abuja'
                }
            }
        };
        const res = InteractivePromptsHelpers_1.default.addOpsNotificationTripFields(tripInfo);
        expect(res.length).toBe(7);
        done();
    });
    it('should generate cab fields', (done) => {
        const cabInfo = {
            driverName: 'Dave',
            driverPhoneNo: '456789',
            regNumber: 'AG 915 LAR'
        };
        const res = InteractivePromptsHelpers_1.default.addOpsNotificationCabFields(cabInfo);
        expect(res.length).toBe(3);
        done();
    });
    it('should format trip history', () => {
        const tripHistory = [
            {
                departureTime: '22:00 12/12/2018',
                origin: { address: 'ET' },
                destination: { address: 'DOJO' }
            }
        ];
        const result = InteractivePromptsHelpers_1.default.formatTripHistory(tripHistory);
        expect(result[0]).toHaveProperty('actions');
        expect(result[0]).toHaveProperty('fields');
    });
});
describe('InteractivePromptHelper > getOpsCompletionAttachmentDetails', () => {
    const tripInfoMock = {
        decliner: { slackId: 'YYYYY' },
        confirmer: { slackId: 'ZZZZZ' }
    };
    const { getOpsCompletionAttachmentDetails } = InteractivePromptsHelpers_1.default;
    it('should return attachment details for declined request', () => {
        const { color, confirmTitle, title } = getOpsCompletionAttachmentDetails(true, tripInfoMock);
        expect(color).toBe('danger');
        expect(title).toBe('Trip request declined');
        expect(confirmTitle).toBe(':X: <@YYYYY> declined this request');
    });
    it('should return attachment details for approved request', () => {
        const { color, confirmTitle, title } = getOpsCompletionAttachmentDetails(false, tripInfoMock);
        expect(color).toBe('good');
        expect(title).toBe('Trip request approved');
        expect(confirmTitle).toBe(':white_check_mark: <@ZZZZZ> approved this request');
    });
});
//# sourceMappingURL=InteractivePromptsHelpers.spec.js.map