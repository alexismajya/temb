/* eslint-disable class-methods-use-this */
import Response from '../helpers/responseHelper';
import Utils from '../utils';

export class TokenValidator {
  constructor(utils, response) {
    this.utils = utils;
    this.response = response;
  }

  /**
   * @static authenticateToken
   * @description This middleware verifies and decodes the token
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns {object}
   * @memberof TokenValidator
   */
  async authenticateToken(req, res, next) {
    const token = req.headers.authorization;
    const jwtSecretKey = req.envSecretKey;

    if (!token) {
      const message = 'No token provided';
      return this.response.sendResponse(res, 401, false, message);
    }

    try {
      const decoded = this.utils.verifyToken(token, jwtSecretKey);
      req.currentUser = decoded;
      next();
    } catch (error) {
      const errorMessage = 'Failed to authenticate token! Valid token required';
      return this.response.sendResponse(res, 401, false, errorMessage);
    }
  }

  /**
   * @static validateRole
   * @description This middleware validates the user's role in the token
   * @param  {object} req The http request object
   * @param  {object} res The http response object
   * @param {*} next The express next function
   * @returns {object}
   * @memberof TokenValidator
   */
  validateRole(req, res, next) {
    const {
      currentUser: {
        userInfo: { roles }
      }
    } = req;
    const isAuthorized = roles.includes('Super Admin');

    if (!isAuthorized) {
      const errorMessage = 'Unauthorized access';
      return this.response.sendResponse(res, 401, false, errorMessage);
    }
    next();
  }

  /**
   * @static attachTembeaJwtSecret
   * @description This middleware attaches the name of the JWT key
   * passed in the env based on the `req.path`
   * @param  {object} req The http request object
   * @param  {object} res The http response object
   * @param {*} next The express next function
   * @memberof TokenValidator
   */
  attachJwtSecretKey(req, res, next) {
    if (req.path.startsWith('/auth/verify')) {
      req.envSecretKey = 'JWT_ANDELA_KEY';
      return next();
    }
    req.envSecretKey = 'TEMBEA_PUBLIC_KEY';
    next();
  }
}

const tokenValidator = new TokenValidator(Utils, Response);

export default tokenValidator;
