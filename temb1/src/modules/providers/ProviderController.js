import { Op } from 'sequelize';
import { providerService } from './provider.service';
import HttpError from '../../helpers/errorHandler';
import bugsnagHelper from '../../helpers/bugsnagHelper';
import { DEFAULT_SIZE as defaultSize } from '../../helpers/constants';
import ProviderHelper from '../../helpers/providerHelper';
import ErrorTypeChecker from '../../helpers/ErrorTypeChecker';
import Response from '../../helpers/responseHelper';
import Utils from '../../utils';

class ProviderController {
  /**
   * @description Create a provider in the database
   * @param {object} req
   * @param {object} res
   * @returns {object} Http response object
   */
  static async addProvider(req, res) {
    const { headers: { homebaseid, origin }, body: data } = req;
    let [code, success, message, provider] = [201, true, 'Provider created successfully', null];
    try {
      if (providerService.isDmOrChannel(data.notificationChannel)) {
        Object.assign(data, { verified: true });
      }
      const result = await providerService.createProvider({ ...data, homebaseId: homebaseid });
      await providerService.verify(result, { origin });
      provider = result;
    } catch (err) {
      code = 400;
      success = false;
      if (ProviderController.isPhoneNumberOrEmailError(err)) {
        message = 'Phone number or email already exists';
      } else {
        message = 'failed to create provider, provider probably exists already';
      }
      bugsnagHelper.log(err);
    }
    Response.sendResponse(res, code, success, message, provider);
  }

  static async getAllProviders(req, res) {
    try {
      let { page, size, name } = req.query;
      const { headers: { homebaseid } } = req;
      page = page || 1;
      size = size || defaultSize;
      name = name && name.trim();
      const where = name ? {
        name: { [Op.iLike]: `%${name}%` }
      } : null;
      const pageable = { page, size };
      const providersData = await providerService.getProviders(pageable, where, homebaseid);
      const {
        data, pageMeta: {
          totalPages, pageNo, totalItems: totalResults, itemsPerPage: pageSize
        }
      } = providersData;
      const message = `${pageNo} of ${totalPages} page(s).`;
      const pageData = ProviderHelper.paginateData(
        totalPages, page, totalResults, pageSize, data, 'providers'
      );
      return Response.sendResponse(res, 200, true, message, pageData);
    } catch (error) {
      bugsnagHelper.log(error);
      HttpError.sendErrorResponse(error, res);
    }
  }

  /**
   * @description Updates provider details
   * @returns {object} with updated provider details
   * @example ProvidersController.updateProvider(req,res);
   * @param req
   * @param res
   */
  static async updateProvider(req, res) {
    try {
      const { body, params: { id } } = req;
      const data = await providerService.updateProvider({ ...body }, id);
      if (data.message) {
        return Response.sendResponse(res, 404, false, data.message || 'Provider doesnt exist');
      }
      return Response.sendResponse(res, 200, true,
        'Provider Details updated Successfully', data);
    } catch (error) {
      bugsnagHelper.log(error);
      const { message, statusCode } = ErrorTypeChecker.checkSequelizeValidationError(error,
        `The name ${req.body.name} is already taken`);
      return Response.sendResponse(res, statusCode || 500,
        false, message || `Unable to update details ${error}`);
    }
  }

  /**
   * @description Deletes provider details
   * @returns {object} deletes provider details
   * @example providerService.deleteProvider(req,res);
   * @param req
   * @param res
   */
  static async deleteProvider(req, res) {
    let message;
    try {
      const { params: { id } } = req;
      const result = await providerService.deleteProvider(id);
      message = 'Provider does not exist';
      if (result > 0) {
        message = 'Provider deleted successfully';
        return Response.sendResponse(res, 200, true, message);
      }
      return Response.sendResponse(res, 404, false, message);
    } catch (error) {
      bugsnagHelper.log(error);
      const serverError = {
        message: 'Server Error. Could not complete the request',
        statusCode: 500
      };
      HttpError.sendErrorResponse(serverError, res);
    }
  }

  /**
   * @description method that gets all providers with vehicles and drivers
   * @param req
   * @param res
   */
  static async getViableProviders(req, res) {
    const { headers: { homebaseid } } = req;
    const providers = await providerService.getViableProviders(homebaseid);
    if (!providers[0]) return Response.sendResponse(res, 404, false, 'No viable provider exists');
    return Response.sendResponse(res, 200, true, 'List of viable providers', providers);
  }

  /**
   * @description verify provider code
   * @param req
   * @param res
   */
  static async activateProvider(req, res) {
    const { body: { token } } = req;
    let [statusCode, message, success, body] = [200, 'Provider activated Successfully', true, null];
    try {
      const decoded = Utils.verifyToken(token, 'TEMBEA_PUBLIC_KEY');
      const { id } = decoded;
      body = await providerService.activateProviderById({ verified: true }, id);
    } catch (error) {
      statusCode = 400;
      success = false;
      message = error.message;
      if (ProviderController.isTokenValidationError(error)) {
        message = 'Sorry, token is not valid or has been expired. Request to validate your account '
          + 'again';
      }
      bugsnagHelper.log(error);
    }
    Response.sendResponse(res, statusCode, success, message, body);
  }

  static isPhoneNumberOrEmailError(err) {
    return err.errors && (err.errors[0].path === 'phoneNo' || err.errors[0].path === 'email');
  }
}

export default ProviderController;
