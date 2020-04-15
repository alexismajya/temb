import faker from 'faker';
import userService, { UserService, ISlackUserInfo } from '../user.service';
import database, { Op } from '../../../database';
import User from '../../../database/models/user';
import { Repository } from 'sequelize-typescript';
import Homebase from '../../../database/models/homebase';

describe(UserService, () => {
  let testUser: User;
  let userRepo: Repository<User>;

  const getMockSlackUserInfo = (email?: string) => {
    const realName = faker.name.findName();
    return {
      id: faker.random.word().toLocaleUpperCase(),
      real_name: realName,
      team_id: 'U1234',
      name: realName,
      profile: {
        email: email || faker.internet.email(),
        real_name: realName,
      },
    };
  };

  const webMock = {
    users: {
      lookupByEmail: ({ email }: { email: string; }) => {
        const realName = faker.name.findName();
        return Promise.resolve({
          ok: true,
          user: getMockSlackUserInfo(email),
        });
      },
    },
  };

  beforeAll(async() => {
    const testUserDetails = {
      name: faker.name.findName(),
      slackId: `U${faker.random.word()}1`,
      phoneNo: faker.phone.phoneNumber(),
      email: `z${faker.internet.email()}`,
    };
    userRepo = database.getRepository(User);
    const result = await userRepo.create(testUserDetails);
    testUser = result.get() as User;
  });

  afterAll((done) => database.close().then(done, done));

  it('should be a valid instance', () => {
    expect(userService).toBeDefined();
  });

  describe(UserService.prototype.createNewUser, () => {
    it('should create a user', async() => {
      const mockSlackUserInfo = getMockSlackUserInfo() as ISlackUserInfo;
      const result = await userService.createNewUser(mockSlackUserInfo);
      expect(result).toEqual(expect.objectContaining({
        email: mockSlackUserInfo.profile.email,
        name: mockSlackUserInfo.profile.real_name,
      }));
    });

    it('should not be able to create user', async () => {
      expect(userService.createNewUser({} as ISlackUserInfo))
        .rejects.toThrow('Could not create user');
    });
  });

  describe(UserService.prototype.getUserInfo, () => {
    it('should return an instance if ISlackUserInfo', async () => {
      const testEmail = 'tester@tembea.com';
      jest.spyOn(userService, 'getSlackClient').mockResolvedValue(webMock);

      const result = await userService.getUserInfo('tembea.slack.com', testEmail);
      expect(result).toEqual(expect.objectContaining({
        profile: expect.objectContaining({
          email: testEmail,
        }),
      }));
    });
  });

  describe(UserService.prototype.getUsersFromDB, () => {
    it('should return paginated users', async () => {
      const result = await userService.getUsersFromDB(2, 1);
      expect(result).toBeDefined();
      expect(result.rows.length).toBe(2);
    });
  });

  describe(UserService.prototype.getUserSlackInfo, () => {
    beforeEach(() => jest.restoreAllMocks());

    it('should return valid user info', async() => {
      const testEmail = 'hello@example.com';
      const result = await userService.getUserSlackInfo(webMock, testEmail);

      expect(result.profile.email).toEqual(testEmail);
    });

    it('should not get User SlackInfo', async () => {
      jest.spyOn(webMock.users, 'lookupByEmail').mockRejectedValue(null);
      expect(userService.getUserSlackInfo(webMock, 'hello@email.com'))
        .rejects.toThrowError(/^User not found/g);
    });
  });

  describe(UserService.prototype.getUser, () => {
    it('should return user with specified email', async () => {
      const result = await userService.getUser(testUser.email);
      expect(result.id).toEqual(testUser.id);
    });

    it('should throw an error when user is not found', async () => {
      expect(userService.getUser('idonttknow'))
        .rejects.toThrowError(/^User not found/g);
    });
  });

  describe(UserService.prototype.saveNewRecord, () => {
    it('should update user info', async () => {
      const mockSlackUserInfo = getMockSlackUserInfo() as ISlackUserInfo;
      const result = await userService.saveNewRecord(testUser, mockSlackUserInfo);
      expect(result.slackId).toEqual(mockSlackUserInfo.id);
      await userRepo.update({ slackId: testUser.slackId }, { where: { id: testUser.id } });
    });

    it('should not update the user in the database', async () => {
      expect(userService.saveNewRecord(testUser, null)).rejects.toThrow();
    });
  });

  describe(UserService.prototype.getUserById, () => {
    it('should return valid user when found', async () => {
      const user = await userService.getUserById(testUser.id);
      expect(user).toEqual(expect.objectContaining({
        id: testUser.id,
      }));
    });
  });

  describe(UserService.prototype.getUserBySlackId, () => {
    it('should return valid user when found', async () => {
      const existingUser = await userRepo.findOne({ where: { id: testUser.id } });
      const user = await userService.getUserBySlackId(existingUser.slackId);
      expect(user).toEqual(expect.objectContaining({
        id: testUser.id,
      }));
    });
  });

  describe(UserService.prototype.getUserByEmail, () => {
    it('should return valid user when found', async () => {
      const user = await userService.getUserByEmail(testUser.email);
      expect(user).toEqual(expect.objectContaining({
        id: testUser.id,
      }));
    });
  });

  describe(UserService.prototype.updateUser, () => {
    it('should update a user object', async () => {
      const testSlackId = 'U0000123';
      const result = await userService.updateUser(testUser.id, { slackId: testSlackId });
      expect(result.slackId).toEqual(testSlackId);
      await userRepo.update({ slackId: testUser.slackId }, { where: { id: testUser.id } });
    });
  });

  describe(UserService.prototype.getPagedFellowsOnOrOffRoute, () => {
    it('should get fellows not on route', async () => {
      const data = await userService.getPagedFellowsOnOrOffRoute(false,
        { page: 1, size: 1 }, { homebaseId: testUser.homebaseId });
      expect(data.data).toBeInstanceOf(Array);
      expect(data.pageMeta).toBeInstanceOf(Object);
    });

    it('should get fellows on route', async () => {
      const data = await userService.getPagedFellowsOnOrOffRoute(true,
        { size: 1, page: 1 }, { homebaseId: testUser.homebaseId });
      expect(data.data).toBeInstanceOf(Array);
      expect(data.pageMeta).toBeInstanceOf(Object);
    });
  });

  describe(UserService.prototype.findOrCreateNewUserWithSlackId, () => {
    beforeEach(() => {
      jest.restoreAllMocks();
    });

    it('should find or create a fellow by specific slackId', async () => {
      const userData = {
        slackId: faker.random.word(),
        name: faker.name.firstName(),
        email: faker.internet.email(),
      };
      const result = await userService.findOrCreateNewUserWithSlackId(userData);
      expect(result.slackId).toBe(userData.slackId);
      expect(result.email).toBe(userData.email);
    });
  });

  describe(UserService.prototype.updateDefaultHomeBase, () => {
    it('should update homebase id of user', async () => {
      const otherHomebase = await database.getRepository(Homebase).findOne({ where: {
        id: { [Op.not]: testUser.homebaseId },
      }});
      const homeBaseId = await userService.updateDefaultHomeBase(testUser.slackId,
        otherHomebase.id);
      expect(homeBaseId).toEqual(otherHomebase.id);
      await userRepo.update({ homebaseId: testUser.homebaseId }, { where: { id: testUser.id } });
    });
  });

  describe(UserService.prototype.createUserByEmail, () => {

    beforeEach(() => {
      jest.spyOn(userService, 'getSlackClient').mockResolvedValue(webMock);
    });

    it('should create a user if they do not exists', async () => {
      const user = await userService.createUserByEmail('team.slack.com',
        `z${faker.internet.email()}`);
      expect(user.id).toBeDefined();
    });

    it('should not create a user if they do not exists on the workspace', async () => {
      jest.spyOn(userService, 'getUserInfo').mockResolvedValue(null);
      expect(userService.createUserByEmail('team.slack.com', 'email@email.com'))
        .rejects.toThrow();
    });
  });

  describe(UserService.prototype.getWeeklyCompletedTrips, () => {
    it('should return users with their weekly completed trips trips', async () => {
      jest.spyOn(userService, 'findAll').mockResolvedValue([]);
      await userService.getWeeklyCompletedTrips('date');
      expect(userService.findAll).toBeCalled();
    });
  });

  describe(UserService.prototype.getWeeklyCompletedRoutes, () => {
    it('should return users with their weekly completed trips trips', async () => {
      jest.spyOn(userService, 'findAll').mockResolvedValue([]);
      await userService.getWeeklyCompletedRoutes('date');
      expect(userService.findAll).toBeCalled();
    });
  });
});
