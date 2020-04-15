import { homebaseService } from './homebase.service';
import HttpError from '../../helpers/errorHandler';
import bugsnagHelper from '../../helpers/bugsnagHelper';
import { DEFAULT_SIZE as defaultSize } from '../../helpers/constants';

class HomebaseController {
  /**
     * @description Create a homebase in the database
     * @param {object} req
     * @param {object} res
     * @returns {object} Http response object
     */

  static async addHomeBase(req, res) {
    const {
      homebaseName, channel, address, countryId, currency, opsEmail, travelEmail
    } = req.body;
    try {
      const { homebase, isNewHomebase } = await homebaseService.createHomebase({
        name: homebaseName, channel, address, countryId, currency, opsEmail, travelEmail
      });
      if (isNewHomebase) {
        delete homebase.deletedAt;
        return res.status(201)
          .json({
            success: true,
            message: 'Homebase created successfully',
            homeBase: homebase
          });
      }
      return res.status(409).json({
        success: false,
        message: `The homebase with name: '${homebaseName.trim()}' already exists`
      });
    } catch (err) {
      bugsnagHelper.log(err);
      HttpError.sendErrorResponse(err, res);
    }
  }

  /**
   * @description get a homebase in the database
   * @param {object} req
   * @param {object} res
   * @returns {object} list of homebases
   */
  static async getHomebases(req, res) {
    try {
      let { page, size } = req.query;
      page = page || 1;
      size = size || defaultSize;
      const where = homebaseService.getWhereClause(req.query);
      const pageable = { page, size };
      const result = await homebaseService.getHomebases(pageable, where);
      const message = `${result.pageNo} of ${result.totalPages} page(s).`;
      const pageMeta = {
        totalPages: result.totalPages,
        page: result.pageNo,
        totalResults: result.totalItems,
        pageSize: result.itemsPerPage
      };
      return (result.homebases.length === 1 ? res.status(200).json({
        success: true, message, homebase: result.homebases
      }) : res.status(200).json({
        success: true, message, pageMeta, homebases: result.homebases
      }));
    } catch (error) {
      HttpError.sendErrorResponse(error, res);
      bugsnagHelper.log(error);
    }
  }

  /**
   * @description edit a homebase
   * @param {object} req
   * @param {object} res
   * @returns {object} updated homebase
   */
  static async update(req, res) {
    const {
      body: {
        homebaseName: name, channel, countryId, address, currency, opsEmail, travelEmail
      },
      params: {
        id: homebaseId
      }
    } = req;

    try {
      const result = await homebaseService.updateDetails(
        name, homebaseId, channel, countryId, address, currency, opsEmail, travelEmail
      );
      
      if (result.error) throw new Error(result.error);
      if (result.errors) throw new Error(result.errors[0].message);
      const message = 'HomeBase Updated successfully';
      res.status(200).json({
        success: true, message, homebase: result
      });
    } catch (error) {
      const message = 'Homebase with specified name already exists';
      bugsnagHelper.log(error);
      return res.status(409).json({
        success: false,
        message
      });
    }
  }
}

export default HomebaseController;
