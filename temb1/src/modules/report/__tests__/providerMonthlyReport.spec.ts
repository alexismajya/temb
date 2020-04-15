import { homebaseProviders } from '../__mocks__/providerMonthlyReportMock';
import providerReportGenerator, { CommChannel } from '../providerMonthlyReport';
import { homebaseService } from '../../../modules/homebases/homebase.service';
import { finalData2, finalData1 } from '../../../helpers/email/__mocks__/providerReportMock';

describe('Provider Monthly Report', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('generateData', () => {
    it('should generate data for email', async () => {
      jest.spyOn(homebaseService, 'getMonthlyCompletedTrips').mockResolvedValue(homebaseProviders);
      const result = await providerReportGenerator.generateData(CommChannel.email);
      expect(homebaseService.getMonthlyCompletedTrips).toHaveBeenCalled();
      expect(result).toEqual({ ...finalData2, ...finalData1 });
    });

    it('should generate data to be sent to slack', async () => {
      jest.spyOn(homebaseService, 'getMonthlyCompletedTrips').mockResolvedValue(homebaseProviders);
      await providerReportGenerator.generateData(CommChannel.slack);
      expect(homebaseService.getMonthlyCompletedTrips).toHaveBeenCalled();
    });
  });
});
