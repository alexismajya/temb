
import TripHelpers from '../trip.helpers';
import { homebaseService } from '../../../../homebases/homebase.service';
import UserService from '../../../../users/user.service';
import { payload, homeBases, userHomeBase } from '../__mocks__/user-trip-mocks';

describe(TripHelpers, () => {

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe(TripHelpers.getWelcomeMessage, () => {
    it('should get the welcome message', async () => {
      jest.spyOn(TripHelpers, 'getWelcomeMessage').mockReturnValue(payload);
      await TripHelpers.getWelcomeMessage('UP0RTRL02');
      expect(TripHelpers.getWelcomeMessage).toHaveBeenCalledWith('UP0RTRL02');
    });
  });

  describe(TripHelpers.changeLocation, () => {
    it('should get all home bases locations', async () => {
      jest.spyOn(homebaseService, 'getAllHomebases').mockReturnValueOnce(homeBases);
      jest.spyOn(homebaseService, 'getHomeBaseBySlackId').mockReturnValueOnce(userHomeBase);
      await TripHelpers.changeLocation(payload);
      expect(homebaseService.getAllHomebases).toHaveBeenCalledWith(true);
      expect(homebaseService.getHomeBaseBySlackId).toHaveBeenCalledWith('UP0RTRL02');
    });
  });

  describe(TripHelpers.selectLocation, () => {
    it('should update a location', async () => {
      jest.spyOn(UserService, 'updateDefaultHomeBase').mockReturnValueOnce(payload);
      jest.spyOn(homebaseService, 'getHomeBaseBySlackId').mockReturnValueOnce(userHomeBase);
      await TripHelpers.selectLocation(payload);
      expect(UserService.updateDefaultHomeBase).toHaveBeenCalledWith('UP0RTRL02', 107);
      expect(homebaseService.getHomeBaseBySlackId).toHaveBeenCalledWith('UP0RTRL02', true);
    });
  });
});
