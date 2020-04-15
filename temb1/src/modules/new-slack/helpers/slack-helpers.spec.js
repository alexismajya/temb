import NewSlackHelpers from './slack-helpers';
import userTripActions from '../trips/user/actions';
import userTripBlocks from '../trips/user/blocks';
import { tripReasonSchema } from '../trips/schemas';
import { slackUserMock } from '../../../helpers/slack/__mocks__';
import WebClientSingleton from '../../../utils/WebClientSingleton';
import { teamDetailsService } from '../../teamDetails/teamDetails.service';
import Cache from '../../shared/cache';
import SlackHelpers from '../../../helpers/slack/slackHelpers';
import { addressService } from '../../addresses/address.service';

const webClientMock = {
  users: {
    info: jest.fn(() => Promise.resolve({
      user: slackUserMock,
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
    jest.spyOn(WebClientSingleton, 'getWebClient').mockReturnValue(webClientMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('toSlackDropdown', () => {
    it('should convert any array to an array with text and value fields', () => {
      const data = [{ text: 'Hello', value: 1 }, { text: 'World', value: 2 }];

      const result = NewSlackHelpers.toSlackDropdown(data);
      expect(result.length).toEqual(data.length);
    });
  });
  describe(NewSlackHelpers.getPickupModal, () => {
    it('should add pick up modal', async () => {
      jest.spyOn(NewSlackHelpers, 'getAddresses').mockResolvedValue(homebaseName);
      jest.spyOn(NewSlackHelpers, 'toSlackSelectOptions').mockResolvedValue('options');
      const result = await NewSlackHelpers.getPickupModal('nairobi', state);
      expect(NewSlackHelpers.getAddresses).toBeCalled();
      expect(typeof result).toBe('object');
      expect(result.type).toEqual('modal');
      expect(result.title.text).toEqual('Pickup Details');
    });
  });
  describe('getDestinationFields, getPickupFields, getNavBlock', () => {
    it('should return destination fields', async () => {
      jest.spyOn(NewSlackHelpers, 'getAddresses').mockResolvedValue([
        'DestAddress1', 'Others']);
      const destinationFields = await NewSlackHelpers.getDestinationFields();
      expect(destinationFields).toBeDefined();
      expect(destinationFields[0].name).toEqual('destination');
      expect(destinationFields[1].name).toEqual('othersDestination');
    });

    it('should return nav block', async () => {
      const navBlock = await NewSlackHelpers.getNavBlock(userTripBlocks.navBlock, 'back', userTripActions.getDepartment);
      expect(navBlock.block_id).toEqual(userTripBlocks.navBlock);
      expect(navBlock.elements[0].value).toEqual(userTripActions.getDepartment);
    });
  });

  describe('getAddresses', () => {
    it('should return a list of addresses', async () => {
      jest.spyOn(addressService, 'getAddressListByHomebase').mockResolvedValue([
        'address1', 'address2'
      ]);
      const addresses = await NewSlackHelpers.getAddresses();
      expect(addresses).toHaveLength(3);
      expect(addresses).toContain('Others');
    });
  });

  describe('dialogValidator', () => {
    it('should validate data from a dialog', () => {
      const data = { reason: 'Good reason' };
      const validate = NewSlackHelpers.dialogValidator(data, tripReasonSchema);
      expect(validate).toBeDefined();
      expect(validate).toEqual(data);
    });

    it('Should not validate data: Validation fail', () => {
      const data = {};
      try {
        NewSlackHelpers.dialogValidator(data, tripReasonSchema);
      } catch (err) {
        expect(err.errors).toBeDefined();
        expect(err.errors[0].name).toEqual('reason');
      }
    });
  });

  describe('getUserInfo', () => {
    it('Should get user\'s info from slack', async () => {
      const user = await NewSlackHelpers.getUserInfo('FakeSlackId', 'fakeToken');
      expect(user).toEqual(slackUserMock);
    });

    it('Should get user info from the cache', async () => {
      jest.spyOn(Cache, 'fetch').mockResolvedValue(slackUserMock);
      const user = await NewSlackHelpers.getUserInfo('FakeSlackId', 'fakeToken');
      expect(user).toEqual(slackUserMock);
    });
  });

  describe('getUserInfoFromSlack', () => {
    const slackId = 'U145';
    const teamId = 'TS14';
    const token = 'token';
    it('should return user info from slack', async (done) => {
      jest.spyOn(Cache, 'fetch').mockResolvedValueOnce({});
      jest.spyOn(teamDetailsService, 'getTeamDetailsBotOauthToken').mockResolvedValue(token);
      SlackHelpers.fetchUserInformationFromSlack = jest
        .fn()
        .mockResolvedValue({ user: slackUserMock });

      const slackUser = await SlackHelpers.getUserInfoFromSlack(slackId, teamId);

      expect(teamDetailsService.getTeamDetailsBotOauthToken).toBeCalledWith(teamId);
      expect(SlackHelpers.fetchUserInformationFromSlack).toBeCalledWith(slackId, token);
      expect(slackUser).toBeInstanceOf(Object);
      expect(slackUser.user).toEqual(slackUserMock);
      done();
    });

    it('should return user info that already exist', async () => {
      jest.spyOn(Cache, 'fetch').mockResolvedValue({ slackInfo: slackUserMock });
      const slackUser = await SlackHelpers.getUserInfoFromSlack(slackId, teamId);
      expect(slackUser).toBeInstanceOf(Object);
      expect(slackUser).toEqual(slackUserMock);
    });
  });
  describe(NewSlackHelpers.toSlackSelectOptions, () => {
    it('should return the slack select option', () => {
      const data = ['john', 'doe', 'list'];
      const func = NewSlackHelpers
        .toSlackSelectOptions(data, { textProp: 'text', valueProp: 'value' });
      expect(typeof func).toBe('object');
    });
    it('should return the slack select option when the type of the entry in not a string ', () => {
      const data = [3, 1, 2];
      const func = NewSlackHelpers
        .toSlackSelectOptions(data, { textProp: 'text', valueProp: 'value' });
      expect(typeof func).toBe('object');
    });
  });
});
