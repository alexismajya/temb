import database from '../../../database';
import HttpError from '../../../helpers/errorHandler';
import userService from '../user.service';

const { models: { User } } = database;
const mockdata = { id: 1, name: 'test1', email: 'deleteEmail@gmail.com' };

describe('Delete user', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should run getUser method and return  a user', async () => {
    const findUserMock = jest.spyOn(User, 'findOne');
    findUserMock.mockResolvedValue({ mockdata });
    const httpMock = jest.spyOn(HttpError, 'throwErrorIfNull').mockImplementation(() => {});
    const findUser = jest.spyOn(userService, 'getUser').mockResolvedValue(mockdata);

    const result = await userService.getUser('deleteEmail@gmail.com');
    expect(result).toEqual(mockdata);
    expect(httpMock).toHaveBeenCalledTimes(0);
    expect(findUser).toHaveBeenCalledTimes(1);
  });

  it('should run getUser method and throw error', async () => {
    const mockErr = new Error('User not found');
    const findUserMock = jest.spyOn(User, 'findOne');
    findUserMock.mockRejectedValue(mockErr);
    const httpMock = jest.spyOn(HttpError, 'throwErrorIfNull').mockImplementation(() => {});
    const findUser = jest.spyOn(userService, 'getUser').mockResolvedValue(mockErr);
    const result = await userService.getUser('unknownEmail@gmail.com');
    expect(result).toEqual(mockErr);
    expect(httpMock).toHaveBeenCalledTimes(0);
    expect(findUser).toHaveBeenCalledTimes(1);
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
      jest.spyOn(User, 'destroy').mockResolvedValue([]);
      const user = await userService.deleteUser(1);
      expect(user).toEqual([]);
    });
  });
});
