import sequelize from 'sequelize';
import moment from 'moment';
import database from '../../database';
import { MAX_INT as all } from '../../helpers/constants';
import HttpError from '../../helpers/errorHandler';
import UserService from '../users/user.service';
import RouteServiceHelper from '../../helpers/RouteServiceHelper';
import { BaseService } from '../shared/base.service';
import appEvents from '../events/app-event.service';
import { routeEvents } from '../events/route-events.constants';
import Route from '../../database/models/route';
import RouteBatch from '../../database/models/route-batch';
import { Pageable } from '../homebases/homebase.service';
import { RouteBatchDetails, routeBatchService } from '../routeBatches/routeBatch.service';

const {
  models: {
    Cab, Address, User, Driver, Homebase, Country,
  },
} = database;

const { Op } = sequelize;

export const homebaseInfo = {
  model: Homebase,
  as: 'homebase',
  attributes: ['id', 'name'],
  include: [{ model: Country, as: 'country', attributes: ['name', 'id', 'status'] }],
};

class RouteService extends BaseService <Route, number> {
  constructor(model = database.getRepository(Route)) {
    super(model);
  }

  sort() {
    return {
      cab: { model: Cab, as: 'cabDetails' },
      route: { model: Route, as: 'route' },
      riders: { model: User, as: 'riders' },
      destination: { model: Address, as: 'destination' },
      homebase: { model: Homebase, as: 'homebase' },
    };
  }

  defaultPageable(): Pageable {
    return {
      page: 1,
      size: all,
      sort: [{ predicate: 'id', direction: 'asc' }],
    };
  }

  defaultInclude(): any[] {
    return [
      'cabDetails',
      {
        model: Driver,
        as: 'driver',
        include: ['user'],
      },
      {
        model: Route, as: 'route', include: ['destination'],
      },
      {
        ...homebaseInfo,
      }];
  }

  /**
   * Returns a list of route default details (required)
   *
   * @readonly
   * @
   * @memberof RouteService
   */
  get defaultRouteDetails(): string[] {
    return ['id', 'status', 'capacity', 'takeOff', 'batch', 'comments', 'homebaseId'];
  }

  /**
   * Returns a list of default groupBy values (required)
   *
   * @readonly
   * @
   * @memberof RouteService
   */
  defaultRouteGroupBy(): string[] {
    return ['riders.id', 'RouteBatch.id', 'cabDetails.id', 'route.id', 'route->destination.id', 'driver.id',
      'driver->user.id', 'homebase.id', 'homebase->country.name', 'homebase->country.id'];
  }

  /**
   * @param {{
   *     name:string, destinationName:string, vehicleRegNumber:string, capacity:number,
   *     takeOff:string, comments:string, imageUrl:string }} data
   * @return {Promise<RouteBatch>}
   * @see RouteRequestService#serializeRouteBatch for sample of the object returned
   * @throws {Error}
   */
  async createRouteBatch(
    data: RouteBatchDetails, botToken: string, first = false): Promise<RouteBatch> {
    const {
      routeId, capacity, status, takeOff, providerId,
    } = data;
    const route: Route = await this.findById(routeId);
    const routeBatchObject = {
      routeId,
      capacity,
      status,
      takeOff,
      providerId,
      batch: await this.updateBatchLabel({ route, created: first }),
    };
    const routeBatch = await routeBatchService.createRouteBatch(routeBatchObject);
    appEvents.broadcast<RouteBatch>({
      name: routeEvents.newRouteBatchCreated,
      data: { botToken, data: routeBatch },
    });
    return routeBatch;
  }

  async createRoute(routeDetails: CreateRouteParam): Promise<object> {
    const { name, imageUrl, destinationId } = routeDetails;
    const batchInfo = { model: RouteBatch, as: 'routeBatch' };
    const [route, created] = await this.model.findOrCreate({
      where: { name: { [Op.iLike]: `${name}%` } },
      defaults: { name, imageUrl, destinationId },
      // @ts-ignore
      order: [[batchInfo, 'createdAt', 'DESC']],
      include: [batchInfo],
    });
    return { created, route: route.get() as Route };
  }

