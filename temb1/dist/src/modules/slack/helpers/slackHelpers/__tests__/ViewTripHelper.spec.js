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
const trip_service_1 = __importDefault(require("../../../../trips/trip.service"));
const ViewTripHelper_1 = __importDefault(require("../ViewTripHelper"));
const bugsnagHelper_1 = __importDefault(require("../../../../../helpers/bugsnagHelper"));
const user_service_1 = __importDefault(require("../../../../users/user.service"));
describe('ViewTripHelper', () => {
    let tripData;
    let respond;
    let payload;
    let requestId;
    let tripRequest;
    let userName;
    beforeEach(() => {
        tripData = {
            noOfPassengers: 1,
            reason: 'going to the airport.',
            tripStatus: 'Pending',
            departureTime: '2019-01-01T12:45',
            tripType: 'Regular Trip',
            createdAt: 'Wed Feb',
            origin: { address: 'Villarosa Kempinski' },
            destination: { address: 'Bao Box Westlands' }
        };
        requestId = 12;
        payload = {
            user: {
                id: 1
            }
        };
        respond = jest.fn();
        tripRequest = jest.spyOn(trip_service_1.default, 'getById').mockResolvedValue(tripData);
        userName = jest.spyOn(user_service_1.default, 'getUserById');
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe('displayTripRequest', () => {
        it('should display trip request', () => __awaiter(void 0, void 0, void 0, function* () {
            tripRequest.mockResolvedValueOnce(Object.assign({}, tripData));
            userName.mockResolvedValue();
            const result = yield ViewTripHelper_1.default.displayTripRequest(requestId, payload, respond);
            expect(tripRequest).toHaveBeenCalledTimes(1);
            expect(userName).toHaveBeenCalledTimes(1);
            expect(result).toBeInstanceOf(Object);
            expect(result).toHaveProperty('attachments');
            expect(result).toHaveProperty('text');
            expect(result.response_type).toBe('ephemeral');
        }));
        it('should handle errors', () => __awaiter(void 0, void 0, void 0, function* () {
            tripRequest.mockRejectedValue(new Error('failing'));
            jest.spyOn(bugsnagHelper_1.default, 'log');
            const result = yield ViewTripHelper_1.default.displayTripRequest(requestId, payload, respond);
            expect(bugsnagHelper_1.default.log).toHaveBeenCalled();
            expect(result.text).toBe('Request unsuccessful.:cry:');
        }));
    });
    describe('tripAttachment', () => {
        it('should create an attachment', () => {
            const SlackId = 'ERER45';
            const greeting = `Hey, <@${SlackId}> below are your trip request details :smiley:`;
            jest.spyOn(ViewTripHelper_1.default, 'tripAttachmentFields').mockReturnValue();
            const result = ViewTripHelper_1.default.tripAttachment(tripData, SlackId);
            expect(ViewTripHelper_1.default.tripAttachmentFields).toHaveBeenCalled();
            expect(result).toHaveProperty('attachments');
            expect(result.text).toBe(greeting);
        });
        it('should create an attachment', () => {
            const result = ViewTripHelper_1.default.tripAttachmentFields(tripData, '', '', 'Africa/Lagos');
            expect(result).toBeInstanceOf(Array);
            expect(result).toHaveLength(11);
            expect(result[0].value).toBe('Villarosa Kempinski');
            expect(result[1].value).toBe('Bao Box Westlands');
        });
    });
});
//# sourceMappingURL=ViewTripHelper.spec.js.map