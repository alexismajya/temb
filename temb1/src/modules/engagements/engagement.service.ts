import database, { Engagement } from '../../database';
import { BaseService } from '../shared/base.service';

class EngagementService extends BaseService<Engagement, number> {
  constructor(engagement = database.getRepository(Engagement)) {
    super(engagement);
  }

  /**
   *
   * @param {string} startDate Fellow's engagement start date
   * @param {string} endDate Fellow's engagement end date
   * @param {string} workHours Fellow's working hours format: startTime-endTime -> HH:MM-HH:MM
   * @param {User} fellow
   * @param {Partner} partner
   * @return {Promise<Engagement>}
   * @throws {Error}
   */
  async findOrCreateEngagement(workHours: string, { id: fellowId }: { id: number },
    { id: partnerId }: { id: number }, startDate: string, endDate: string): Promise<Engagement> {
    const [engagement] = await Engagement.findOrCreate({
      where: { fellowId, partnerId },
      defaults: {
        startDate,
        endDate,
        workHours,
        fellowId,
        partnerId,
      },
    });
    return engagement;
  }

  /**
   *
   * @param id
   * @return {Promise<Engagement>}
   * @throws {Error}
   */
  async getEngagement(id: number) {
    return Engagement.findByPk(id, { include: ['partner', 'fellow'] });
  }

  /**
   * Update an engagement information with the given id
   * @param {number} id - engagement id
   * @param {{startDate:string, endDate:string, workHours:string}}
   * @return {Promise<Engagement>}
   * @throws {Error}
   */
  async updateEngagement(id: number,
    { startDate, endDate, workHours }:
      { startDate: string, endDate: string, workHours: string }): Promise<Engagement> {
    const engagement = await this.getEngagement(id);
    await engagement.update({ startDate, endDate, workHours });
    return engagement;
  }
}

export const engagementService = new EngagementService();
export default EngagementService;
