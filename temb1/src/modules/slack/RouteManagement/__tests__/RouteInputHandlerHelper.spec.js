import RouteInputHandlerHelper from '../RouteInputHandlerHelper';
import Cache from '../../../shared/cache';
import { partnerService } from '../../../partners/partner.service';
import { engagementService } from '../../../engagements/engagement.service';
import SlackHelpers from '../../../../helpers/slack/slackHelpers';
import { addressService } from '../../../addresses/address.service';
import dummyMockData from './dummyMockData';
import RouteRequestService from '../../../routes/route-request.service';
import GoogleMapsDistanceMatrix from '../../../../services/googleMaps/GoogleMapsDistanceMatrix';
import GoogleMapsStatic from '../../../../services/googleMaps/GoogleMapsStatic';
import { RoutesHelper } from '../../../../helpers/googleMaps/googleMapsHelpers';


describe('RouteInputHandlerHelper', () => {
  describe('RouteInputHandlerHelper_saveRouteRequestDependencies', () => {
    beforeEach(() => {
      const {
        destinationInfo, depData: {
          engagement, manager, fellowBusStop, fellowHomeAddress
        }
      } = dummyMockData;
      jest.spyOn(Cache, 'fetch').mockResolvedValueOnce(destinationInfo);
      jest.spyOn(partnerService, 'findOrCreatePartner').mockResolvedValue([]);
      jest.spyOn(engagementService, 'findOrCreateEngagement').mockResolvedValue(engagement);
      jest.spyOn(SlackHelpers, 'findOrCreateUserBySlackId').mockResolvedValue(manager);
      jest.spyOn(addressService, 'createNewAddress')
        .mockResolvedValue({ ...fellowBusStop, ...fellowHomeAddress });
    });

    it('Should save route and engagement information to database', async () => {
      const {
        partnerInfo: {
          userId, teamId, managerSlackId, partnerName, workingHours
        }
      } = dummyMockData;
      const submissionValues = {
        submission: { manager: managerSlackId, nameOfPartner: partnerName, workingHours }
      };
      jest.spyOn(Cache, 'fetch').mockResolvedValueOnce(['12/01/2018', '12/12/2020', 'Safaricom']);
      await RouteInputHandlerHelper.saveRouteRequestDependencies(userId, teamId, submissionValues);
      expect(engagementService.findOrCreateEngagement).toBeCalled();
      expect(partnerService.findOrCreatePartner).toBeCalled();
    });
    it('Should return an object with the user Info', async () => {
      jest.spyOn(Cache, 'fetch').mockResolvedValueOnce(['12/01/2018', '12/12/2020', 'Safaricom']);
      const {
        partnerInfo: {
          userId, teamId, managerSlackId, partnerName, workingHours
        }, depData,
      } = dummyMockData;
      const submissionValues = {
        submission: { manager: managerSlackId, nameOfPartner: partnerName, workingHours }
      };
      const res = await RouteInputHandlerHelper.saveRouteRequestDependencies(
        userId, teamId, submissionValues
      );
      expect(res).toEqual(depData);
    });
  });

  describe('RouteInputHandlerHelper_resolveRouteRequestDBData', () => {
    it('should ', async () => {
      const { locationInfo, depData } = dummyMockData;
      const res = await RouteInputHandlerHelper.resolveRouteRequestDBData(locationInfo, depData);
      expect(res).toEqual({
        engagementId: '1233',
        managerId: '1233',
        homeId: '1233',
        busStopId: '1233',
        routeImageUrl: 'http://dummymapurl.com/700*730, 36.886215',
        distance: 2,
        busStopDistance: 2
      });
    });
  });

  describe('RouteInputHandlerHelper_handleRouteRequestSubmission', () => {
    const { partnerInfo: { userId, teamId }, locationInfo } = dummyMockData;
    beforeEach(() => {
      jest.spyOn(Cache, 'fetch').mockResolvedValue({ locationInfo });
      jest.spyOn(RouteRequestService, 'createRoute').mockResolvedValue([]);
      jest.spyOn(RouteInputHandlerHelper, 'saveRouteRequestDependencies').mockResolvedValue([]);
      jest.spyOn(RouteInputHandlerHelper, 'resolveRouteRequestDBData').mockResolvedValue([]);
    });
    it('should submit request info', async () => {
      const payload = {
        user: { id: userId },
        team: { id: teamId },
        actions: [{ value: '{"result":1}' }]
      };
      await RouteInputHandlerHelper.handleRouteRequestSubmission(payload);
      expect(RouteRequestService.createRoute).toBeCalled();
    });
  });

  describe('RouteInputHandlerHelper_calculateDistance', () => {
    beforeEach(() => {
      jest.spyOn(GoogleMapsDistanceMatrix, 'calculateDistance').mockResolvedValue([]);
      jest.spyOn(RouteInputHandlerHelper, 'validateDistance').mockResolvedValue([]);
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });
    it('should return the calculated distance', async () => {
      const { destinationInfo: { busStop, homeAddress } } = dummyMockData;
      const theDojo = { location: { latitude: '-29923', longitude: '8539' } };
      await RouteInputHandlerHelper.calculateDistance(busStop, homeAddress, theDojo);
      expect(RouteInputHandlerHelper.validateDistance).toBeCalled();
    });
  });

  describe('RouteInputHandlerHelper_validateDistance', () => {
    it('should throw an error when distance is not valid', async () => {
      const res = RouteInputHandlerHelper.validateDistance();
      const expectedRes = {
        errors: [
          {
            error: 'Unable to calculate distance', name: 'selectBusStop'
          }
        ]
      };
      expect(res).toEqual(expectedRes);
    });
    it('should check if distance is less than 2km', async () => {
      const res = RouteInputHandlerHelper.validateDistance({
        distanceInMetres: 2001
      });
      const expectedRes = {
        errors: [
          {
            error: 'Selected bus stop is more than 2km from home', name: 'selectBusStop'
          }
        ]
      };
      expect(res).toEqual(expectedRes);
    });
    it('should return an empty', () => {
      const res = RouteInputHandlerHelper.validateDistance('test');
      expect(res).toBeFalsy();
    });
  });
  describe('RouteInputHandlerHelper_convertStringToUrl', () => {
    it('should convert a string to Url', () => {
      const { locationInfo: { staticMapUrl } } = dummyMockData;
      const result = RouteInputHandlerHelper.convertStringToUrl(staticMapUrl);
      expect(result).toContain('%20');
    });
    it('should remove any space in the Url ', () => {
      const { locationInfo: { staticMapUrl } } = dummyMockData;
      const result = RouteInputHandlerHelper.convertStringToUrl(staticMapUrl);
      expect(result).not.toContain(' ');
    });
  });
  describe('RouteInputHandlerHelper_getLocationDetailsFromCache', () => {
    const { cacheData } = dummyMockData;
    beforeEach(() => {
      jest.spyOn(Cache, 'fetch').mockResolvedValue({ busStop: [...cacheData] });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should fetch value from cache', async () => {
      const payload = { user: { id: 2 } };
      await RouteInputHandlerHelper.getLocationDetailsFromCache(
        payload, 'busStop', '-1.2329135,36.893683'
      );
      expect(Cache.fetch).toBeCalled();
    });

    it('should return an object value ', async () => {
      const payload = { user: { id: 2 } };
      const result = await RouteInputHandlerHelper.getLocationDetailsFromCache(
        payload, 'busStop', '-1.2329135,36.893683'
      );
      const mockedResult = {
        address: 'Bus and Matatu Park', latitude: '-1.2329135', longitude: '36.893683'
      };
      expect(result).toEqual(mockedResult);
    });

    it('should return null when it cannot find matching coordinate', async () => {
      const payload = { user: { id: 1 } };
      const coordinate = '-1.2329135, 6.893683';
      const result = await RouteInputHandlerHelper.getLocationDetailsFromCache(
        payload, 'busStop', coordinate
      );
      expect(result).toEqual(null);
    });
    it('should always return ', async () => {
      jest.spyOn(Cache, 'fetch').mockResolvedValue({});
      const payload = { user: { id: 1 } };
      const result = await RouteInputHandlerHelper.getLocationDetailsFromCache(
        payload, 'busStop'
      );
      expect(result).toBeFalsy();
    });
  });

  describe('RouteInputHandlerHelper_getLongLat', () => {
    it('should return out longitude and latitude from coordinate as an object', () => {
      const mockCoordinate = '-1.2329135,36.893683';
      const result = RouteInputHandlerHelper.getLongLat(mockCoordinate);
      expect(result).toEqual({ latitude: '-1.2329135', longitude: '36.893683' });
    });
  });
  describe('RouteInputHandlerHelper_savePreviewDataToCache', () => {
    beforeEach(() => {
      jest.spyOn(Cache, 'save').mockResolvedValue();
    });

    it('Populate cache with data', async () => {
      const {
        locationInfo: { staticMapUrl, homeToDropOffDistance, dojoToDropOffDistance },
        destinationInfo: { busStop: savedBusStop, homeAddress: savedHomeAddress, }
      } = dummyMockData;
      const previewData = {
        staticMapUrl, homeToDropOffDistance, dojoToDropOffDistance, savedBusStop, savedHomeAddress
      };
      const key = 1;
      await RouteInputHandlerHelper.savePreviewDataToCache(key, previewData);
      expect(Cache.save).toBeCalled();
    });
  });
  describe('RouteInputHandlerHelper_resolveDestinationPreviewData', () => {
    const {
      cacheData, locationInfo: { staticMapUrl }, destinationInfo: { busStop: coordinate }
    } = dummyMockData;
    beforeEach(() => {
      jest.spyOn(RouteInputHandlerHelper, 'getLocationDetailsFromCache')
        .mockResolvedValue(cacheData);
      jest.spyOn(GoogleMapsStatic, 'getPathFromDojoToDropOff').mockResolvedValue(staticMapUrl);
      jest.spyOn(RoutesHelper, 'getDojoCoordinateFromDb').mockResolvedValue(coordinate);
      jest.spyOn(RouteInputHandlerHelper, 'calculateDistance').mockResolvedValue(coordinate);
      jest.spyOn(RouteInputHandlerHelper, 'convertStringToUrl').mockResolvedValue(coordinate);
    });
    it('it should return destination url', async () => {
      const payload = { submission: { otherBusStop: null } };
      await RouteInputHandlerHelper.resolveDestinationPreviewData(payload, coordinate);
      expect(RouteInputHandlerHelper.convertStringToUrl).toBeCalled();
    });
    it('it should return the calculated distance', async () => {
      const payload = { submission: { otherBusStop: null } };
      await RouteInputHandlerHelper.resolveDestinationPreviewData(payload, coordinate);
      expect(RouteInputHandlerHelper.calculateDistance).toBeCalled();
    });
  });

  describe('use Google Plus code when location is not listed', () => {
    const { busStop } = dummyMockData;
    beforeEach(() => {
      jest.spyOn(Cache, ('fetch')).mockResolvedValue(busStop);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
    it('Should return the input dropoff location from cache', async () => {
      const payload = { user: { id: 2 }, submission: { otherBusStop: 'PVM5+HR Nairobi, Kenya' } };
      await RouteInputHandlerHelper.getLocation(
        payload, 'dropOffAddress', '-1.2329135,36.893683'
      );
      expect(Cache.fetch).toHaveBeenCalled();
    });
  });
});

describe('checkIfAddressExistOnDatabase', () => {
  const databaseMockResult = [{
    address: 'Andela Nairobi',
    get: () => ({
      location: {
        latitude: '1.2356',
        longitude: '-0.8966'
      }
    })
  },
  {
    address: 'Nairobi, Nairobi kenya',
    get: () => ({
      location: {
        latitude: '1.2556',
        longitude: '-0.8866'
      }
    })
  }];
  it('Should return true if route exist', async () => {
    jest.spyOn(addressService, 'findAddressIfExists').mockResolvedValue(databaseMockResult);
    jest.spyOn(Cache, 'save');
    const respond = jest.fn();
    const payload = { user: { id: 1 } };
    const result = await RouteInputHandlerHelper
      .checkIfAddressExistOnDatabase(payload, respond, 'Nairobi');
    expect(result).toBe(true);
  });

  it("Should return false if route doesn't exist", async (done) => {
    jest.spyOn(addressService, 'findAddressIfExists').mockResolvedValue([]);
    jest.spyOn(Cache, 'save');
    const respond = jest.fn();
    const payload = { user: { id: 1 } };
    const result = await RouteInputHandlerHelper
      .checkIfAddressExistOnDatabase(payload, respond, 'Nairobi');
    expect(result).toBe(false);
    done();
  });
});


describe('cacheLocationAddress', () => {
  it('should cache address', async (done) => {
    const payload = {
      user: {
        id: 2
      },
      actions: [{
        selected_options: [{
          value: JSON.stringify({ address: 'Andela Nairobi', value: '1.2345,-0.8999' })
        }]
      }]
    };
    jest.spyOn(Cache, 'save');
    await RouteInputHandlerHelper.cacheLocationAddress(payload);
    expect(Cache.save).toBeCalled();
    done();
  });
});

describe('generateResolvedBusList', () => {
  const busStageList = [{
    text: 'Andela Nairobi',
    value: '1.2345,-0.8974'
  },
  {
    text: 'Andela Nairobi',
    value: '1.2345,-0.8974'
  }];
  const payload = { user: { id: 1 } };
  it('should return a list of routes', async () => {
    jest.spyOn(RoutesHelper, 'verifyDistanceBetween').mockResolvedValue([{
      busStop: {
        text: 'Andela Nairobi',
        value: '1.2345,-0.8974'
      },
      valid: true
    }]);
    const result = await RouteInputHandlerHelper
      .generateResolvedBusList(busStageList, 'Nairobi', payload);
    expect(result).toEqual(busStageList);
    expect(Cache.save).toBeCalled();
  });
});
