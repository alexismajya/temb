import UserService from '../../users/user.service';
import FellowController from '../FellowsController';
import { batchUseRecordService } from '../../batchUseRecords/batchUseRecord.service';
import aisService from '../../../services/AISService';
import {
  data,
  fellowMockData,
  fellows,
  userMock,
  aisMock,
  finalUserDataMock,
  fellowMockData2
} from '../__mocks__/FellowsControllerMock';
import bugsnagHelper from '../../../helpers/bugsnagHelper';

describe('FellowsController', () => {
  let req = {
    query: {
      size: 2,
      page: 1
    },
    headers: { homebaseid: 1 }
  };
  let res;

  beforeEach(() => {
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  describe('getAllFellows', () => {
    it('should throw an error', async () => {
      req = {
        ...req,
        query: {
          size: 'meshack'
        }
      };
      jest.spyOn(UserService, 'getPagedFellowsOnOrOffRoute')
        .mockRejectedValue(new Error('no size'));
      const spy = jest.spyOn(bugsnagHelper, 'log').mockImplementation(jest.fn());
      await FellowController.getAllFellows(req, res);

      expect(spy).toBeCalledWith(new Error('no size'));
    });

    it('returns empty data response if no fellows', async () => {
      jest.spyOn(UserService, 'getPagedFellowsOnOrOffRoute').mockResolvedValue(fellows);

      await FellowController.getAllFellows(req, res);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Request was successful',
        data: {
          fellows: [],
          pageMeta: fellows.pageMeta
        }
      });
    });

    it('returns data if fellows on route', async () => {
      jest.spyOn(FellowController, 'mergeFellowData').mockResolvedValue(finalUserDataMock);
      jest.spyOn(UserService, 'getPagedFellowsOnOrOffRoute').mockResolvedValue(fellowMockData);

      await FellowController.getAllFellows(req, res);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Request was successful',
        data: {
          fellows: [finalUserDataMock],
          pageMeta: {
            currentPage: 1,
            limit: 1,
            totalItems: 5,
            totalPages: 5,
          }
        }
      });
    });

    it('returns data of fellows not on route', async () => {
      jest.spyOn(FellowController, 'mergeFellowData').mockResolvedValue(finalUserDataMock);
      jest.spyOn(UserService, 'getPagedFellowsOnOrOffRoute').mockResolvedValue(fellowMockData2);

      await FellowController.getAllFellows(req, res);
      expect(res.json).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
      jest.restoreAllMocks();
      jest.resetAllMocks();
    });
  });

  describe('mergeFellowData', () => {
    it('Returns merged fellows data ', async () => {
      jest.spyOn(batchUseRecordService, 'getUserRouteRecord').mockResolvedValue(userMock);
      jest.spyOn(aisService, 'getUserDetails').mockResolvedValue(aisMock);

      const result = await FellowController.mergeFellowData(req, res);
      expect(result).toEqual(finalUserDataMock);
    });
  });

  describe('FellowsController_getFellowRouteActivity', () => {
    let mockedData;
    beforeEach(() => {
      req = {
        ...req,
        query: {
          page: 1,
          size: 2,
          id: 15
        }
      };
      mockedData = {
        data,
        pageMeta: {
          totalPages: 1,
          pageNo: 1,
          totalItems: 7,
          itemsPerPage: 5
        }
      };
      jest.spyOn(batchUseRecordService, 'getBatchUseRecord').mockResolvedValue(
        mockedData
      );
    });

    it('should return an array of fellow route activity', async () => {
      await FellowController.getFellowRouteActivity(req, res);

      expect(batchUseRecordService.getBatchUseRecord).toHaveBeenCalled();
      expect(batchUseRecordService.getBatchUseRecord).toHaveBeenCalledWith({
        page: 1,
        size: 2
      }, { userId: 15, homebaseId: 1 });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.status().json).toHaveBeenCalledTimes(1);
    });

    it('should throw an error', async () => {
      jest.spyOn(batchUseRecordService, 'getBatchUseRecord').mockRejectedValue(
        new Error('dummy error')
      );

      await FellowController.getFellowRouteActivity(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.status().json).toHaveBeenCalledWith({
        message: 'dummy error',
        success: false
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
      jest.resetAllMocks();
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
});
