import sequelize from 'sequelize';
import { routeService } from './../routes/route.service';
import { BaseService, IReturningOptions } from '../shared/base.service';
import RouteBatch from '../../database/models/route-batch';
import { Pageable } from '../homebases/homebase.service';
import { Includeable } from 'sequelize/types';
import RouteServiceHelper from '../../helpers/RouteServiceHelper';
import { Route, Address }  from '../../database';
import { SLACK_DEFAULT_SIZE } from '../../helpers/constants';

const { Op, fn } = sequelize;

class RouteBatchService extends BaseService<RouteBatch, number> {
  constructor() {
    super(RouteBatch);
  }

  async createRouteBatch(batchDetails: RouteBatchDetails): Promise<RouteBatch> {
    const batch = await this.model.create(batchDetails);
    return batch;
  }

  async getById (id: number, include?: Includeable[]): Promise<RouteBatch> {
    const batch = await this.findById(id, include);
    return batch;
  }

  async getRouteBatches(filter: BatchFilter): Promise<object> {
    const batches = await this.findAll({
      where: {
        status: { [Op.eq]: `${filter.status}` },
        cabId: { [Op.ne]: null },
        driverId: { [Op.ne]: null },
      },
    });
    return batches;
  }

    /**
    * Updates the a given route batch information by id and update cache
    * @param id
    * @param {
    *    {
    *      capacity:number, takeOff:string, comments:string
    *      status: 'Active' | 'Inactive',
    *    }
    * } data
    * @return {Promise<>}
    * @see RouteService#getRouteById for sample return data
    * @throws {Error}
    */
  async updateRouteBatch(id: number, data: any, returning?: IReturningOptions) {
    const route = await this.update(id, data, returning);
    return route;
  }

    /**
   * Retrieves route batch details by id.
   * @param id
   * @param {Boolean} withFks
   * @return {Promise<Route|*>}
   * @private
   * @throws {Error}
   */
  async getRouteBatchByPk(id: number, withFks = false) {
    if (!id) return null;
    let include;
    if (withFks) {
      include = ['riders', ...routeService.defaultInclude()];
    }
    const batch = await this.getById(id, include);
    return batch;
  }

  async getPagedAvailableRouteBatches(homebaseId: number, page: number, where: any,
    size = SLACK_DEFAULT_SIZE) {
    return this.getPaginated({
      page,
      limit: size,
      defaultOptions: {
        order: [['id', 'asc']],
        include: ['riders', 'cabDetails', 'route', ...routeService.updateDefaultInclude(where)],
        where: {
          [Op.and]: [
              { homebaseId }, { status: where.status }, { cabId: { [Op.ne]: null } },
              { driverId: { [Op.ne]: null } },
          ],
        },
      },
    });
  }

  async getRoutes(
    pageable: Pageable = routeService.defaultPageable(),
    where: { status?: string } = {}, homebaseId = 1, isV2 = false,
  ): Promise<any> {
    const { page, size, sort } = pageable;
    let order: any;
    let filter: any;

    if (sort) { order = [...routeService.convertToSequelizeOrderByClause(sort)]; }
    if (where && where.status) filter = { where: { homebaseId, status: where.status } };
    else { filter = { where: { homebaseId } }; }

    const { data, pageMeta: {
      totalPages, limit, count, page: actualPage,
    } } = await this.getPaginated({
      page, limit: size, defaultOptions: { ...filter, order,
        include: ['riders',
          ...routeService.updateDefaultInclude(where)],
        attributes: [[fn('COUNT', sequelize.col('riders.routeBatchId')), 'inUse'],
          ...routeService.defaultRouteDetails],
        group: [...routeService.defaultRouteGroupBy()],
      },
    });

    const routes = isV2 ? data : data.map(RouteServiceHelper.serializeRouteBatch);
    return { routes, pageMeta: { totalPages, page: actualPage, totalResults: count, pageSize: limit,
    } };
  }

    /**
   * deletes a route batch by its id
   * @return {Promise<number>}
   * @param routeBatchId
   */
  async deleteRouteBatch(routeBatchId: number) {
    return this.model.destroy({ where: { id: routeBatchId } });
  }

  async findActiveRouteWithDriverOrCabId(driverIdOrCabId: { driverId?: number, cabId?: number }) {
    const result = await this.findAll({
      where: { status: 'Active', ...driverIdOrCabId },
      include: [
        {
          model: Route,
          as: 'route',
          include: [{
            model: Address,
            as: 'destination',
          }],
        },
      ],
    });
    return result;
  }
}

export interface RouteBatchDetails {
  routeId: number;
  capacity: number;
  status?: string;
  takeOff: string;
  providerId?: number;
  inUse?: number;
  batch?: string;
  comments?: string;
}

interface BatchFilter {
  status: string;
}

export const routeBatchService = new RouteBatchService();
export default RouteBatchService;
