import Response from '../helpers/responseHelper';
import UserService from '../modules/users/user.service';
import { providerService } from '../modules/providers/provider.service';
import GeneralValidator from './GeneralValidator';
import { updateProviderSchema, newProviderSchema, newDriverSchema } from './ValidationSchemas';

class ProviderValidator {
  /**
   * @description validate request body for creating a provider
   * @returns errors or calls next
   * @param req
   * @param res
   * @param next
   */
  static validateNewProvider(req, res, next) {
    return GeneralValidator.joiValidation(req, res, next, req.body, newProviderSchema);
  }

  /**
   * @description validate provider update body middleware
   * @returns errors or calls next
   * @example ProviderService.updateProvider(req,res,next);
   * @param req
   * @param res
   * @param next
   */
  static verifyProviderUpdate(req, res, next) {
    return GeneralValidator
      .joiValidation(req, res, next, { ...req.params, ...req.body }, updateProviderSchema, true);
  }

  /**
   * @description This middleware validates driver body passed in the request
   * @param  {object} req The HTTP request sent
   * @param  {object} res The HTTP response object
   * @param  {function} next The next middleware
   * @return {any} The next middleware or the http response
   */
  static validateDriverRequestBody(req, res, next) {
    return GeneralValidator.joiValidation(req, res, next, req.body, newDriverSchema);
  }

  /**
   * @description This middleware validates existence of a provider by there id
   * @param  {object} req The HTTP request sent
   * @param  {object} res The HTTP response object
   * @param  {function} next The next middleware
   * @return {any} The next middleware or the http response
   */
  static async validateProviderExistence(req, res, next) {
    const { body: { providerId } } = req;
    const provider = await providerService.findByPk(providerId);
    if (!provider) {
      return Response.sendResponse(res, 404, false, 'Provider doesn\'t exist');
    }
    return next();
  }

  /**
   * Validate the existence of a provider with given user id
   *
   * @static
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @param {object} next - Express next function
   * @returns {object} Returns an evaluated response
   * or calls the next middlware with the **providerData** object attached to the response scope
   * @memberof ProviderValidator
   */
  static async validateProvider(req, res, next) {
    const { body: { email }, headers: { teamurl } } = req;
    // check if user does not exists and channel is neither email nor WhastApp
    if (providerService.isDmOrChannel(req.body.notificationChannel)) {
      try {
        const providerUser = await UserService.createUserByEmail(teamurl, email);
        Object.assign(req.body, { providerUserId: providerUser.id });
      } catch (error) {
        const message = 'The user with specified email does not exist';
        return Response.sendResponse(res, 404, false, message);
      }
    }
    return next();
  }
}

export default ProviderValidator;
