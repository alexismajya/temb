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
const JoinRouteInteractions_1 = __importDefault(require("../JoinRouteInteractions"));
const routesHelper_1 = __importDefault(require("../../../helpers/routesHelper"));
const routeBatch_service_1 = require("../../../../routeBatches/routeBatch.service");
const homebase_service_1 = require("../../../../homebases/homebase.service");
const twilio_mocks_1 = require("../../../../notifications/whatsapp/twilio.mocks");
twilio_mocks_1.mockWhatsappOptions();
describe('JoinRouteInputHandlers', () => {
    describe('JoinRouteController_sendAvailableRoutesMessage', () => {
        const mockRoutesData = {
            routes: [],
            totalPages: 1,
            pageNo: 1
        };
        let respond;
        beforeEach(() => {
            respond = jest.fn();
            jest.spyOn(routesHelper_1.default, 'toAvailableRoutesAttachment');
            jest.spyOn(routeBatch_service_1.routeBatchService, 'getRoutes').mockResolvedValue(mockRoutesData);
        });
        afterEach(() => {
            jest.restoreAllMocks();
        });
        it('should display all routes', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = { user: { id: 1 } };
            jest.spyOn(homebase_service_1.homebaseService, 'getHomeBaseBySlackId')
                .mockImplementation(() => ({ id: 1, homebase: 'Kampala' }));
            yield JoinRouteInteractions_1.default.sendAvailableRoutesMessage(payload, respond);
            expect(routesHelper_1.default.toAvailableRoutesAttachment).toBeCalled();
        }));
    });
});
//# sourceMappingURL=JoinRouteController.spec.js.map