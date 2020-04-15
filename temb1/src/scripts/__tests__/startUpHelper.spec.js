import StartUpHelper from '../startUpHelper';
import database from '../../database';
import { roleService } from '../../modules/roleManagement/role.service';
import RouteEventHandlers from '../../modules/events/route-events.handlers';

const { models: { User } } = database;

describe('Super Admin test', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll((done) => database.close().then(done));

  it('should test createSuperAdmin successfully', async () => {
    const UserFindOrCreateMock = jest.spyOn(User, 'findOrCreate');
    UserFindOrCreateMock.mockResolvedValue([{ addRoles: () => {} }]);
    jest.spyOn(roleService, 'findOrCreateUserRole');
    const RoleFindOrCreateMock = jest.spyOn(roleService, 'createOrFindRole');
    RoleFindOrCreateMock.mockResolvedValue(['Basic']);

    await StartUpHelper.ensureSuperAdminExists();
    expect(roleService.findOrCreateUserRole).toHaveBeenCalledTimes(2);
    expect(RoleFindOrCreateMock).toHaveBeenCalledTimes(1);
  });

  it('should test getUserNameFromEmail successfully with single name in email', () => {
    const email = 'tembea@gmail.com';
    const userName = StartUpHelper.getUserNameFromEmail(email);
    expect(userName).toEqual('Tembea');
  });

  it('should test getUserNameFromEmail successfully with both names in email', () => {
    const email = 'tembea.devs@gmail.com';
    const userName = StartUpHelper.getUserNameFromEmail(email);
    expect(userName).toEqual('Tembea Devs');
  });

  it('should test createSuperAdmin and throw an error', async () => {
    const mockErr = new Error('boo');
    const UserFindOrCreateMock = jest.spyOn(User, 'findOrCreate').mockRejectedValue(mockErr);

    const RoleFindOrCreateMock = jest.spyOn(roleService, 'createOrFindRole');
    RoleFindOrCreateMock.mockResolvedValue(['Basic']);

    try {
      await StartUpHelper.ensureSuperAdminExists();
    } catch (error) {
      expect(error).toEqual(mockErr);
    }
    expect(UserFindOrCreateMock).toHaveBeenCalledTimes(2);
    expect(RoleFindOrCreateMock).toHaveBeenCalledTimes(0);
  });

  describe('StartUpHelper.registerEventHandlers', () => {
    it('should initalize and create subscriptions', async (done) => {
      jest.spyOn(RouteEventHandlers, 'init');
      StartUpHelper.registerEventHandlers();
      expect(RouteEventHandlers.init).toHaveBeenCalledTimes(1);
      done();
    });
  });
});
