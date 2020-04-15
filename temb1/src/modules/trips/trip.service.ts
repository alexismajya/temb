import moment from 'moment';
import sequelize, { Op, ProjectionAlias } from 'sequelize';
import database, { TripRequest, Department, Provider, Homebase, Address } from '../../database';
import { TripRequestViewModel } from '../../database/viewmodels/trip-request.viewmodel';
import WhereClauseHelper from '../../helpers/WhereClauseHelper';
import { BaseService } from '../shared/base.service';
import SlackPagination from '../../helpers/slack/SlackPaginationHelper';
import HttpError from '../../helpers/errorHandler';
import { teamDetailsService } from '../teamDetails/teamDetails.service';
import DriverNotifications from
  '../slack/SlackPrompts/notifications/DriverNotifications/driver.notifications';
import TripJobs from '../../services/jobScheduler/jobs/TripJobs';
import SendNotifications from '../slack/SlackPrompts/Notifications';

export interface ICabDriverUpdateOptions {
  tripId: number;
  teamId: string;
  updateData: {
    driverId?: number;
    cabId?: number;
    providerId?: number;
    confirmationComment?: string;
  };
}

interface IPageable {
  page: number;
  size: number;
}

export class TripService extends BaseService<TripRequest, number> {
  defaultInclude: any[];

  constructor(model = database.getRepository(TripRequest)) {
    super(model);

    this.defaultInclude = [
      { model: Provider, include: ['user'], raw: true },
      { model: Homebase, include: ['country'], raw: true },
      { model: Department, include: ['head'] },
      'cab', 'driver', 'requester', 'origin', 'destination', 'rider', 'approver', 'confirmer',
      'decliner', 'tripDetail',
    ];
  }

  sequelizeWhereClauseOption(filterParams: any) {
    const {
      departureTime, requestedOn, currentDay,
      status: tripStatus, department: departmentName,
      type: tripType,
      noCab,
      searchterm: searchTerm,
    } = filterParams;
    let where = {};

    if (tripStatus) where = { tripStatus };
    if (departmentName) where = { ...where, departmentName };
    if (tripType) where = { ...where, tripType };
    where = WhereClauseHelper.getNoCabWhereClause(Boolean(noCab), where);

    if (currentDay) {
      where = {
        ...where,
        departureTime: {
          [Op.gte]:
            moment(moment(), 'YYYY-MM-DD').toDate(),
        },
      };
    }
    let dateFilters = this.getDateFilters('departureTime', departureTime || {});
    where = { ...where, ...dateFilters };
    dateFilters = this.getDateFilters('createdAt', requestedOn || {});
    where = { ...where, ...dateFilters };
    if (searchTerm) {
      where = {
        ...where,
        [Op.or]: [
          { '$requester.name$': { [Op.iLike]: { [Op.any]: [`%${searchTerm}%`] } } },
          { '$rider.name$': { [Op.iLike]: { [Op.any]: [`%${searchTerm}%`] } } },
          { '$origin.address$': { [Op.iLike]: { [Op.any]: [`%${searchTerm}%`] } } },
          { '$destination.address$': { [Op.iLike]: { [Op.any]: [`%${searchTerm}%`] } } },
        ],
      };
    }
    return where;
  }

  async getPaginatedTrips(filters: any, pageNo: number,
    limit = SlackPagination.getSlackPageSize()) {
    const filter = { ...filters, include: this.defaultInclude };
    const trips = await this.getPaginated({ limit, defaultOptions: filter, page: pageNo });
    return trips;
  }

  async getTrips(pageable: IPageable, where: any, homebaseId: number) {
    const { page, size: limit } = pageable;
    if (homebaseId) where.homebaseId = homebaseId;
    const defaultOptions = this.createFilter({ ...where });
    const { data: trips, pageMeta } = await this.getPaginated({ page, limit, defaultOptions });
    return { trips, ...pageMeta };
  }

