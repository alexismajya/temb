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
const slack_helpers_1 = __importDefault(require("./slack-helpers"));
const actions_1 = __importDefault(require("../trips/user/actions"));
const blocks_1 = __importDefault(require("../trips/user/blocks"));
const schemas_1 = require("../trips/schemas");
const __mocks__1 = require("../../../helpers/slack/__mocks__");
const WebClientSingleton_1 = __importDefault(require("../../../utils/WebClientSingleton"));
const teamDetails_service_1 = require("../../teamDetails/teamDetails.service");
const cache_1 = __importDefault(require("../../shared/cache"));
const slackHelpers_1 = __importDefault(require("../../../helpers/slack/slackHelpers"));
const address_service_1 = require("../../addresses/address.service");
const webClientMock = {
    users: {
        info: jest.fn(() => Promise.resolve({
            user: __mocks__1.slackUserMock,
            token: 'sdf'
        })),
        profile: {
            get: jest.fn(() => Promise.resolve({
                profile: {
                    tz_offset: 'someValue',
                    email: 'sekito.ronald@andela.com'
                }
            }))
        }
    }
};
const homebaseName = 'Nairobi';
const state = { origin: 'state1' };
describe('slackHelpers', () => {
    beforeEach(() => {
        jest.spyOn(WebClientSingleton_1.default, 'getWebClient').mockReturnValue(webClientMock);
    });
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    describe('toSlackDropdown', () => {
        it('should convert any array to an array with text and value fields', () => {
            const data = [{ text: 'Hello', value: 1 }, { text: 'World', value: 2 }];
            const result = slack_helpers_1.default.toSlackDropdown(data);
            expect(result.length).toEqual(data.length);
        });
    });
    describe(slack_helpers_1.default.getPickupModal, () => {
        it('should add pick up modal', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(slack_helpers_1.default, 'getAddresses').mockResolvedValue(homebaseName);
            jest.spyOn(slack_helpers_1.default, 'toSlackSelectOptions').mockResolvedValue('options');
            const result = yield slack_helpers_1.default.getPickupModal('nairobi', state);
            expect(slack_helpers_1.default.getAddresses).toBeCalled();
            expect(typeof result).toBe('object');
            expect(result.type).toEqual('modal');
            expect(result.title.text).toEqual('Pickup Details');
        }));
    });
    describe('getDestinationFields, getPickupFields, getNavBlock', () => {
        it('should return destination fields', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(slack_helpers_1.default, 'getAddresses').mockResolvedValue([
                'DestAddress1', 'Others'
            ]);
            const destinationFields = yield slack_helpers_1.default.getDestinationFields();
            expect(destinationFields).toBeDefined();
            expect(destinationFields[0].name).toEqual('destination');
            expect(destinationFields[1].name).toEqual('othersDestination');
        }));
        it('should return nav block', () => __awaiter(void 0, void 0, void 0, function* () {
            const navBlock = yield slack_helpers_1.default.getNavBlock(blocks_1.default.navBlock, 'back', actions_1.default.getDepartment);
            expect(navBlock.block_id).toEqual(blocks_1.default.navBlock);
            expect(navBlock.elements[0].value).toEqual(actions_1.default.getDepartment);
        }));
    });
    describe('getAddresses', () => {
        it('should return a list of addresses', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(address_service_1.addressService, 'getAddressListByHomebase').mockResolvedValue([
                'address1', 'address2'
            ]);
            const addresses = yield slack_helpers_1.default.getAddresses();
            expect(addresses).toHaveLength(3);
            expect(addresses).toContain('Others');
        }));
    });
    describe('dialogValidator', () => {
        it('should validate data from a dialog', () => {
            const data = { reason: 'Good reason' };
            const validate = slack_helpers_1.default.dialogValidator(data, schemas_1.tripReasonSchema);
            expect(validate).toBeDefined();
            expect(validate).toEqual(data);
        });
        it('Should not validate data: Validation fail', () => {
            const data = {};
            try {
                slack_helpers_1.default.dialogValidator(data, schemas_1.tripReasonSchema);
            }
            catch (err) {
                expect(err.errors).toBeDefined();
                expect(err.errors[0].name).toEqual('reason');
            }
        });
    });
    describe('getUserInfo', () => {
        it('Should get user\'s info from slack', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield slack_helpers_1.default.getUserInfo('FakeSlackId', 'fakeToken');
            expect(user).toEqual(__mocks__1.slackUserMock);
        }));
        it('Should get user info from the cache', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(cache_1.default, 'fetch').mockResolvedValue(__mocks__1.slackUserMock);
            const user = yield slack_helpers_1.default.getUserInfo('FakeSlackId', 'fakeToken');
            expect(user).toEqual(__mocks__1.slackUserMock);
        }));
    });
    describe('getUserInfoFromSlack', () => {
        const slackId = 'U145';
        const teamId = 'TS14';
        const token = 'token';
        it('should return user info from slack', (done) => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(cache_1.default, 'fetch').mockResolvedValueOnce({});
            jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsBotOauthToken').mockResolvedValue(token);
            slackHelpers_1.default.fetchUserInformationFromSlack = jest
                .fn()
                .mockResolvedValue({ user: __mocks__1.slackUserMock });
            const slackUser = yield slackHelpers_1.default.getUserInfoFromSlack(slackId, teamId);
            expect(teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken).toBeCalledWith(teamId);
            expect(slackHelpers_1.default.fetchUserInformationFromSlack).toBeCalledWith(slackId, token);
            expect(slackUser).toBeInstanceOf(Object);
            expect(slackUser.user).toEqual(__mocks__1.slackUserMock);
            done();
        }));
        it('should return user info that already exist', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(cache_1.default, 'fetch').mockResolvedValue({ slackInfo: __mocks__1.slackUserMock });
            const slackUser = yield slackHelpers_1.default.getUserInfoFromSlack(slackId, teamId);
            expect(slackUser).toBeInstanceOf(Object);
            expect(slackUser).toEqual(__mocks__1.slackUserMock);
        }));
    });
    describe(slack_helpers_1.default.toSlackSelectOptions, () => {
        it('should return the slack select option', () => {
            const data = ['john', 'doe', 'list'];
            const func = slack_helpers_1.default
                .toSlackSelectOptions(data, { textProp: 'text', valueProp: 'value' });
            expect(typeof func).toBe('object');
        });
        it('should return the slack select option when the type of the entry in not a string ', () => {
            const data = [3, 1, 2];
            const func = slack_helpers_1.default
                .toSlackSelectOptions(data, { textProp: 'text', valueProp: 'value' });
            expect(typeof func).toBe('object');
        });
    });
});
//# sourceMappingURL=slack-helpers.spec.js.map