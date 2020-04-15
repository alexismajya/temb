import GoogleMapsClient from '@google/maps';
import request from 'request-promise-native';
import bugsnagHelper from '../bugsnagHelper';
import GoogleMapsDistanceMatrix from '../../services/googleMaps/GoogleMapsDistanceMatrix';
import { addressService } from '../../modules/addresses/address.service';
import env from '../../config/environment';
import { LOCATION_CORDINATES } from '../constants';

export const getGoogleLocationPayload = async (uri, options) => {
  const response = await request.get(uri, options);
  const responseObject = JSON.parse(response);
  if (!responseObject.error_message) {
    return responseObject;
  }
  throw new Error(responseObject.error_message);
};

export class Marker {
  /**
   * @description Creates an instance of a google map marker
   * @returns {object} The marker array
   */
  constructor(color = 'blue', label = '') {
    this.color = color;
    this.label = label;
    this.locations = '';
  }

  /**
   * @description Add a location to a group of markers
   * @param  {string} location A confirmed google map recognised location
   */
  addLocation(location) {
    this.locations = this.locations.concat('|', location);
  }
}

export class RoutesHelper {
  /**
   * @static verifyDistanceBetweenBusStopAndHome
   * @description This method checks that the distance between bus-stop and home is <= 2KM
   * @param {string} busStop - the selected busStop
   * @param {string} home - the selected home   *
   * @param {number} [limit] - drop off limit in meters
   * @returns {string} Accept or Reject message
   * @memberof RoutesHelper
   */

  static async distanceBetweenDropoffAndHome(busStop, home, limit = 2000) {
    try {
      const result = await RoutesHelper.verifyDistanceBetween(busStop, home, limit);
      if (!result) {
        return "Your Bus-stop can't be more than 2km away from your Home";
      }
      return 'Acceptable Distance';
    } catch (error) {
      bugsnagHelper.log(error);
      throw error;
    }
  }

  static async getDojoCoordinateFromDb() {
    const { THE_DOJO_ADDRESS } = env;
    // Get the Dojos location from service
    const theDojo = await addressService.findAddress(THE_DOJO_ADDRESS);
    if (!theDojo) {
      throw new Error('Cannot find The Dojo location in the database');
    }
    return theDojo;
  }

  static async verifyDistanceBetween(origins, destinations, limitInMetres) {
    const result = await GoogleMapsDistanceMatrix.calculateDistance(origins, destinations);
    const { distanceInMetres } = result;
    return distanceInMetres <= limitInMetres;
  }

  static async getReverseGeocodePayload(payload) {
    // Get placeId or coordinates based on the payload values
    if (RoutesHelper.isLocationNotFound(payload)) return false;
    const placeIdOrCoordinates = payload.submission
      ? payload.submission.coordinates : payload.actions[0].selected_options[0].value;
    const optionType = payload.submission ? 'coordinates' : 'placeId';
    return RoutesHelper.getPlaceInfo(optionType, placeIdOrCoordinates);
  }

  static async getReverseGeocodePayloadOnBlock(payload) {
    const { selected_option: { value: placeId } } = payload.actions[0];
    const optionType = payload.submission ? 'coordinates' : 'placeId';
    return RoutesHelper.getPlaceInfo(optionType, placeId);
  }

  static async getAddressDetails(type, payload) {
    const uri = 'https://maps.googleapis.com/maps/api/geocode/json?';
    const plusCodeUri = 'https://plus.codes/api?';
    const searchOption = type === 'placeId' ? {
      place_id: payload
    } : {
      address: payload
    };
    const options = {
      qs: {
        ...searchOption,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    };
    try {
      const response = searchOption.address
        ? await getGoogleLocationPayload(plusCodeUri, options)
        : await getGoogleLocationPayload(uri, options);
      return response;
    } catch (error) {
      bugsnagHelper.log(error);
    }
  }

  static async getPlaceInfo(optionType, placeIdOrCoordinates) {
    const place = await RoutesHelper.getAddressDetails(
      optionType, placeIdOrCoordinates
    );
    return place;
  }

  static isLocationNotFound(payload) {
    const { actions } = payload;
    if (!actions) return false;
    const [{ name }] = actions;
    return (name === 'retry' || name === 'no');
  }
}
export class GoogleMapsLocationSuggestionOptions {
  /**
   * @description This method creates variables needed to get location suggestions from Google Maps.
   * Keeps the session token alive
   * @param {string} input Text string of location to search
   * @param {string} location Point around which you wish to retrieve place information.
   * Must be specified as latitude,longitude.
   * @param {string} radius Distance (in meters) within which to return place results.
   * Maximum is 50,000
   * @param {boolean} [strictBounds]
   * @param {string} location Coordinates of the location the suggestions should be bias to
   * @returns {object} Parameters needed to get map suggestions and session token
   * @memberof RoutesHelper
   */
  constructor(input, location, radius = 15000, strictBounds = true) {
    this.input = input;
    this.location = location || LOCATION_CORDINATES.NAIROBI;
    this.radius = radius;
    this.strictbounds = strictBounds;
    this.sessiontoken = GoogleMapsClient.util.placesAutoCompleteSessionToken();
    this.key = process.env.GOOGLE_MAPS_API_KEY;
  }
}
