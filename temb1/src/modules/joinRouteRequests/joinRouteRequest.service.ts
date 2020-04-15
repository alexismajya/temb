import { BaseService } from '../shared/base.service';
import database from '../../database';
import JoinRequest from '../../database/models/join-request';
import bugsnagHelper from '../../helpers/bugsnagHelper';

const {
  models: {
    Engagement, RouteBatch, Route,
  },
} = database;

class JoinRouteRequestService extends BaseService <JoinRequest, number> {
  constructor(model = database.getRepository(JoinRequest)) {
    super(model);
  }

  defaultInclude = ['manager',
    {
      model: Engagement,
      as: 'engagement',
      include: ['partner', 'fellow'],
    },
    {
      model: RouteBatch,
      as: 'routeBatch',
      include: ['riders', { model: Route, as: 'route', include: ['destination'] }],
    },
  ];

  /**
    *
    * @param {integer} engagementId
    * @param {integer} managerId
    * @param {integer} routeBatchId
    * @param {string} managerComment
    * @return {Promise<JoinRequest>}
    * @throws {Error}
 */
  async createJoinRouteRequest(
    engagementId: number,
    managerId: number,
    routeBatchId: number,
    managerComment: string = '',
  ): Promise<JoinRequest> {
    try {
      return this.model.create({
        engagementId,
        managerId,
        routeBatchId,
        managerComment,
        status: 'Pending',
      });
    } catch (error) {
      bugsnagHelper.log(error);
    }
  }

  /**
   * @param {integer} id
   * @return {Promise} {}
   * @throws {Error}
   */
  async getJoinRouteRequest(id: number, include = this.defaultInclude) {
    return this.findById(id, include);
  }

  /**
   * Updates a join route request by id and updates cache
   * @param id
   * @param {
   *    {
   *      managerComment:string, opsComment:string, distance:number,
   *      status: 'Pending' | 'Declined' | 'Approved' | 'Confirmed',
   *      managerId:number, busStopId:number, homeId:number, engagementId:number,
   *      busStopDistance:number, routeImageUrl:string
   *    }
   * } data
   * @return {Promise<>}
   * @see JoinRouteRequestService#getJoinRouteRequest for sample return data
   * @throws {Error}
   */
  async updateJoinRouteRequest(id: number, data: {
    id: number,
    status: string,
    engagement?: { engagementId: number },
    manager?: { managerId: number },
    routeBatch?: { routeBatchId: number },
  }) {
    const routeJoinRequest = this.getJoinRouteRequest(id);
    if (routeJoinRequest) {
      return this.update(id, data);
    }
    return {
      message: 'Join route request not found',
    };
  }
}

export const joinRouteRequestService = new JoinRouteRequestService();

export default JoinRouteRequestService;
