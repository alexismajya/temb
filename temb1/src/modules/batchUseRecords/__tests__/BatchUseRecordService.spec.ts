import database from '../../../database';
import { batchUseRecordService } from '../batchUseRecord.service';
import { MAX_INT as all } from '../../../helpers/constants';
import { routeData, data } from '../../../services/__mocks__';
import {
  data as rbData, route as rbRoute, rbUser,
} from '../../../helpers/__mocks__/BatchUseRecordMock';
import SequelizePaginationHelper from '../../../helpers/sequelizePaginationHelper';

const { models: { BatchUseRecord } } = database;

describe('batchUseRecordService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('createBatchUseRecord', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    it.only('should create createBatchUseRecord successfully', async () => {
      jest.spyOn(batchUseRecordService, 'getBatchUseRecord').mockResolvedValue({ data: [] });
      jest.spyOn(BatchUseRecord, 'create').mockResolvedValue({ get: () => ({ id: 1 }) });
      const result = await batchUseRecordService.createBatchUseRecord({ id: 1 }, [{ id: 1 }]);
      expect(result.id).toEqual(1);
    });

    it.only('should not create create Batch Use Record it aready exists for that day', async () => {
      jest.spyOn(batchUseRecordService, 'getBatchUseRecord').mockResolvedValue(
        { data: [{ userId: 1, batchRecordId: 2 }] },
      );
      jest.spyOn(BatchUseRecord, 'create').mockResolvedValue({ data: [] });
      await batchUseRecordService.createBatchUseRecord(1, [{}]);
      expect(BatchUseRecord.create).toBeCalledTimes(0);
    });
  });

  describe('getBatchUseRecord', () => {
    beforeEach(() => {
      const sequelizePaginationHelper = new SequelizePaginationHelper({}, {});
      jest.spyOn(sequelizePaginationHelper, 'getPageItems').mockResolvedValue({});
      jest.spyOn(batchUseRecordService, 'serializePaginatedData').mockReturnValue({
        data: [],
        pageMeta: {
          itemsPerPage: 1, totalPages: 1, pageNo: 1, totalItems: 1,
        },
      });
    });

    it.only('should get getBatchUseRecord', async () => {
      const { pageMeta: { itemsPerPage } } = await batchUseRecordService
        .getBatchUseRecord({ page: 1, size: all }, {});
      expect(itemsPerPage).toEqual(1);
    });

    it.only('should get all batchRecords', async () => {
      const { pageMeta: { itemsPerPage } } = await batchUseRecordService.getBatchUseRecord({}, {});
      expect(itemsPerPage).toEqual(1);
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });
  });
  describe('getUserRouteRecord', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });
    it.only('should get all route user record', async () => {
      const {
        userId, totalTrips, tripsTaken,
      } = await batchUseRecordService.getUserRouteRecord(1);
      expect({
        userId,
        totalTrips,
        tripsTaken,
      }).toEqual({
        userId: 1,
        totalTrips: 0,
        tripsTaken: 0,
      });
    });
  });

  describe('updateBatchUseRecord', () => {
    it.only('should updateBatchUseRecord', async () => {
      jest.spyOn(BatchUseRecord, 'update').mockResolvedValue([, [{
        get: () => ({}),
      }]]);
      await batchUseRecordService.updateBatchUseRecord(1, {});
      expect(BatchUseRecord.update).toBeCalled();
    });
  });

  describe('batchUseRecordService_serializeRouteBatch', () => {
    it.only('should return the required route info', () => {
      const response = batchUseRecordService.serializeRouteBatch(routeData);
      expect(response).toEqual(
        {
          batch: {
            batchId: 1001, comments: 'Went to the trip', status: 'Activ', takeOff: '09:50',
          },
          cabDetails: {
            cabId: 10,
            driverName: 'Kafuuma Henry',
            driverPhoneNo: 256772312456,
            regNumber: 'UBE321A',
          },
          departureDate: '2018-05-03 09:50',
          id: 1,
          route: {
            destination: {
              address: '629 O\'Connell Flats',
              locationId: 1002,
            },
            name: 'Hoeger Pine',
            routeId: 1001,
          },
          routeId: 1001,
        },
      );
    });
    it.only('should return empty object when there is no route', () => {
      const response = batchUseRecordService.serializeRouteBatch();
      expect(response).toEqual({});
    });
  });

  describe('batchUseRecordService_serializeBatchRecord', () => {
    it.only('should have all the properties a batch record', () => {
      const response = batchUseRecordService.serializeBatchRecord(data);

      expect(response).toHaveProperty('userId');
      expect(response).toHaveProperty('rating');
      expect(response).toHaveProperty('user.email');
      expect(response).toHaveProperty('user.slackId');
      expect(response).toHaveProperty('routeUseRecord');
    });
  });
  describe('batchUseRecordService_getRoutesUsage', () => {
    it.only('should fetch all routes and batch records', async () => {
      const mockData: any[] = [];
      const from = '2019-10-29';
      const to = '2019-10-30';
      const res = await batchUseRecordService.getRoutesUsage(from, to);
      expect(res.rows).toEqual(mockData);
      expect(res.rowCount).toEqual(0);
    });
  });
});

describe('BatchUseRecordHelper', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('BatchUseRecordHelper.serializePaginatedData', () => {
    it.only('BatchUseRecordHelper.serializePaginatedData', () => {
      const paginatedData = { data: [{
        data: rbData, route: rbRoute, user: rbUser }], pageMeta: {} };
      const serializedData = batchUseRecordService.serializePaginatedData(paginatedData);
      expect(serializedData).toEqual({
        data: [
          {
            user: {
              name: 'jamal',
            },
            routeUseRecord: {},
          },
        ],
        pageMeta: {},
      });
    });
  });
});
