import { MAX_INT as all } from '../../helpers/constants';
import database, { BatchUseRecord } from '../../database';
import bugsnagHelper from '../../helpers/bugsnagHelper';
import { BaseService } from '../shared/base.service';

const {
  models: {
    RouteUseRecord, RouteBatch, Route, User,
  },
} = database;
const batchDefaultInclude = {
  model: RouteUseRecord,
  as: 'batchRecord',
  include: [{
    model: RouteBatch,
    as: 'batch',
    include: ['cabDetails', {
      model: Route, as: 'route', include: ['destination'],
    }],
  }],
};

class BatchUseRecordService extends BaseService <BatchUseRecord, number> {
  constructor(model = database.getRepository(BatchUseRecord)) {
    super(model);
    this.serializePaginatedData = this.serializePaginatedData.bind(this);
    this.serializeRouteBatch = this.serializeRouteBatch.bind(this);
  }
  async getRoutesUsage(from: string, to: string) {
    const query = `SELECT * FROM "RouteUseRecords" as routeuse_record,
    "RouteBatches" as batches, "Routes" as routes
    WHERE routeuse_record."batchId"=batches.id AND routes.id=batches."routeId"
    AND routeuse_record."batchUseDate">='${from}' AND routeuse_record."createdAt"<='${to}'`;
    const results = await database.query(query);
    return results[1];
  }

  get defaultPageable() {
    return { page: 1, size: all };
  }

  async createSingleRecord(data: {
    userId: number,
    batchRecordId: number,
    userAttendStatus: string,
  }) {
    const batchUseRecord = await this.model.create(data);
    return batchUseRecord.get();
  }

  async createBatchUseRecord(batchRecord: { id: number }, users: { id: number }[]) {
    try {
      const [result] = await Promise.all(users.map(async (user) => {
        const { data: existingUser } = await this.getBatchUseRecord(
          undefined,
          { userId: user.id, batchRecordId: batchRecord.id },
        );
        if (existingUser.length > 0) return true;
        const batchUseRecord = await this.model.create({
          userId: user.id,
          batchRecordId: batchRecord.id,
        });
        return batchUseRecord.get();
      }));
      return result;
    } catch (e) {
      bugsnagHelper.log(e);
    }
  }

  async getBatchUseRecord(pageable = this.defaultPageable,
    where: { homebaseId?: number, userId?: number, batchRecordId?: number } = {}) {
    const { page, size } = pageable;
    let filter;
    const criteria = { ...where };
    delete criteria.homebaseId;
    if (where) { filter = { where: { ...criteria } }; }
    const { data, pageMeta: {
      totalPages, limit, count, page: returnedPage,
    } } = await this.getPaginated({
      page,
      limit: size,
      defaultOptions: {
        ...filter,
        order: [['id', 'ASC']],
        include: [
          {
            model: User,
            as: 'user',
            where: where && where.homebaseId ? { homebaseId: where.homebaseId } : {},
          }, batchDefaultInclude],
      },
    });

    return this.serializePaginatedData({
      data,
      pageMeta: { totalPages, pageNo: returnedPage, totalItems: count, itemsPerPage: limit },
    });
  }

  async getUserRouteRecord(id: number) {
    const totalTrips = await this.model.count({
      where: {
        userId: id,
      },
    });
    const tripsTaken = await this.model.count({
      where: {
        userId: id, userAttendStatus: 'Confirmed',
      },
    });
    return { totalTrips, tripsTaken, userId: id };
  }

  async updateBatchUseRecord(recordId: number, updateObject: {
    userId?: number, userAttendStatus?: string, batchRecordId?: number,
    reasonForSkip?: string, rating?: number,
  }) { return await this.update(recordId, updateObject, { returning: true }); }

  serializeRouteBatch(batchRecord: any) {
    if (!batchRecord) return {};
    const {
        id, batchUseDate, batch: {
          id: batchId, takeOff, status, comments, routeId, cabId, cabDetails: {
            driverName, driverPhoneNo, regNumber,
          },
          route: {
            name, destination: { locationId, address },
          },
        },
      } = batchRecord;
    return {
      id,
      routeId,
      departureDate: `${batchUseDate} ${takeOff}`,
      batch: {
        batchId, takeOff, status, comments,
      },
      cabDetails: {
        cabId, driverName, driverPhoneNo, regNumber,
      },
      route: {
        routeId, name, destination: { locationId, address },
      },
    };
  }

  serializeBatchRecord = (batchData: BatchUseRecord) => {
    const {
        id, userId, batchRecordId, userAttendStatus, reasonForSkip, rating, createdAt, updatedAt,
          user : {
            name, slackId, email, routeBatchId,
          },
      } = batchData;
    return {
      id,
      userId,
      batchRecordId,
      userAttendStatus,
      reasonForSkip,
      rating,
      createdAt,
      updatedAt,
      user: { name, slackId, email, routeBatchId, id: userId },
      routeUseRecord: { ...this.serializeRouteBatch(batchData.batchRecord) },
    };
  }

  serializePaginatedData(paginatedData: { data: BatchUseRecord[], pageMeta: {
    totalPages: number, pageNo: number, totalItems: number, itemsPerPage: number }}) {
    const newData = { ...paginatedData };
    const { data, pageMeta } = newData;
    const result = data.map(this.serializeBatchRecord);
    // @ts-ignore
    newData.data = result;
    newData.pageMeta = pageMeta;
    return newData;
  }
}

export const batchUseRecordService = new BatchUseRecordService();

export default batchUseRecordService;
