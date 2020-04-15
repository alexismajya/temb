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
const driver_notifications_helper_1 = __importDefault(require("../driver.notifications.helper"));
const slack_block_models_1 = require("../../../../../new-slack/models/slack-block-models");
const faker_1 = __importDefault(require("faker"));
const whatsapp_service_1 = __importDefault(require("../../../../../../modules/notifications/whatsapp/whatsapp.service"));
exports.testTripRequest = {
    origin: { address: 'Hello Origin' },
    destination: { address: 'Hello destination' },
    rider: { slackId: 'U1234', phoneNo: '+234181919201' },
    departureTime: faker_1.default.date.recent().toISOString(),
    distance: '23km',
    department: { name: 'Test Deparment' },
    driverSlackId: 'U12342',
    driver: {
        driverPhoneNo: '+2348190199230',
        driverName: 'Test Driver',
    },
    noOfPassengers: 2,
};
exports.testRouteBatch = {
    takeOff: '14:00',
    route: {
        name: 'testRoute',
    },
    driver: {
        user: {
            slackId: 'U2321',
        },
    },
};
describe(driver_notifications_helper_1.default, () => {
    describe(driver_notifications_helper_1.default.tripApprovalAttachment, () => {
        it('should return trip attachement for driver', () => {
            const blocks = driver_notifications_helper_1.default.tripApprovalAttachment(exports.testTripRequest);
            expect(blocks[0]).toBeInstanceOf(slack_block_models_1.Block);
        });
    });
    describe(driver_notifications_helper_1.default.routeApprovalAttachment, () => {
        it('should return route attachement for the driver', () => {
            const blocks = driver_notifications_helper_1.default.routeApprovalAttachment(exports.testRouteBatch);
            expect(blocks[0]).toBeInstanceOf(slack_block_models_1.Block);
        });
    });
    describe(driver_notifications_helper_1.default.notifyDriverOnWhatsApp, () => {
        it('should send Driver Trip notification 10 min ahead', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(whatsapp_service_1.default, 'send').mockResolvedValue(null);
            yield driver_notifications_helper_1.default.notifyDriverOnWhatsApp(exports.testTripRequest);
            expect(whatsapp_service_1.default.send).toHaveBeenCalledWith(expect.objectContaining({
                body: expect.stringContaining(exports.testTripRequest.destination.address),
                to: exports.testTripRequest.driver.driverPhoneNo,
            }));
        }));
    });
});
//# sourceMappingURL=driver.notifications-helper.spec.js.map