import RouteUseRecordService from '../RouteUseRecordService';
import database from '../../database';
import { batchUseRecordService } from '../../modules/batchUseRecords/batchUseRecord.service';
import { MAX_INT as all } from '../../helpers/constants';
import { mockRecord } from '../__mocks__';


const { models: { RouteUseRecord } } = database;

describe('RouteUseRecordService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe('createRouteUseRecord', () => {
    it('should create create successfully', async () => {
      jest.spyOn(RouteUseRecord, 'create').mockResolvedValue({ data: [] });
      await RouteUseRecordService.create(1);
      expect(RouteUseRecord.create).toHaveBeenCalled();
    });
  });

  describe('getRouteUseRecords', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });
    it('should get getAll', async () => {
      const { itemsPerPage } = await RouteUseRecordService.getAll({ page: 1, size: all }, {});
      expect(itemsPerPage).toEqual(4294967295);
    });

    it('should get getAll', async () => {
      const { itemsPerPage } = await RouteUseRecordService.getAll();
      expect(itemsPerPage).toEqual(4294967295);
    });
  });
  describe('updateRouteUseRecord', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    it('should updateRouteUseRecord', async () => {
      jest.spyOn(RouteUseRecord, 'update').mockResolvedValue();
      await RouteUseRecordService.updateRouteUseRecord(1, {});
      expect(RouteUseRecord.update).toBeCalledWith(
        { ...{} }, { returning: true, where: { id: 1 } }
      );
    });
  });

  describe('updateUsageStatistics', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    it('should updateUsageStatistics', async () => {
      jest.spyOn(batchUseRecordService, 'getBatchUseRecord')
        .mockResolvedValue({
          data: [{
            userAttendStatus: 'Confirmed'
          }, {
            userAttendStatus: 'Skip'
          }, {
            userAttendStatus: 'NotConfirmed'
          }, {
            userAttendStatus: 'Pending'
          },
          ]
        });
      jest.spyOn(RouteUseRecordService, 'updateRouteUseRecord').mockResolvedValue();
      await RouteUseRecordService.updateUsageStatistics(1);
      expect(RouteUseRecordService.updateRouteUseRecord).toBeCalledTimes(1);
      expect(RouteUseRecordService.updateRouteUseRecord).toBeCalled();
      expect(await RouteUseRecordService.updateRouteUseRecord).toBeCalledWith(1, {
        confirmedUsers: 1, pendingUsers: 1, skippedUsers: 1, unConfirmedUsers: 1
      });
    });
  });

  describe('getAdditionalInfo', () => {
    it('should return an empty array when there is no trips', async () => {
      const routeTrips = await RouteUseRecordService.getAdditionalInfo(mockRecord);
      expect(routeTrips).toEqual([]);
    });
  });

  it('should get average ratings and utilization for data', async () => {
    jest.spyOn(RouteUseRecordService, 'getAdditionalInfo')
      .mockResolvedValue([{ utilization: '0', averageRating: '4.00' }]);
    
    const routeTrips = await RouteUseRecordService.getAdditionalInfo(mockRecord);
    
    
    expect(routeTrips[0].utilization).toEqual('0');
    expect(routeTrips[0].averageRating).toEqual('4.00');
  });
});
