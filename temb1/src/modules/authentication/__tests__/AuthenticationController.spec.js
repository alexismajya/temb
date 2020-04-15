import AuthenticationController from '../AuthenticationController';
import Response from '../../../helpers/responseHelper';
import HttpError from '../../../helpers/errorHandler';
import Utils from '../../../utils';
import { roleService } from '../../roleManagement/role.service';
import UserService from '../../users/user.service';
import RolesHelper from '../../../helpers/RolesHelper';

describe('AuthenticationController Unit Test', () => {
  let sendResponseMock;
  let httpErrorMock;

  beforeEach(() => {
    sendResponseMock = jest.spyOn(Response, 'sendResponse').mockImplementation();
    httpErrorMock = jest.spyOn(HttpError, 'sendErrorResponse').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Verify User method', () => {
    let reqMock;

    beforeEach(() => {
      reqMock = { currentUser: { UserInfo: { email: 'boy@email.com' } } };
      jest.spyOn(UserService, 'getUserByEmail').mockReturnValue({
        id: 1,
        roles: [{ name: 'Admin' }]
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
      jest.resetAllMocks();
    });

    it('should call the response method with success message', async () => {
      const utilsMock = jest.spyOn(Utils, 'mapThroughArrayOfObjectsByKey')
        .mockReturnValue('user');
      jest.spyOn(roleService, 'findUserRoles').mockReturnValue([]);
      jest.spyOn(RolesHelper, 'mapLocationsAndRoles').mockReturnValue({});
      await AuthenticationController.verifyUser(reqMock, 'res');
      expect(utilsMock).toHaveBeenCalledTimes(1);
      expect(utilsMock).toHaveBeenCalledWith(expect.any(Array), 'name');
      expect(sendResponseMock).toHaveBeenCalledTimes(1);
      expect(httpErrorMock).toHaveBeenCalledTimes(0);
    });

    it('should throw error and call HttpError method', async () => {
      const errMock = new Error('failed');
      const roleServiceMock = jest.spyOn(roleService, 'findUserRoles').mockRejectedValue(errMock);
      await AuthenticationController.verifyUser(reqMock, 'res');
      expect(roleServiceMock).toHaveBeenCalledTimes(1);
      expect(sendResponseMock).toHaveBeenCalledTimes(0);
      expect(httpErrorMock).toHaveBeenCalledTimes(1);
      expect(httpErrorMock).toHaveBeenCalledWith(errMock, 'res');
    });
  });
});
