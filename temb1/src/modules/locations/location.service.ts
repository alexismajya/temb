import { Location, Op } from '../../database';
import { BaseService } from '../shared/base.service';
import ILogger from '../shared/logging/logger.interface';
import { Repository } from 'sequelize-typescript';

export class LocationService extends BaseService<Location, number> {
  constructor(model: Repository<Location>, private readonly logger: ILogger) {
    super(model);
  }

  /**
   * @description Get location by longitude and latitude from the database
   * @param {number} longitude The longitude of the location on the db
   * @param {number} latitude The latitude of the location on the db
   * @param {boolean} raiseError
   * @param {boolean} includeAddress
   * @return {Promise<object>} location model
   */

  async findLocation(longitude: number, latitude: number, includeAddress = false) {
    try {
      const include = includeAddress ? ['address'] : [];
      const location = await this.model.findOne({
        include,
        where: {
          [Op.and]: [{ latitude }, { longitude }],
        },
      });
      return location ? location.get() as Location : location;
    } catch (error) {
      this.logger.log(error);
      throw new Error('Could not find location record');
    }
  }

  /**
   * @description creates a new location on the database if it does not exist
   * @param  {number} longitude The longitude of the location on the db
   * @param  {number} latitude The latitude of the location on the db
   * @returns {object} The new location datavalues
   */
  async createLocation(longitude: number, latitude: number) {
    try {
      console.log(longitude, latitude, 'hehehrhrhehe');
      const [newlocation, created] = await this.model.findOrCreate({
        where: { longitude, latitude },
        defaults: { longitude, latitude },
      });
      console.log(newlocation, created);
      return newlocation.get() as Location;
    } catch (error) {
      this.logger.log(error);
      throw new Error('failed to create location');
    }
  }

  async getLocationById(id: string) {
    try {
      const attributes = ['latitude', 'longitude'];
      const location = await this.findById(Number(id), [], attributes);
      return location;
    } catch (error) {
      this.logger.log(error);
    }
  }
}
