import moment from 'moment';
import { each } from 'async';
import { MAX_INT as all } from '../helpers/constants';
import database from '../database';
import SequelizePaginationHelper from '../helpers/sequelizePaginationHelper';
import RemoveDataValues from '../helpers/removeDataValues';
import { batchUseRecordService } from '../modules/batchUseRecords/batchUseRecord.service';
import { homebaseInfo } from '../modules/routes/route.service';

const {
  models: {
    RouteUseRecord, RouteBatch, Cab, Route, Driver, Address, BatchUseRecord
  }
} = database;

const routeRecordInclude = {
  include: [{
    model: RouteBatch,
    as: 'batch',
    paranoid: false,
    where: {},
    include: [
      'riders',
      {
        model: Route,
        as: 'route',
        attributes: ['name', 'imageUrl'],
        include: [
          { model: Address, as: 'destination', attributes: ['address'] },
          { ...homebaseInfo }
        ]
      },
      {
        model: Cab,
        as: 'cabDetails',
        attributes: ['regNumber', 'model']
      },
      {
        model: Driver,
        as: 'driver',
        attributes: ['driverName', 'driverPhoneNo', 'driverNumber', 'email']
      }
    ],
  }]
};

class RouteUseRecordService {
  static get defaultPageable() {
    return {
      page: 1, size: all
    };
  }

  static async getByPk(id, withFks = false) {
    const filter = {
      include: withFks
        ? [{
          model: RouteBatch,
          as: 'batch',
          include: ['riders', 'route']
        }] : null
    };
    const record = await RouteUseRecord.findByPk(id, filter);
    return RemoveDataValues.removeDataValues(record);
  }

  static async create(batchId) {
    const date = moment.utc().toISOString();
    const result = await RouteUseRecord.create({
      batchId,
      batchUseDate: date,
    });
    return result.dataValues;
  }

  static async getAll(pageable = RouteUseRecordService.defaultPageable, where = null) {
    const { page, size } = pageable;
    let order;
    let filter;
    if (where) {
      filter = { where: { ...where } };
    }
    const paginatedRoutes = new SequelizePaginationHelper(RouteUseRecord, filter, size);
    paginatedRoutes.filter = {
      ...filter, subQuery: false, order, include: ['batch']
    };
    const { data, pageMeta } = await paginatedRoutes.getPageItems(page);
    return {
      data, ...pageMeta
    };
  }


  static async updateUsageStatistics(batchRecordId) {
    const { data } = await batchUseRecordService.getBatchUseRecord(undefined, { batchRecordId });
    let confirmedUsers = 0;
    let unConfirmedUsers = 0;
    let skippedUsers = 0;
    let pendingUsers = 0;
    data.map(async (userRecord) => {
      if (userRecord.userAttendStatus === 'Confirmed') {
        confirmedUsers += 1;
      }
      if (userRecord.userAttendStatus === 'Skip') {
        skippedUsers += 1;
      }
      if (userRecord.userAttendStatus === 'NotConfirmed') {
        unConfirmedUsers += 1;
      }
      if (userRecord.userAttendStatus === 'Pending') {
        pendingUsers += 1;
      }
      return '';
    });

    await RouteUseRecordService.updateRouteUseRecord(batchRecordId,
      {
        unConfirmedUsers, confirmedUsers, skippedUsers, pendingUsers
      });
  }

  static async updateRouteUseRecord(recordId, updateObject) {
    const result = await RouteUseRecord.update({ ...updateObject },
      {
        returning: true,
        where: { id: recordId }
      });
    return result;
  }

  static async getRouteTripRecords(pageable, homebaseId) {
    const { page, size } = pageable;
    const paginationConstraint = {
      offset: (page - 1) * size,
      limit: size
    };
    if (homebaseId) routeRecordInclude.include[0].where.homebaseId = homebaseId;
    const allRouteRecords = await RouteUseRecord.findAll({
      ...routeRecordInclude
    });

    const paginatedRouteRecords = await RouteUseRecord.findAll({
      ...paginationConstraint,
      ...routeRecordInclude
    });

    const paginationMeta = {
      totalPages: Math.ceil(allRouteRecords.length / size),
      pageNo: page,
      totalItems: allRouteRecords.length,
      itemsPerPage: size
    };
    return {
      data: RemoveDataValues.removeDataValues(paginatedRouteRecords),
      pageMeta: { ...paginationMeta }
    };
  }

  static getAdditionalInfo(routeTripsData) {
    return new Promise((resolve) => {
      let results = [];
      each(routeTripsData, async (record, callback) => {
        try {
          const editableRecord = { ...record };
          const data = await BatchUseRecord.findOne({
            where: { batchRecordId: editableRecord.batch.id }
          });

          const { rating } = data.get();
          
          const {
            confirmedUsers, unConfirmedUsers, skippedUsers, pendingUsers
          } = editableRecord;
        
          const totalUsers = confirmedUsers + unConfirmedUsers + skippedUsers + pendingUsers;
          const utilization = ((confirmedUsers / totalUsers) * 100).toFixed(0);

          editableRecord.utilization = utilization >= 0 ? utilization : '0';
          editableRecord.averageRating = rating;
          results = [...results, editableRecord];

          callback();
        } catch (error) {
          callback();
        }
      }, () => { if (results.length !== 0) { resolve(results); } else { resolve([]); } });
    });
  }
}

export default RouteUseRecordService;
