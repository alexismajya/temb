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
Object.defineProperty(exports, "__esModule", { value: true });
const interactions_1 = require("../interactions");
const __mocks__1 = require("../__mocks__");
const { addressServiceMock, departmentServiceMock, teamDetailsServiceMock, getSlackViewsMock, homebaseServiceMock, newSlackHelpersMock, } = __mocks__1.dependencyMocks;
describe(interactions_1.Interactions, () => {
    let interactions;
    beforeEach(() => {
        interactions = new interactions_1.Interactions(addressServiceMock, departmentServiceMock, teamDetailsServiceMock, getSlackViewsMock, homebaseServiceMock, newSlackHelpersMock);
    });
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    describe('Interactions.sendContactDetailsModal', () => {
        it('should send contact details modal', (done) => __awaiter(void 0, void 0, void 0, function* () {
            const didOpen = yield interactions.sendContactDetailsModal(__mocks__1.payload);
            expect(teamDetailsServiceMock.getTeamDetailsBotOauthToken).toHaveBeenCalledTimes(1);
            expect(didOpen).toBe(true);
            done();
        }));
        it('should send contact details modal when isEdit', (done) => __awaiter(void 0, void 0, void 0, function* () {
            const didOpen = yield interactions.sendContactDetailsModal(__mocks__1.payload, __mocks__1.cachedObject, __mocks__1.isEditTrue);
            expect(teamDetailsServiceMock.getTeamDetailsBotOauthToken).toHaveBeenCalledTimes(1);
            expect(didOpen).toBe(true);
            done();
        }));
    });
    describe(interactions_1.Interactions.prototype.getContactDetailsModal, () => {
        it('should get embassy visit', (done) => __awaiter(void 0, void 0, void 0, function* () {
            const contactDetailsModal = yield interactions.getContactDetailsModal(__mocks__1.payload);
            expect(contactDetailsModal).toBeDefined();
            done();
        }));
    });
    describe(interactions_1.Interactions.prototype.sendAddNoteModal, () => {
        it('should send add note modal', (done) => __awaiter(void 0, void 0, void 0, function* () {
            const didOpen = yield interactions.sendAddNoteModal(__mocks__1.payload);
            expect(teamDetailsServiceMock.getTeamDetailsBotOauthToken).toHaveBeenCalledTimes(1);
            expect(didOpen).toBe(true);
            done();
        }));
    });
    describe('Interactions.getAddNoteModal', () => {
        it('should get add note modal', (done) => __awaiter(void 0, void 0, void 0, function* () {
            const addNoteModal = yield interactions.getAddNoteModal(__mocks__1.payload);
            expect(addNoteModal).toBeDefined();
            done();
        }));
    });
    describe('Interactions.sendLocationModal', () => {
        let newPayload;
        beforeAll(() => {
            newPayload = Object.assign(Object.assign({}, __mocks__1.payload), { view: {
                    private_metadata: JSON.stringify('https://hooks.slack.com/actions/TNZ9397ST/866771506832/PkqOPLH7Wpb2OB5ENpgJPLVT'),
                } });
        });
        it('should send location modal', (done) => __awaiter(void 0, void 0, void 0, function* () {
            const didOpen = yield interactions.sendLocationModal(newPayload, __mocks__1.tripPayload);
            expect(homebaseServiceMock.getHomeBaseEmbassies).toHaveBeenCalledTimes(1);
            expect(homebaseServiceMock.getHomeBaseBySlackId).toHaveBeenCalledTimes(1);
            expect(addressServiceMock.getAddressListByHomebase).toHaveBeenCalledTimes(1);
            expect(teamDetailsServiceMock.getTeamDetailsBotOauthToken).toHaveBeenCalledTimes(1);
            expect(didOpen).toBe(true);
            done();
        }));
    });
    describe(interactions_1.Interactions.prototype.getLocationModal, () => {
        let newPayload;
        beforeAll(() => {
            newPayload = Object.assign(Object.assign({}, __mocks__1.payload), { view: {
                    private_metadata: JSON.stringify('https://hooks.slack.com/actions/TNZ9397ST/866771506832/PkqOPLH7Wpb2OB5ENpgJPLVT'),
                } });
        });
        it('should get localtion modal', (done) => __awaiter(void 0, void 0, void 0, function* () {
            const locationModal = yield interactions.getLocationModal(newPayload, __mocks__1.tripPayload);
            expect(locationModal).toBeDefined();
            done();
        }));
    });
});
//# sourceMappingURL=interactions.spec.js.map