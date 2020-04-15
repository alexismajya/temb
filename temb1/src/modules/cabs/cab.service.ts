import Cab from '../../database/models/cab';
import ProviderHelper from '../../helpers/providerHelper';
import { BaseService } from '../shared/base.service';
import database from '../../database';

class CabService extends BaseService<Cab, number> {
  constructor(cab = database.getRepository(Cab)) {
    super(cab);
  }

  async findOrCreateCab(regNumber: string,
    capacity: number, model: string, providerId: number, color?: string) {
    const payload = {
      where: { regNumber },
      defaults: {
        regNumber, capacity, model, providerId, color,
      },
    };
    const [cab, isNewRecord] = await this.model.findOrCreate(payload);
    return { isNewRecord, cab: cab.get() as Cab };
  }

  async findByRegNumber(regNumber: string): Promise<Cab> {
    const cabDetails = await this.findOneByProp({ prop: 'regNumber', value: regNumber });
    return cabDetails;
  }

  getById(pk: number) { return this.findById(pk); }

  /**
   * @description Returns a list of cabs from db
   * page and size variables can also be passed on the url
   * @param {{object}} where - Sequelize options.
   * @param {{ page:number, size:number }} pageable
   * @example CabService.getAllCabsByPage(
   *  { page:1, size:20 }
   * );
   */
  async getCabs(pageable = ProviderHelper.defaultPageable, where = {}) {
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

  async updateCab(cabId: number, cabUpdateObject: object): Promise<object> {
    try {
      const oldCabDetails = await this.getById(cabId);
      if (!oldCabDetails) return { message: 'Update Failed. Cab does not exist' };
      const updatedCab = await this.update(cabId, { ...cabUpdateObject });
      return updatedCab;
    } catch (error) {
      throw new Error('Could not update cab details');
    }
  }

  async deleteCab(cabId: number): Promise<number> {
    const responseData = await this.model.destroy({
      where: { id: cabId },
    });
    return responseData;
  }
}

export const cabService = new CabService();
export default CabService;
