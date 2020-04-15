import RouteLocationController from '../routeLocation.controller';
import RouteLocationHelpers from '../routeLocation.helpers';
import { payload, dependencyMocks } from '../__mocks__/user-route-mocks';
'../../../slack/RouteManagement/JoinRoute/JoinRouteNotifications';
import LocationPrompts from '../../../../slack/SlackPrompts/LocationPrompts';

describe(RouteLocationController, () => {
  const { actionRespond } = dependencyMocks;
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe(RouteLocationController.confirmLocation, () => {
    it('should call confirm home location message', async () => {
      jest.spyOn(RouteLocationHelpers, 'confirmLocationMessage').mockReturnValueOnce(null);
      await RouteLocationController.confirmLocation(payload, actionRespond);
      expect(RouteLocationHelpers.confirmLocationMessage).toHaveBeenCalled();
    });

    it('should call send cordinates when location is not found', async () => {
      const notFoundLocPayload = {
        actions: [{ value: 'notListedLoc' }],
      };
      jest.spyOn(LocationPrompts, 'sendLocationCoordinatesNotFound').mockReturnValueOnce(null);
      await RouteLocationController.confirmLocation(notFoundLocPayload, actionRespond);
      expect(LocationPrompts.sendLocationCoordinatesNotFound).toHaveBeenCalled();
    });
  });
});
