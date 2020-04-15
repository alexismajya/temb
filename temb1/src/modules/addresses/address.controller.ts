import HttpError from '../../helpers/errorHandler';
import bugsnagHelper from '../../helpers/bugsnagHelper';
import { addressService as addService } from './address.service';
import { DEFAULT_SIZE as defaultSize } from '../../helpers/constants';
import ResponseHelper from '../../helpers/responseHelper';
import ILogger from '../shared/logging/logger.interface';
import { Request, Response } from 'express';

export class AddressController {
  constructor(
    private readonly addressService = addService,
    private readonly logger: ILogger = bugsnagHelper) { }

  /**
   * @description creates a new location and address record
   * @param  {object} req The http request object
   * @param  {object} res The http response object
   * @returns {object} The http response object
   */
  async addNewAddress(req: Request, res: Response) {
    try {
      const { longitude, latitude, address } = req.body;
      const newLongitude = Number(longitude);
      const newLatitude = Number(latitude);
      
      const newAddress = await this.addressService.createNewAddress(newLongitude, newLatitude, address);
      let message : string = 'Address has been successfully created';
      let status: number = 201;
      const addressData = {
        address: {
          address: newAddress.address,
          longitude: newAddress.longitude,
          latitude: newAddress.latitude,
        },
      };
      if (!newAddress.isNewAddress) {
        message = 'Address already exists';
        status = 400;
      }
      return ResponseHelper.sendResponse(res, status, newAddress.isNewAddress, message, addressData);
    } catch (error) {
      this.logger.log(error);
      HttpError.sendErrorResponse(error, res);
    }
  }

  /**
   * @description Updates the address and location record
   * @param  {object} req The http request object
   * @param  {object} res The http response object
   * @returns {object} The http response object
   */
  async updateAddress(req: Request, res: Response) {
    try {
      const { newLongitude, newLatitude, newAddress, address } = req.body;
      const longitude = Number(newLongitude);
      const latitude = Number(newLatitude);
      const addressData = await this.addressService.updateAddress(
        address,
        longitude,
        latitude,
        newAddress,
      );

      const data = {
        address: {
          address: addressData.address,
          longitude: addressData.location.longitude,
          latitude: addressData.location.latitude,
        },
      };
      const message = 'Address record updated';
      return ResponseHelper.sendResponse(res, 200, true, message, data);
    } catch (error) {
      this.logger.log(error);
      HttpError.sendErrorResponse(error, res);
    }
  }

  /**
   * @description Read the address records
   * @param  {object} req The http request object
   * @param  {object} res The http response object
   * @returns {object} The http response object
   */
  async getAddresses(req: Request, res: Response) {
    try {
      const page = req.query.page || 1;
      const size = req.query.size || defaultSize;

      const data = await this.addressService.getAddressesFromDB(size, page);
      const { count, rows, totalPages: actualPagesCount } = data;
      if (rows.length <= 0 || page > actualPagesCount) {
        throw new HttpError('There are no records on this page.', 404);
      }

      const totalPages = Math.ceil(count / size);
      const message = `${page} of ${totalPages} page(s).`;

      const pageData = { pageMeta: { page, totalPages, totalResults: count } };
      const addressData = { pageData, data };
      return ResponseHelper.sendResponse(res, 200, true, message, addressData);
    } catch (error) {
      this.logger.log(error);
      HttpError.sendErrorResponse(error, res);
    }
  }

  /**
   * @description Read the address record
   * @param  {object} req The http request object
   * @param  {object} res The http response object
   * @returns {object} The http response object
   */
  async getSingleAddress(req: { params: { id: any; }; }, res: Response) {
    try {
      const { params: { id } } = req;
      const address = await this.addressService.findAddressById(id);
      return res.status(200).json(address);
    } catch (error) {
      HttpError.sendErrorResponse(error, res);
    }
  }
}

const addressController = new AddressController();
export default addressController;
