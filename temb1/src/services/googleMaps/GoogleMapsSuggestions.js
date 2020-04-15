import bugsnagHelper from '../../helpers/bugsnagHelper';
import { getGoogleLocationPayload } from '../../helpers/googleMaps/googleMapsHelpers';

export default class GoogleMapsSuggestions {
  static async getPlacesAutoComplete(placesSuggestionOptions) {
    const uri = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
    const options = {
      qs: placesSuggestionOptions
    };
    try {
      const response = await getGoogleLocationPayload(uri, options);
      return response;
    } catch (error) {
      bugsnagHelper.log(error);
    }
  }
}
