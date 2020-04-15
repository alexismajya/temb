import sequelize, { Includeable } from 'sequelize';
import BatchUseRecord from '../../database/models/batch-use-record';
import RouteUseRecord from '../../database/models/route-use-record';
import User from '../../database/models/user';
import Route from '../../database/models/route';
import RouteBatch from '../../database/models/route-batch';
import { BaseService } from '../shared/base.service';
import database from '../../database';
import aisService from '../../services/AISService';

class RouteStatistics extends BaseService<BatchUseRecord, number> {
  constructor(batchuserecord = database.getRepository(BatchUseRecord)) {
    super(batchuserecord);
  }

  /**
   * Updates the a given route batch information by id and update cache
   * @param order
   * @param startDate
   * @param endDate
   * @return {Promise<>}
   * @throws {Error}
   */
  async getFrequentRiders(
    order: string, startDate: string, endDate: string, homebaseId: number,
  ): Promise<any[]> {
    try {
      const data = await this.findAll({
        attributes: [
          'userId', 'batchRecordId', [sequelize.fn('count', sequelize.col('userId')), 'userCount'],
        ],
        where: {
          userAttendStatus: 'Confirmed',
          createdAt: { [sequelize.Op.between]: [startDate, endDate] },
        },
        limit: 5,
        include: [...this.includeUsersOnRouteQuery(homebaseId)],
        group: [
          'BatchUseRecord.batchRecordId', 'BatchUseRecord.userId', 'user.id',
          'batchRecord.id', 'batchRecord->batch.id', 'batchRecord->batch->route.id',
        ],
        order: [[sequelize.fn('count', sequelize.col('userId')), order]],
      });
      return data;
    } catch (error) { return error.message; }
  }

  private includeUsersOnRouteQuery(homebaseId: number): Includeable[] {
    return [
      {
        model: User,
        as: 'user',
        attributes: ['name', 'email'],
      },
      {
        model: RouteUseRecord,
        as: 'batchRecord',
        attributes: ['batchId'],
        include: [
          {
            model: RouteBatch,
            as: 'batch',
            attributes: ['batch'],
            include: [
              {
                model: Route,
                as: 'route',
                attributes: ['name'],
                where: { homebaseId },
              }],
          }],
      }];
  }

  async getUserPicture(email: string): Promise<string> {
    const defaultProfilePicture = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
    const details: any = await aisService.getUserDetails(email);
    return details && details.picture ? details.picture : defaultProfilePicture;
  }

  async addUserPictures(payload: any[]): Promise<object> {
    return Promise.all(
      payload.map(async (data) => {
        const topArray = { ...data };
        topArray.picture = await this.getUserPicture(data.user.email);
        return topArray;
      }),
    );
  }

  /**
   * Updates the a given route batch information by id and update cache
   * @param startDate
   * @param endDate
   * @return {Promise<>}
   * @throws {Error}
   */
  async getTopAndLeastFrequentRiders(
    startDate: string, endDate: string, homeBaseId: number,
  ): Promise<object> {
    try {
      const top = await this.getFrequentRiders('DESC', startDate, endDate, homeBaseId);

      const firstFiveMostFrequentRiders = await this.addUserPictures(top);

      const bottom = await this.getFrequentRiders('ASC', startDate, endDate, homeBaseId);

      const leastFiveFrequentRiders = await this.addUserPictures(bottom);

      const data = {
        firstFiveMostFrequentRiders,
        leastFiveFrequentRiders,
      };
      return data;
    } catch (error) {
      return error.message;
    }
  }
}

export const routeStatistics = new RouteStatistics();
export default RouteStatistics;
