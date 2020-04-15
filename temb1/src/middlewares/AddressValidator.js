import { addressService } from '../modules/addresses/address.service';
import { newAddressSchema, updateAddressSchema } from './ValidationSchemas';
import GeneralValidator from './GeneralValidator';
import Response from '../helpers/responseHelper';

class AddressValidator {
  /**
   * @description This middleware checks for the required properties
   * @param  {object} req The HTTP request sent
   * @param  {object} res The HTTP responds object
   * @param  {function} next The next middleware
   * @return {any} The next middleware or the http responds
   */
  static validateAddressBody(req, res, next) {
    return GeneralValidator.joiValidation(req, res, next, req.body, newAddressSchema);
  }

  /**
   * @description This middleware checks for the required properties
   * @param  {object} req The HTTP request sent
   * @param  {object} res The HTTP responds object
   * @param  {function} next The next middleware
   * @return {any} The next middleware or the http responds
   */
  static validateAddressUpdateBody(req, res, next) {
    return GeneralValidator.joiValidation(req, res, next, req.body, updateAddressSchema);
  }

  static async validateaddress(req, res, next) {
    const { address } = req.body;
    const place = await addressService.findAddress(address);
    if (place) {
      const message = 'Address already exists';
      return Response.sendResponse(res, 400, false, message);
    }
    return next();
  }

  static async validateUpdateaddress(req, res, next) {
    const { address } = req.body;
    const place = await addressService.findAddress(address);
    if (!place) {
      const message = 'Address does not exist';
      return Response.sendResponse(res, 404, false, message);
    }
    return next();
  }
}

export default AddressValidator;
