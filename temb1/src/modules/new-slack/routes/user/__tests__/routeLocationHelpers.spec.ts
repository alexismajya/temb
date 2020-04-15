import RouteLocationHelpers from '../routeLocation.helpers';
import { RoutesHelper } from '../../../../../helpers/googleMaps/googleMapsHelpers';
import GoogleMapsPlaceDetails from '../../../../../services/googleMaps/GoogleMapsPlaceDetails';
import Cache from '../../../../shared/cache';
import { blockMessage } from '../__mocks__/user-route-mocks';
import { payload, place, placeDetails } from '../__mocks__/user-location-mocks';

describe(RouteLocationHelpers, () => {

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe(RouteLocationHelpers.confirmLocationMessage, () => {
    it('should confirm home location after getting place details', async () => {
      jest.spyOn(RouteLocationHelpers, 'getPlaceDetails').mockReturnValueOnce(blockMessage.blocks);
      await RouteLocationHelpers.confirmLocationMessage(payload);
      expect(RouteLocationHelpers.getPlaceDetails).toHaveBeenCalledWith(payload);
    });
  });

  describe(RouteLocationHelpers.getPlaceDetails, () => {
    it('should get the details of a place picked by a user', async () => {
      jest.spyOn(RoutesHelper, 'getReverseGeocodePayloadOnBlock').mockReturnValueOnce(place);
      jest.spyOn(GoogleMapsPlaceDetails, 'getPlaceDetails').mockReturnValueOnce(placeDetails);
      jest.spyOn(Cache, 'save').mockReturnValueOnce(null);
      await RouteLocationHelpers.getPlaceDetails(payload);
      expect(RoutesHelper.getReverseGeocodePayloadOnBlock).toHaveBeenCalledWith(payload);
      expect(GoogleMapsPlaceDetails.getPlaceDetails).toHaveBeenCalledWith(place.place_id);
      expect(Cache.save).toHaveBeenCalled();
    });
  });
});
