import { homebaseInfo } from './route.service';
import { Includeable } from 'sequelize/types';
import { teamDetailsService } from '../teamDetails/teamDetails.service';
import database, { RouteRequest } from '../../database';
import { IRouteRequest } from '../../database/models/interfaces/route-request.interface';
import Engagement from '../../database/models/engagement';
import Cab from '../../database/models/cab';
import Address from '../../database/models/address';
import Users from '../../database/models/user';
import { BaseService } from '../shared/base.service';
import RemoveDataValues from '../../helpers/removeDataValues';

export class RouteRequestService extends BaseService<RouteRequest, number>
{

  defaultInclude: any[] = ['opsReviewer', 'manager',
    {
      model: Engagement,
      as: 'engagement',
      include: ['partner', 'fellow'],
    },
    {
      model: Address,
      as: 'busStop',
      include: ['location'],
    },
    {
      model: Address,
      as: 'home',
      include: ['location'],
    },
    {
      model: Users,
      as: 'requester',
    },
    // commented out due to issues with frontend, fetching Routes / Requests

    // homebaseInfo,
  ];

  constructor(model = database.getRepository(RouteRequest)) {
    super(model);
  }

  async findByPk(id:number, withFks = false) {
    const include = withFks ? this.defaultInclude : [];
    return await this.model.findByPk(id, { include });
  }

  /**
   * @param {
   *    {
   *      requesterId:number, managerComment:string, opsComment:string, distance:number,
   *      status: 'Pending' | 'Declined' | 'Approved' | 'Confirmed',
   *      managerId:number, busStopId:number, homeId:number, engagementId:number,
   *      busStopDistance:number, routeImageUrl:string
   *    }
   * } data
   * @return {Promise<RouteRequest>}
   * @throws {Error}
  */
  async createRoute(data: IRouteRequest) {
    return await this.add({
      requesterId: data.requesterId,
      routeImageUrl: data.routeImageUrl,
      managerId: data.managerId,
      busStopId: data.busStopId,
      homeId: data.homeId,
      engagementId: data.engagementId,
      opsComment: data.opsComment,
      managerComment: data.managerComment,
      distance: data.distance,
      busStopDistance: data.busStopDistance,
      status: 'Pending',
    });
  }

  /**
   * Get a specific route request by id from cache or database. It returns a readonly data model;
   * to update the route information use {@link RouteRequestService#update}
   * @param {number} id
   * @return {Promise<{
   *   id:number, distance:number, busStopDistance:number, status:string
   *   managerComment:string, opsComment:string,
   *   manager: {
   *      id:number, slackId:string, email:string,
   *   },
   *   busStop:{
   *     address:string, locationId:string
   *   },
   *   home:{
   *     address:string, locationId:string
   *   },
   *   engagement: {
   *     startDate:string, endDate:string, workHours:string,
   *     fellow: {
   *       id:number, slackId:string, email:string
   *     },
   *     partner: {
   *       name:string, id:number
   *     }
   *   }
   * }>}
   *
   * @throws {Error}
   */
  async getRouteRequest(id: number) {
    return this.findByPk(id, true);
  }

  /**
   * Updates the a given route request information by id and update cache
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
   * @see RouteRequestService#getRouteRequest for sample return data
   * @throws {Error}
   */
  async update(id: number, data: IRouteRequest): Promise<any> {
    return await super.update(id, data);
  }

  /**
   * Retrieves route request details by id.
   * @param id
   * @param {Array<string | object>} [include] list of database models to in fetch with the route
   * request model
   * @return {Promise<Promise<Model>|*>}
   * @private
   * @throws {Error}
  */
  async getRouteRequestByPk(id: number, includes? : Includeable[]) {
      const include = includes || this.defaultInclude;
      const routeRequest =  await this.findById(id, include);
      return routeRequest;
    }

  async getRouteRequestAndToken(routeRequestId:number, teamId:string) {
    const [slackBotOauthToken, routeRequest] = await Promise.all([
      teamDetailsService.getTeamDetailsBotOauthToken(teamId),
      this.getRouteRequest(routeRequestId),
    ]);
    return { slackBotOauthToken, routeRequest };
  }

  /**
   * Retrieves all route requests
   * @returns {Promise<Promise<Array<Model>>|Promise<Instance[]>|Promise<TInstance[]>|*|Array>}
   */
  async getAllConfirmedRouteRequests(homebaseId:number) {
    return await this.model.findAll({
      where: { homebaseId, status: 'Confirmed' },
      include: this.defaultInclude,
    });
  }

  async getCabCapacity(regNumber:string) {
    const cab = await Cab.findOne({
      where: { regNumber },
      attributes: ['id', 'capacity'],
    });
    return cab && cab.get() ? cab.get('capacity') : 0;
  }
}

const routeRequestService = new RouteRequestService();
export default routeRequestService;
