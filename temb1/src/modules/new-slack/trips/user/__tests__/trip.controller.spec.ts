import TripHelpers from '../trip.helpers';
import TripController from '../trip.controller';
import { payload } from '../__mocks__/user-trip-mocks';

describe(TripController, () => {

  const respond = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe(TripController.launch, () => {
    it('should call TripHelpers.getWelcomeMessage', async () => {
      jest.spyOn(TripHelpers, 'getWelcomeMessage').mockReturnValue({});
      const req = { body: { user_id: 'UP0RTRL02' } };
      const res = { status: jest.fn(() => ({
        json: jest.fn(),
      })) };
      await TripController.launch(req, res);
      expect(TripHelpers.getWelcomeMessage).toHaveBeenCalledWith('UP0RTRL02');
    });
  });

  describe(TripController.changeLocation, () => {
    it('should show locations to change', async () => {
      jest.spyOn(TripHelpers, 'changeLocation').mockReturnValueOnce(payload);
      await TripController.changeLocation(payload, respond);
      expect(TripHelpers.changeLocation).toHaveBeenCalledWith(payload);
    });
  });

  describe(TripController.selectLocation, () => {
    it('should enable selection of a location', async () => {
      jest.spyOn(TripHelpers, 'selectLocation').mockReturnValueOnce(payload);
      await TripController.selectLocation(payload, respond);
      expect(TripHelpers.selectLocation).toHaveBeenCalledWith(payload);
    });
  });
});
