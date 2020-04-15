import Response from '../helpers/responseHelper';
import { homebaseService } from '../modules/homebases/homebase.service';
import CountryHelper from '../helpers/CountryHelper';
import GeneralValidator from './GeneralValidator';
import {
  newHomeBaseSchema,
  updateHomeBaseSchema,
} from './ValidationSchemas';
import HomeBaseHelper from '../helpers/HomeBaseHelper';

class HomebaseValidator {
  /**
     * @description This middleware checks that the country named exists
     * @param  {object} req The HTTP request sent
     * @param  {object} res The HTTP response object
     * @param  {function} next The next middleware
     * @return {any} The next middleware or the http response
     */
  static async validateCountryExists(req, res, next) {
    const { body: { countryId } } = req;
    if (countryId) {
      const message = `The country with Id: '${countryId}' does not exist`;
      const countryExists = await CountryHelper.checkIfCountryExistsById(countryId);
      if (!countryExists) {
        return Response.sendResponse(res, 404, false, message);
      }
    }

    return next();
  }

  /**
     * @description This middleware checks that country and homebase names are valid
     * @param  {object} req The HTTP request sent
     * @param  {object} res The HTTP response object
     * @param  {function} next The next middleware
     * @return {any} The next middleware or the http response
     */
  static validateHomeBase(req, res, next) {
    return GeneralValidator.joiValidation(req, res, next, req.body, newHomeBaseSchema);
  }

  /**
   * @description This middleware checks that homebaseID is valid
   * @param  {object} req The HTTP request sent
   * @param  {object} res The HTTP response object
   * @param  {function} next The next middleware
   * @return {any} The next middleware or the http response
   */
  static validateHomeBaseIdQueryParam(req, res, next) {
    return GeneralValidator.validateIdParam(req, res, next);
  }


  /**
   * @description This middleware checks that homebaseID and country Name are valid
   * @param  {object} req The HTTP request sent
   * @param  {object} res The HTTP response object
   * @param  {function} next The next middleware
   * @return {any} The next middleware or the http response
   */
  static validateUpdateHomeBase(req, res, next) {
    return GeneralValidator.joiValidation(req, res, next, req.body, updateHomeBaseSchema);
  }


  /**
   * @description This middleware checks that the homeBase exists
   * @param  {object} req The HTTP request sent
   * @param  {object} res The HTTP response object
   * @param  {function} next The next middleware
   * @return {any} The next middleware or the http response
   */
  static async validateHomeBaseExists(req, res, next) {
    const { params: { id }, body: { homebaseId } } = req;
    const verifyId = homebaseId || id;
    const homeBaseExists = await HomeBaseHelper.checkIfHomeBaseExists(verifyId);

    if (!homeBaseExists) {
      const message = `The HomeBase with Id: '${verifyId}' does not exist`;
      return Response.sendResponse(res, 404, false, message);
    }
    return next();
  }

  /**
   * @description this middlewear checks that each country has its own single opsEmail
   * @param  {object} req The HTTP request sent
   * @param  {object} res The HTTP response object
   * @param  {function} next The next middleware
   * @return {any} The next middleware or the http response
   */
  static async validHomeBaseEmail(req, res, next) {
    const { opsEmail, countryId } = req.body;
    const response = await homebaseService
      .findOneByProp({ prop: 'opsEmail', value: opsEmail });
    if (response === null || response.countryId === countryId) {
      return next();
    }
    const message = 'opsEmail already belongs to another homebase ';
    return Response.sendResponse(res, 409, false, message);
  }
}

export default HomebaseValidator;
