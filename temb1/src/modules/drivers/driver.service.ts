import { Op } from 'sequelize';
import { BaseService } from '../shared/base.service';
import database from '../../database';
import Driver from '../../database/models/driver';
import ProviderHelper from '../../helpers/providerHelper';
import { IDriver } from '../../database/models/interfaces/driver.interface';

const { models: { User } } = database;

/**
 * A class representing the Driver service
 *
 * @class DriverService
 * @extends {BaseService}
 */
class DriverService extends BaseService <Driver, number> {
  constructor() {
    super(Driver);
  }

  /**
   *@description Adds a driver
   * @returns {  object }
   * @param driverObject
   */
  async create(driverObject: IDriver) {
    try {

      const { driverNumber } = driverObject;
      const [driver] = await this.model.findOrCreate({
        where: { driverNumber: { [Op.like]: `${driverNumber}%` } },
        defaults: { ...driverObject },
      });
      return driver;
    } catch (e) {
      return e;
    }
  }

  /**
  * @description Returns a list of drivers from db
  * page and size variables can also be passed on the url
  * @param {{object}} where - Sequelize options.
  * @param {{ page:number, size:number }} pageable
  * @returns {object} An array of cabs
  * @example DriverService.getDrivers(
   *  { page:1, size:20 }
   * );
   */
  async getDrivers(pageable = ProviderHelper.defaultPageable, where = {}) {
    const { pageMeta: { totalPages, limit, count, page }, data } = await this.getPaginated({
      page: pageable.page,
      limit: pageable.size,
      defaultOptions: { where },
    });
    return {
      data,
      pageMeta: {
        totalPages,
        pageNo: page,
        totalItems: count,
        itemsPerPage: limit,
      },
    };
  }

  /**
   * Get a specific driver by id
   *
   * @static
   * @param {number} id - The driver's unique identifier
   * @returns {object} The driver object
   * @memberof DriverService
   */
  async getDriverById(id: number) {
    const driver = await this.findById(id);
    return driver;
  }

  /**
   * Delete a specific driver information
   *
   * @static
   * @param {object|number} driverId - The specified driver object or unique identifier
   * @returns {object} An object containing the affected row
   * @memberof DriverService
   */
  async deleteDriver(driver: IDriver) {
    const result = await this.model.destroy({
      where: {
        id: driver.id,
      },
    });
    return result;
  }

  /**
  * @description updates a driver in the db
  * driverId and the driver details should be passed to the function
  * @param {{driverId: integer}} driverId- Sequelize options.
  * @param {{ object }} driverDetails
  * @returns {object} An updated driver object
  * @example DriverService.driverUpdate(
    *  1, {
      "driverName":"Deo",
      "driverPhoneNo":"079238983982",
      "email":"deo.asssa@andla.om",
      "driverNumber":"565S78324"
    }
    * );
    */
  async driverUpdate(driverId: number, driverDetails: object) {
    try {
      const oldDriverDetails = await this.findById(driverId);
      if (!oldDriverDetails) return{ message: 'Update Failed. Driver does not exist' };
      const updatedDriver = await this.update(driverId, { ...driverDetails });
      return updatedDriver;
    } catch (err) {
      throw new Error('could not update the driver details');
    }
  }

  /**
  * @description checks if a driver'd details already exists in the db
  * @param {{email: string}} email- Sequelize options.
  * @param {{ phoneNo:number }} phoneNumber
  *  @param {{ number:number }} driverNumber
  *  @param {{ id:number }} driverId
  * @example DriverService.exists(
    *  'james@andela.com',70868723, 23423423423, 1
    * );
    */
  static async exists(email: string, driverPhoneNo: string, driverNumber: string , id: number) {
    const subQuery = id
      ? `(SELECT * FROM "Drivers" WHERE "id"!='${id}') otherDrivers` : '"Drivers"';

    const query = `
        SELECT COUNT(*) !=0 as count  FROM
        ${subQuery}
         WHERE "driverPhoneNo" ='${driverPhoneNo}' OR "email" ='${email}'
          OR "driverNumber" ='${driverNumber}';`;

    // @ts-ignore
    const [[{ count }]] = await database.query(query);
    return count;
  }

  static async findOneDriver(options: object) {
    const driver = await Driver.findOne({
      ...options,
      include: [{ model: User, attributes: ['slackId'], as: 'user' }],
    });
    return driver;
  }
}

export const driverService = new DriverService();
export default DriverService;