  /**
   *
   * @param routeBatchId
   * @param userId
   * @return {Promise<void>}
   * @throws {Error}
   */
  async addUserToRoute(routeBatchId: number, userId: number): Promise<void> {
    const route = await routeBatchService.getById(routeBatchId, ['riders']);

    HttpError.throwErrorIfNull(route, 'Route route not found');
    if (!RouteServiceHelper.canJoinRoute(route)) {
      HttpError.throwErrorIfNull(null, 'Route capacity has been exhausted', 403);
    }
    const updateUserTable = UserService.getUserById(userId)
      .then((user) => UserService.updateUser(user.id, { routeBatchId: route.id }));
    const updateRoute = await routeBatchService.updateRouteBatch(route.id,
      { inUse: route.inUse + 1 });

    await database.transaction(() => Promise.all([updateUserTable, updateRoute]));
  }

  async getRouteById(id: number, withFks = false): Promise<Route> {
    let include;
    if (withFks) {
      include = ['routeBatch'];
    }
    const route = await this.findById(id, include);
    return route;
  }

  async getRouteByName(name: string): Promise<Route> {
    const route = await this.findOneByProp({ prop: 'name', value: name });
    return route;
  }

  async updateBatchLabel({ route, created } : { route: Route, created: boolean }) {
    let batch = 'A';
    if (!created) {
      const fullRoute = await this.getRouteById(route.id, true);
      ({ batch } = fullRoute.routeBatch[fullRoute.routeBatch.length - 1]);
      const batchDigit = batch.charCodeAt(0) + 1;
      batch = String.fromCharCode(batchDigit);
    }
    return batch;
  }

  convertToSequelizeOrderByClause(sort: {
    predicate: string,
    direction: string | {
      model: sequelize.ModelCtor<sequelize.Model<any, any>>;
      as: string;
    },
  }[]): any[] {
    return sort.map((item) => {
      const { predicate, direction } = item;
      let order = [predicate, direction];
      if (RouteServiceHelper.isCabFields(predicate)) {
        order.unshift(this.sort().cab);
      }
      if (predicate === 'destination') {
        // @ts-ignore
        order = [this.sort(), this.sort().destination, 'address', direction];
      }
      if (predicate === 'name') { order.unshift(this.sort().route); }
      return order;
    });
  }

  /**
   * redefines defaultInclude
   * @param where
   * @return {array} containing the updated default include
   * @private
   */
  updateDefaultInclude(where: { [key: string]: string }) {
    if (where && where.name) {
      return [
        this.defaultInclude()[0], this.defaultInclude()[1],
        {
          model: Route,
          as: 'route',
          include: ['destination'],
          where: { name: { [Op.iLike]: `%${where.name}%` } },
        },
        this.defaultInclude()[3],
      ];
    }
    return this.defaultInclude();
  }

  async routeRatings(from: any, to: any, homebaseId: number) {
    const previousMonthStart = moment().subtract(1, 'months').date(1).format('YYYY-MM-DD');
    const previousMonthEnd = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
    let query = `
      SELECT BUR.id AS "BatchUseRecordID", BUR.rating, RUR.id AS "RouteRecordID",
      RB.id As "RouteBatchID", RB.batch As "RouteBatchName", R.name As "Route", R.id As "RouteID",
      RUR."batchUseDate" FROM "BatchUseRecords" AS BUR
      INNER JOIN "RouteUseRecords" AS RUR ON BUR."batchRecordId" = RUR.id
      INNER JOIN "RouteBatches" AS RB ON RUR."batchId" = RB.id AND RB."homebaseId" = ${homebaseId}
      INNER JOIN "Routes" AS R ON RB."routeId" = R.id
      WHERE BUR.rating IS NOT NULL
      `;
      /* Wrapping date columns with "DATE" ensures that
      our query doesn't fail if time is not provided
      so date in format "2019-08-28T17:17:58.891Z" or
      "2019-08-28" works fine.
      Reference: https://tableplus.com/blog/2018/07
      /postgresql-how-to-extract-date-from-timestamp.html
      */
    const filterByDate = ` AND DATE(RUR."batchUseDate") >= '${from || previousMonthStart}'
    AND DATE(RUR."batchUseDate") <= '${to || previousMonthEnd}'`;
    query += filterByDate;
    const results = await database.query(query);
    return results;
  }
}

interface CreateRouteParam {
  name: string;
  imageUrl: string;
  destinationId: number;
}

interface BatchFilter {
  status: string;
}

export const routeService = new RouteService();
export default RouteService;
