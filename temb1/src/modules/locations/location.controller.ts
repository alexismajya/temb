import HttpError from '../../helpers/errorHandler';
import { Request, Response } from 'express';
import { LocationService } from './location.service';
import ILogger from '../shared/logging/logger.interface';

export class LocationController {
  constructor(
    private readonly service: LocationService,
    private readonly logger: ILogger) { }

  /**
   * @description get location in the database
   * @param {object} req
   * @returns {object} latitude and longitude location
   */
  async getLocation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const location = await this.service.getLocationById(id);
      return res.status(200).send({ location });
    } catch (error) {
      HttpError.sendErrorResponse(error, res);
      this.logger.log(error);
    }
  }
}