  createFilter(where: any, defaultInclude = this.defaultInclude) {
    const { departmentName: name } = where;
    let include = [...defaultInclude];
    const destination = {
      model: Address,
      as: 'destination',
      attributes: ['address'],
    };
    include.push(destination);
    if (name && this.defaultInclude.indexOf('department') > -1) {
      include.splice(include.indexOf('department'), 1);
      const department = {
        model: Department,
        as: 'department',
        where: { name },
        attributes: ['name'],
      };
      include = [...include, department];
    }
    const { departmentName: _, ...rest } = where;
    return {
      include,
      where: rest,
    };
  }

  serializeTripRequest(trip: TripRequest) {
    return new TripRequestViewModel(trip);
  }

  getDateFilters(field: string, data: any) {
    const { after, before } = data;
    const both = after && before;
    let from;
    let to;
    let condition;
    if (after) {
      from = { [Op.gte]: moment(after, 'YYYY-MM-DD').toDate() };
      condition = from;
    }
    if (before) {
      to = { [Op.lte]: moment(before, 'YYYY-MM-DD').toDate() };
      condition = to;
    }
    if (both) {
      condition = { [Op.and]: [from, to] };
    }
    if (!after && !before) return {};
    return {
      [field]: condition,
    };
  }

  async checkExistence(id: number) {
    const count = await this.model.count({ where: { id } });
    if (count > 0) {
      return true;
    }
    return false;
  }

  async getById(pk: number, withFk = false) {
    try {
      const trip = await this.findById(pk, withFk ? this.defaultInclude : []);
      return trip;
    } catch (error) {
      throw new Error('Could not return the requested trip');
    }
  }

  async getAll(
    params = { where: {} },
    order: any = { order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']] },
  ) {
    const trips = await this.findAll({
      where: params.where,
      include: [...this.defaultInclude],
      order: [...order.order],
    });
    return trips;
  }

  async updateRequest(tripId: number, updateObject: any) {
    try {
      await this.update(tripId, updateObject);
      const result = await this.getById(tripId, true);
      return result;
    } catch (error) {
      HttpError.throwErrorIfNull(null, 'Error updating trip request', 500);
    }
  }

  async completeCabAndDriverAssignment({ tripId, updateData, teamId }: ICabDriverUpdateOptions) {
    const trip = await this.update(tripId, updateData, {
      returning: true,
      include: tripService.defaultInclude,
    });
    const botToken = await teamDetailsService.getTeamDetailsBotOauthToken(teamId);
    SendNotifications.sendUserConfirmOrDeclineNotification(teamId,
      trip.requester.slackId, trip, false);
    DriverNotifications.checkAndNotifyDriver(updateData.driverId, teamId, trip);
    TripJobs.scheduleTakeOffReminder({ botToken, data: trip });
    return trip;
  }

  async createRequest(requestObject: any) {
    const trip = await this.add(requestObject);
    return trip;
  }

  async getCompletedTravelTrips(
    startDate: string,
    endDate: string,
    departmentList: string[],
    homeBaseToFilter: number) {
    let where = {};
    if (departmentList && departmentList.length) where = { name: { [Op.in]: [...departmentList] } };
    where = {
      homebaseId: homeBaseToFilter,
      tripStatus: 'Completed',
      [Op.or]: [{ tripType: 'Embassy Visit' }, { tripType: 'Airport Transfer' }],
      createdAt: { [Op.between]: [startDate, endDate] },
    };
    const include = [{
      model: Department,
      as: 'department',
      required: true,
    }];
    const options = {
      where, include, attributes: [
        'departmentId',
        [sequelize.literal('department.name'), 'departmentName'],
        [sequelize.fn('avg', sequelize.col('rating')), 'averageRating'],
        [sequelize.fn('count', sequelize.col('departmentId')), 'totalTrips'],
        [sequelize.fn('sum', sequelize.col('cost')), 'totalCost'],
      ] as (string | ProjectionAlias)[],
      group: ['department.id', 'TripRequest.departmentId'],
    };
    return await this.model.findAll(options);
  }
}

const tripService = new TripService();
export default tripService;
