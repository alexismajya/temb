import Utils from '../../utils';
import bugsnagHelper from '../../helpers/bugsnagHelper';
import HttpError from '../../helpers/errorHandler';
import Response from '../../helpers/responseHelper';
import { roleService } from '../roleManagement/role.service';
import UserService from '../users/user.service';
import RolesHelper from '../../helpers/RolesHelper';


class AuthenticationController {
  /**
  * @static async verifyUser
  * @description This method verifies that the user has a role on the application
  * @param  {object} req The http request object
  * @param  {object} res The http response object
  * @returns {object} The http response object
  * @memberof AuthenticationController
  */
  static async verifyUser(req, res) {
    try {
      const { currentUser: { UserInfo } } = req;
      const user = await UserService.getUserByEmail(UserInfo.email, true);
      const roleNames = Utils.mapThroughArrayOfObjectsByKey(user.roles, 'name');
      const roles = await roleService.findUserRoles(user.id);
      const LocationsAndRoles = RolesHelper.mapLocationsAndRoles(roles);
      const userInfo = {
        ...UserInfo, roles: roleNames, ...LocationsAndRoles
      };
      const token = await Utils.generateToken('180m', { userInfo });
      return Response.sendResponse(res, 200, true, 'Authentication Successful', {
        isAuthorized: true,
        userInfo,
        token,
      });
    } catch (error) {
      bugsnagHelper.log(error);
      if (error instanceof HttpError) {
        return Response.sendResponse(res, 401, false, 'User is not Authorized', {
          isAuthorized: false
        });
      }
      HttpError.sendErrorResponse(error, res);
    }
  }
}

export default AuthenticationController;
