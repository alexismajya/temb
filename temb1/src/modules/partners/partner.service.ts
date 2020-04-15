import { Op } from 'sequelize';
import Partner from '../../database/models/partner';
import { BaseService } from '../shared/base.service';
import database from '../../database';

class PartnerService extends BaseService<Partner, number> {
  constructor(partner = database.getRepository(Partner)) {
    super(partner);
  }
  /**
   *
   * @param name
   * @return {Promise<Promise<Array<Instance, Boolean>>|Promise<Model, created>|*>}
   * @throws {Error}
   */
  async findOrCreatePartner(name: string): Promise<Partner> {
    const [partner] = await this.model.findOrCreate({
      where: { name: { [Op.iLike]: `${name}%` } },
      defaults: { name },
    });
    return partner;
  }
}

export const partnerService = new PartnerService();
export default PartnerService;
