import { mockUserTrip1, mockUserRoute, mockUserRoute2 } from '../__mocks__/weeklyReportMock';
import weeklyReportGenerator from '../weeklyReportGenerator';
import Utils from '../../../utils';

describe('WeeklyReportGenerator', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('generateEmailData', () => {
    it('should generate trips information of user', async () => {
      jest.spyOn(weeklyReportGenerator, 'generateTotalByTripType').mockResolvedValue({});
      jest.spyOn(weeklyReportGenerator, 'generateRouteInfo').mockResolvedValue({});
      weeklyReportGenerator.generateEmailData([mockUserTrip1], [mockUserRoute, mockUserRoute2]);
      expect(weeklyReportGenerator.generateTotalByTripType).toHaveBeenCalled();
      expect(weeklyReportGenerator.generateRouteInfo).toHaveBeenCalled();
    });
  });

  describe('generateTotalByTripType', () => {
    it('should return object with trips information', async () => {
      const expected = {
        airportTransfer: 1,
        date: Utils.getLastWeekStartDate('LL'),
        name: 'name',
        embassyVisit: 1,
        regularTrip: 1,
        routeTrip: 0,
        total: 3,
      };
      const response = weeklyReportGenerator.generateTotalByTripType(mockUserTrip1);
      expect(response).toEqual(expected);
    });
  });

  describe('generateRouteInfo', () => {
    it('should return object with trips information', async () => {
      const expected = {
        date: Utils.getLastWeekStartDate('LL'),
        embassyVisit: 0,
        regularTrip: 0,
        airportTransfer: 0,
        name: 'name',
        routeTrip: 1,
        total: 1,
      };
      const response = weeklyReportGenerator.generateRouteInfo(mockUserRoute);
      expect(response).toEqual(expected);
    });
  });
});
