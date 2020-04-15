import database from '../../../database';
import SlackHelpers from '../slackHelpers';
import { teamDetailsService } from '../../../modules/teamDetails/teamDetails.service';
import WebClientSingleton from '../../../utils/WebClientSingleton';
import {
  testUserFromDb, testTripFromDb, slackUserMock, createNewUserMock, newUser
} from '../__mocks__';
import UserService from '../../../modules/users/user.service';
import tripService from '../../../modules/trips/trip.service';
import { cabService } from '../../../modules/cabs/cab.service';

const { models: { TripRequest, User } } = database;

// setup for all
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

describe('slackHelpers', () => {
  beforeEach(() => {
    jest.spyOn(WebClientSingleton, 'getWebClient').mockReturnValue(webClientMock);

    jest.spyOn(User, 'findOne').mockResolvedValue(testUserFromDb);
    jest.spyOn(User, 'findByPk').mockResolvedValue(testUserFromDb);
    jest.spyOn(User, 'findOrCreate').mockResolvedValue([{ dataValues: testUserFromDb.dataValues }]);
    jest.spyOn(UserService, 'getUserBySlackId').mockResolvedValue(testUserFromDb);

    jest.spyOn(TripRequest, 'findByPk').mockResolvedValue(testTripFromDb);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('fetchUserInformationFromSlack', () => {
    it('should call WebClientSingleton.getWebClient', async () => {
      // invoke
      const slackUser = await SlackHelpers.fetchUserInformationFromSlack('slackId', 'token');

      expect(typeof slackUser).toEqual('object');
      expect(slackUser).toEqual(slackUserMock);
    });
  });

  describe('getUserInfoFromSlack', () => {
    it('should return user info from slack', async () => {
      const slackId = 'U145';
      const teamId = 'TS14';
      const token = 'token';
      jest.spyOn(teamDetailsService, 'getTeamDetailsBotOauthToken').mockResolvedValue(token);
      SlackHelpers.fetchUserInformationFromSlack = jest
        .fn()
        .mockResolvedValue({ user: slackUserMock });

      const slackUser = await SlackHelpers.getUserInfoFromSlack(slackId, teamId);

      expect(teamDetailsService.getTeamDetailsBotOauthToken).toBeCalledWith(teamId);
      expect(SlackHelpers.fetchUserInformationFromSlack).toBeCalledWith(slackId, token);
      expect(slackUser).toBeInstanceOf(Object);
      expect(slackUser.user).toEqual(slackUserMock);
    });
  });

  describe('findOrCreateUserBySlackId', () => {
    const userId = 1;
    const teamId = 'U1GHSGS';
    const validUser = { id: teamId, email: 'tembea@andela.com' };
    beforeEach(() => {
      // create expected results
      jest.spyOn(SlackHelpers, 'getUserInfoFromSlack').mockResolvedValue(slackUserMock);
      jest.spyOn(UserService, 'createNewUser').mockResolvedValue(validUser);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should create and return new user if user does not exist', async () => {
      // mock dependencies and return expected values
      const nullUser = undefined;
      jest.spyOn(UserService, 'getUserBySlackId').mockResolvedValue(nullUser);

      // test expected behavior
      const user = await SlackHelpers.findOrCreateUserBySlackId(userId, teamId);
      expect(UserService.getUserBySlackId).toBeCalledWith(userId);
      expect(SlackHelpers.getUserInfoFromSlack).toBeCalledWith(userId, teamId);
      expect(UserService.createNewUser).toBeCalledWith(createNewUserMock.user);
      expect(user).toEqual(validUser);
    });

    it('should return user based on slackId if user already exists', async () => {
      jest.spyOn(UserService, 'getUserBySlackId').mockResolvedValue(validUser);
      const user = await SlackHelpers.findOrCreateUserBySlackId(userId, teamId);
      expect(UserService.getUserBySlackId).toBeCalledWith(userId);
      expect(SlackHelpers.getUserInfoFromSlack).toBeCalledTimes(0);
      expect(UserService.createNewUser).toBeCalledTimes(0);
      expect(user).toEqual(validUser);
    });
  });

  describe('findUserByIdOrSlackId', () => {
    it('should return user object when slackId is valid', async () => {
      jest.spyOn(UserService, 'getUserBySlackId').mockResolvedValue(testUserFromDb.dataValues);
      const user = await SlackHelpers.findUserByIdOrSlackId('U4500');
      expect(UserService.getUserBySlackId).toBeCalledTimes(1);
      expect(UserService.getUserBySlackId).toBeCalledWith('U4500');
      expect(user).toEqual(testUserFromDb.dataValues);
    });

    it('should return user object when id is valid', async () => {
      jest.spyOn(UserService, 'getUserById').mockResolvedValue(testUserFromDb.dataValues);
      const user = await SlackHelpers.findUserByIdOrSlackId(10);
      expect(user).toEqual(testUserFromDb.dataValues);
    });
  });

  describe('isRequestApproved', () => {
    it('should return trip status object with approved false', async () => {
      jest.spyOn(tripService, 'getById').mockResolvedValue(undefined);
      const trip = await SlackHelpers.isRequestApproved(23, 'UE45');
      expect(trip).toEqual({ approvedBy: null, isApproved: false });
    });

    it('should return a valid approval status when request exists', async () => {
      jest.spyOn(tripService, 'getById').mockResolvedValue({
        tripStatus: 'Approved',
        approvedById: testUserFromDb.dataValues.slackId
      });
      jest.spyOn(SlackHelpers, 'findUserByIdOrSlackId')
        .mockResolvedValue(testUserFromDb.dataValues);
      const trip = await SlackHelpers.isRequestApproved(23, 'UE45');
      expect(trip).toEqual({
        approvedBy: `<@${testUserFromDb.dataValues.slackId}>`, isApproved: true
      });
    });
  });

  describe('approveRequest', () => {
    it('should approve request when parameters is valid', async () => {
      jest.spyOn(tripService, 'getById').mockResolvedValue({
        tripStatus: 'Approved',
        approvedById: testUserFromDb.dataValues.slackId
      });
      jest.spyOn(tripService, 'updateRequest').mockResolvedValue({});
      jest.spyOn(SlackHelpers, 'findUserByIdOrSlackId').mockResolvedValue({ id: 5 });

      const tripStatus = await SlackHelpers.approveRequest(23, 'UE45', 'some text');
      expect(tripService.updateRequest).toBeCalledTimes(1);
      expect(tripStatus).toBeTruthy();
    });

    it('should return false when trip is not found', async () => {
      jest.spyOn(tripService, 'getById').mockResolvedValue(undefined);
      expect(SlackHelpers.approveRequest(23, 'UE45', 'some text')).rejects
        .toThrow(new Error('Error updating trip request'));
    });
  });

  describe('handleCancellation', () => {
    it('should return true/false when trip status is Cancelled', async () => {
      const tripRequest = {
        tripStatus: 'Cancelled'
      };
      jest.spyOn(tripService, 'getById').mockResolvedValue(tripRequest);
      const result = await SlackHelpers.handleCancellation();

      expect(result).toEqual(true);
    });
  });

  describe('findOrCreateUserBySlackId', () => {
    beforeEach(() => {
      jest.spyOn(UserService, 'getUserBySlackId').mockResolvedValue();
      jest.spyOn(SlackHelpers, 'getUserInfoFromSlack').mockResolvedValue(newUser);
      jest.spyOn(UserService, 'createNewUser').mockReturnValue({
        username: 'santos',
        email: 'tembea@tem.com'
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it("should return new user when user isn't found", async () => {
      const result = await SlackHelpers.findOrCreateUserBySlackId('1aaaBa', 'TI34DJ');
      expect(result).toEqual({ username: 'santos', email: 'tembea@tem.com' });
      expect(UserService.getUserBySlackId).toHaveBeenCalledTimes(1);
      expect(UserService.createNewUser).toHaveBeenCalledTimes(1);
    });

    it('should return null when user is found', async () => {
      UserService.getUserBySlackId = jest.fn(() => ({}));
      const result = await SlackHelpers.findOrCreateUserBySlackId('1aaaBa', 'TI34DJ');
      expect(UserService.getUserBySlackId).toHaveBeenCalled();
      expect(UserService.createNewUser).toHaveBeenCalledTimes(0);
      expect(result).toEqual({});
    });
  });

  describe('noOfPassengers', () => {
    it('should return name value pairs', () => {
      const result = SlackHelpers.noOfPassengers();
      expect(result.length === 10);
      expect(result[0]).toHaveProperty('text');
      expect(result[0]).toHaveProperty('value');
    });
  });

  describe('addMissingTripObjects', () => {
    it('should add decliner object to trip data', async () => {
      jest.spyOn(UserService, 'getUserById').mockResolvedValue({
        dataValues: {
          id: 15,
          name: 'Tembea SuperAdmin',
          slackId: 'UG93CNE80',
          phoneNo: null,
          email: 'ronald.okello@andela.com',
        }
      });
      const result = await SlackHelpers.addMissingTripObjects({ declinedById: 15 });
      expect(result.decliner).toBeDefined();
      expect(result.decliner.dataValues.slackId).toEqual('UG93CNE80');
    });
    it('should add confirmer object to trip data', async () => {
      jest.spyOn(UserService, 'getUserById').mockResolvedValue({
        dataValues: {
          id: 15,
          name: 'Tembea SuperAdmin',
          slackId: 'UG93CNE80',
          phoneNo: null,
          email: 'ronald.okello@andela.com',
        }
      });
      const result = await SlackHelpers.addMissingTripObjects({ confirmedById: 15 });
      expect(result.confirmer).toBeDefined();
      expect(result.confirmer.dataValues.slackId).toEqual('UG93CNE80');
    });
    it('should add cab object to trip data', async () => {
      jest.spyOn(cabService, 'getById').mockResolvedValue({
        dataValues: {
          id: 2,
          driverName: 'Tembea SuperAdmin',
          slackId: 'UG93CNE80',
          driverPhoneNo: null
        }
      });
      const result = await SlackHelpers.addMissingTripObjects({ cabId: 2 });
      expect(result.cab).toBeDefined();
      expect(result.cab.dataValues.id).toEqual(2);
      expect(result.cab.dataValues.driverName).toEqual('Tembea SuperAdmin');
    });
  });

  describe('getLocationCountryFlag', () => {
    it('should return the countryflag emoji of a location', () => {
      const flag = '🇳🇬';
      expect(SlackHelpers.getLocationCountryFlag('Nigeria')).toEqual(flag);
    });
  });
});
