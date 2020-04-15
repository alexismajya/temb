import { roleService } from '../role.service';
import database from '../../../database';
import HttpError from '../../../helpers/errorHandler';
import userService from '../../users/user.service';
import mockData from '../__mocks__/mockData';
import notification from '../notification';

const { models: { Role, UserRole, User } } = database;

describe('Role Service', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should run createNewRole method and return a role', async () => {
    const findOrCreateMock = jest.spyOn(Role, 'findOrCreate');
    findOrCreateMock.mockResolvedValue(['Basic', true]);

    const result = await roleService.createNewRole('Ope');
    expect(result).toEqual('Basic');
    expect(findOrCreateMock).toHaveBeenCalledWith({ where: { name: 'Ope' } });
  });

  it('should run createNewRole method and call HttpError method when role already exists',
    async () => {
      const findOrCreateMock = jest.spyOn(Role, 'findOrCreate');
      findOrCreateMock.mockResolvedValue(['Basic', false]);
      const httpMock = jest.spyOn(HttpError, 'throwErrorIfNull').mockImplementation(() => {});

      await roleService.createNewRole('John');
      expect(findOrCreateMock).toHaveBeenCalledWith({ where: { name: 'John' } });
      expect(httpMock).toHaveBeenCalledWith(false, 'Role already exists', 409);
    });

  it('should run createNewRole method and throw an error', async () => {
    const mockErr = new Error('boo');
    const findOrCreateMock = jest.spyOn(Role, 'findOrCreate');
    findOrCreateMock.mockRejectedValue(mockErr);
    const httpMock = jest.spyOn(HttpError, 'throwErrorIfNull');

    expect.assertions(3);
    try {
      await roleService.createNewRole('John');
    } catch (error) {
      expect(error).toEqual(mockErr);
    }
    expect(findOrCreateMock).toHaveBeenCalledWith({ where: { name: 'John' } });
    expect(httpMock).not.toHaveBeenCalled();
  });

  it('should run getRoles method and return roles', async () => {
    const { mockedRoles, mockdatas } = mockData;
    const findAllMock = jest.spyOn(Role, 'findAll');
    findAllMock.mockResolvedValue(mockedRoles);
    const httpMock = jest.spyOn(HttpError, 'throwErrorIfNull').mockImplementation(() => {});
    const result = await roleService.getRoles();
    expect(result).toEqual(mockdatas);
    expect(findAllMock).toHaveBeenCalled();
    expect(httpMock).toHaveBeenCalledTimes(1);
    expect(httpMock).toHaveBeenCalledWith(mockdatas, 'No Existing Roles');
  });

  it('should run getRoles method and throw error', async () => {
    const mockErr = new Error('no roles');
    const findAllMock = jest.spyOn(Role, 'findAll').mockRejectedValue(mockErr);
    const httpMock = jest.spyOn(HttpError, 'throwErrorIfNull').mockImplementation(() => {});

    try {
      await roleService.getRoles();
    } catch (error) {
      expect(error).toEqual(mockErr);
    }

    expect(findAllMock).toHaveBeenCalled();
    expect(httpMock).toHaveBeenCalledTimes(0);
  });

  it('should run getUserRoles method and return roles', async () => {
    const findUserMock = jest.spyOn(User, 'findOne');
    findUserMock.mockResolvedValue({ id: 1 });
    const httpMock = jest.spyOn(HttpError, 'throwErrorIfNull').mockImplementation(() => {});
    const findUserRoles = jest.spyOn(roleService, 'findUserRoles').mockResolvedValue(['Editor']);

    const result = await roleService.getUserRoles('tomboy@email.com');
    expect(result).toEqual(['Editor']);
    expect(findUserMock).toHaveBeenCalledWith({ where: { email: 'tomboy@email.com' } });
    expect(httpMock).toHaveBeenCalledTimes(1);
    expect(httpMock).toHaveBeenCalledWith('Editor', 'User has no role');
    expect(findUserRoles).toHaveBeenCalled();
  });

  it('should run getUserRoles method and throw error', async () => {
    const errorMock = new Error('no roles');
    const findUserMock = jest.spyOn(User, 'findOne');
    findUserMock.mockRejectedValue(errorMock);
    const httpMock = jest.spyOn(HttpError, 'throwErrorIfNull');

    expect.assertions(3);
    try {
      await roleService.getUserRoles('tom@email.com');
    } catch (error) {
      expect(error).toEqual(errorMock);
    }

    expect(findUserMock).toHaveBeenCalledWith({ where: { email: 'tom@email.com' } });
    expect(httpMock).toHaveBeenCalledTimes(0);
  });

  it('should run getRole method and return roles', async () => {
    const { mockRoleDetails } = mockData;
    const getRoleMock = jest.spyOn(Role, 'findOne');
    getRoleMock.mockResolvedValue(mockRoleDetails);
    const httpMock = jest
      .spyOn(HttpError, 'throwErrorIfNull')
      .mockImplementation(() => {});

    const result = await roleService.getRole('Super Admin');
    expect(result.name).toEqual('Super Admin');
    expect(getRoleMock).toHaveBeenCalledWith({ where: { name: 'Super Admin' } });
    expect(httpMock).toHaveBeenCalledTimes(1);
  });

  it('should run getRole method and throw error', async () => {
    const errorMock = new Error('Rolex');
    const getRoleMock = jest.spyOn(Role, 'findOne').mockRejectedValue(errorMock);
    const httpMock = jest
      .spyOn(HttpError, 'throwErrorIfNull')
      .mockImplementation(() => {});

    try {
      await roleService.getRole('Oba');
    } catch (error) {
      expect(error).toEqual(errorMock);
    }

    expect(getRoleMock).toHaveBeenCalledWith({ where: { name: 'Oba' } });
    expect(httpMock).toHaveBeenCalledTimes(0);
  });

  it('should run createUser method and return userRole', async () => {
    const getUserMock = jest.spyOn(userService, 'getUser')
      .mockResolvedValue({ id: 1 });
    const getRoleMock = jest.spyOn(roleService, 'getRole')
      .mockResolvedValue({ id: 1, name: 'Executive' });
    jest.spyOn(UserRole, 'create').mockResolvedValue(() => {});

    const result = await roleService.createUserRole('boss@email.com', 'VIP', 1);

    expect(result).toEqual(true);
    expect(getUserMock).toHaveBeenCalledWith('boss@email.com');
    expect(getRoleMock).toHaveBeenCalledWith('VIP');
  });

  it('should return an error if user role already exists ', async () => {
    jest.spyOn(userService, 'getUser')
      .mockResolvedValue({ id: 1 });
    jest.spyOn(roleService, 'getRole')
      .mockResolvedValue({ id: 1, name: 'Executive' });
    jest.spyOn(UserRole, 'create').mockResolvedValue(Promise.reject());

    const httpMock = jest
      .spyOn(HttpError, 'throwErrorIfNull').mockImplementation(() => {});

    const result = await roleService.createUserRole('boss@email.com', 'VIP', 1);

    expect(result).toEqual(true);
    expect(httpMock).toHaveBeenCalledTimes(1);
    expect(httpMock).toHaveBeenCalledWith('',
      'This Role is already assigned to this user', 409);
  });

  it('should run createUser method and throw error', async () => {
    const failMock = new Error('Failed');
    const getUserMock = jest.spyOn(userService, 'getUser').mockRejectedValue(failMock);
    const getRoleMock = jest.spyOn(roleService, 'getRole').mockImplementation(() => {});

    const httpMock = jest
      .spyOn(HttpError, 'throwErrorIfNull')
      .mockImplementation(() => {});
    try {
      await roleService.createUserRole('chief@email.com', 'SENATE', 1);
    } catch (error) {
      expect(error).toEqual(failMock);
    }

    expect(getUserMock).toHaveBeenCalledWith('chief@email.com');
    expect(getRoleMock).toHaveBeenCalledTimes(1);
    expect(httpMock).toHaveBeenCalledTimes(0);
  });

  describe('createOrFindRole', () => {
    it('should create new role and return full role object', async () => {
      jest.spyOn(Role, 'findOrCreate').mockResolvedValue({
        id: 1, name: 'Super Admin', createdAt: '2019-01-14 03:00:00+03',
      });
      const role = await roleService.createOrFindRole('Super Admin');
      expect(role).toEqual({
        id: 1, name: 'Super Admin', createdAt: '2019-01-14 03:00:00+03',
      });
    });
  });

  describe('findUserRoles', () => {
    it('should create new role and return full role object', async () => {
      jest.spyOn(UserRole, 'findAll').mockResolvedValue([]);
      const roles = await roleService.findUserRoles(1);
      expect(roles).toEqual([]);
    });
  });

  describe('createUserRoles', () => {
    it('should create new role and return full role object', async () => {
      jest.spyOn(UserRole, 'findOrCreate').mockResolvedValue([]);
      const roles = await roleService.findOrCreateUserRole(1, 1, 1);
      expect(roles).toEqual([]);
    });
  });

  describe('deleteUserRole', () => {
    it('should delete user role', async () => {
      jest.spyOn(UserRole, 'destroy').mockResolvedValue([]);
      const roles = await roleService.deleteUserRole(1);
      expect(roles).toEqual([]);
    });
  });

  describe('Notify user of role change', () => {
    it('Should notify user of new role assignment', async () => {
      const user = { id: 3, name: 'mike' };
      const message = 'Dear mike, you have been assigned the Guest role on Tembea';
      jest.spyOn(userService, 'getUser').mockReturnValue(user);
      jest.spyOn(roleService, 'getRole').mockReturnValue({ id: 2, name: 'Guest' });
      jest.spyOn(UserRole, 'create').mockReturnValue(user);
      jest.spyOn(notification, 'notifyUser');
      await roleService.createUserRole('email', 'Guest', 2);
      expect(notification.notifyUser).toHaveBeenCalledWith(user, message);
    });
    it('Should notify user of revoked role', async () => {
      const user = { id: 3, name: 'mike' };
      const message = 'Dear mike, your role on Tembea has been revoked';
      jest.spyOn(UserRole, 'destroy').mockReturnValue(0);
      jest.spyOn(userService, 'getUserById').mockReturnValue(user);
      jest.spyOn(notification, 'notifyUser');
      await roleService.deleteUserRole(2);
      expect(notification.notifyUser).toHaveBeenCalledWith(user, message);
    });
  });
});
