import GoogleMapsDistanceMatrix from '../../../services/googleMaps/GoogleMapsDistanceMatrix';
import Cache from '../../shared/cache';
import { partnerService } from '../../partners/partner.service';
import { engagementService } from '../../engagements/engagement.service';
import SlackHelpers from '../../../helpers/slack/slackHelpers';
import RouteRequestService from '../../routes/route-request.service';
import GoogleMapsStatic from '../../../services/googleMaps/GoogleMapsStatic';
import { RoutesHelper } from '../../../helpers/googleMaps/googleMapsHelpers';
import { addressService } from '../../addresses/address.service';
import { SlackDialogError } from '../SlackModels/SlackDialogModels';
import LocationPrompts from '../SlackPrompts/LocationPrompts';

export const getNewRouteKey = (id) => `ROUTE_CREATION_${id}_v1`;
export default class RouteInputHandlerHelper {
  static async saveRouteRequestDependencies(userId, teamId, submissionValues) {
    const {
      busStop: { longitude: busStopLng, latitude: busStopLat, address: busStopAddress },
      homeAddress: { longitude: homeLng, latitude: homeLat, address: homeAdd },
    } = await Cache.fetch(getNewRouteKey(userId));
    const cached = await Cache.fetch(`userDetails${userId}`);
    const partnerName = cached[2];
    const {
      submission: { manager: managerSlackId, workingHours }
    } = submissionValues;
    const [partner, manager, requester, fellowBusStop, fellowHomeAddress] = await Promise.all([
      partnerService.findOrCreatePartner(partnerName),
      SlackHelpers.findOrCreateUserBySlackId(managerSlackId, teamId),
      SlackHelpers.findOrCreateUserBySlackId(userId, teamId),
      addressService.createNewAddress(busStopLng, busStopLat, busStopAddress),
      addressService.createNewAddress(homeLng, homeLat, homeAdd)
    ]);
    const engagement = await engagementService.findOrCreateEngagement(
      workingHours, requester, partner
    );
    return {
      engagement, manager, fellowBusStop, fellowHomeAddress
    };
  }

  static resolveRouteRequestDBData(locationInfo, depData) {
    const { dojoToDropOffDistance, homeToDropOffDistance, staticMapUrl } = locationInfo;
    const {
      engagement, manager, fellowBusStop, fellowHomeAddress
    } = depData;

    const engagementId = engagement.id;
    const managerId = manager.id;
    const homeId = fellowHomeAddress.id;
    const busStopId = fellowBusStop.id;
    const routeImageUrl = staticMapUrl;
    const requesterId = engagement.fellowId;
    let { distanceInMetres: distance } = dojoToDropOffDistance;
    let { distanceInMetres: busStopDistance } = homeToDropOffDistance;
    distance /= 1000;
    busStopDistance /= 1000;
    return {
      engagementId,
      managerId,
      homeId,
      busStopId,
      routeImageUrl,
      distance,
      busStopDistance,
      requesterId
    };
  }

  static async handleRouteRequestSubmission(payload) {
    const { user: { id: userId }, team: { id: teamId }, actions } = payload;
    const { value } = actions[0];
    const submissionValues = JSON.parse(value);
    const [depData, cachedData] = await Promise.all([
      RouteInputHandlerHelper.saveRouteRequestDependencies(userId, teamId, submissionValues),
      await Cache.fetch(getNewRouteKey(userId))
    ]);
    const { locationInfo } = cachedData;
    const dbData = RouteInputHandlerHelper.resolveRouteRequestDBData(locationInfo, depData);
    return RouteRequestService.createRoute(dbData);
  }

  static async calculateDistance(savedBusStop, savedHomeAddress, theDojo) {
    const { latitude: busStopLat, longitude: busStopLong } = savedBusStop;
    const { latitude: homeLat, longitude: homeLong } = savedHomeAddress;
    const { location: { latitude, longitude } } = theDojo;
    const dojoLocation = `${latitude}, ${longitude}`;
    const homeLocation = `${homeLat}, ${homeLong}`;
    const busStopLocation = `${busStopLat}, ${busStopLong}`;

    const [homeToDropOffDistance, dojoToDropOffDistance] = await Promise.all([
      GoogleMapsDistanceMatrix
        .calculateDistance(busStopLocation, homeLocation),
      GoogleMapsDistanceMatrix
        .calculateDistance(dojoLocation, busStopLocation)]);
    const validationError = RouteInputHandlerHelper.validateDistance(homeToDropOffDistance);
    return { homeToDropOffDistance, dojoToDropOffDistance, validationError };
  }

  static validateDistance(homeToDropOffDistance) {
    const errors = [];
    if (!homeToDropOffDistance) {
      errors.push(new SlackDialogError('selectBusStop', 'Unable to calculate distance'));
    }
    const { distanceInMetres } = homeToDropOffDistance || {};
    if (distanceInMetres > 2000) {
      errors.push(
        new SlackDialogError('selectBusStop', 'Selected bus stop is more than 2km from home')
      );
    }
    let validationError;
    if (errors.length > 0) {
      validationError = {
        errors
      };
    }
    return validationError;
  }

  static getLongLat(coordinate) {
    const [latitude, longitude] = coordinate.split(',');
    return {
      latitude,
      longitude
    };
  }

  static convertStringToUrl(string) {
    return string.replace(/\s/g, '%20');
  }

  static async getLocation(payload, key) {
    const location = await Cache.fetch(getNewRouteKey(payload.user.id));
    const { [key]: { address, latitude, longitude } } = location;
    return { address, latitude, longitude };
  }

  static async getLocationDetailsFromCache(payload, key, coordinateValue = null) {
    const locationResult = await Cache.fetch(getNewRouteKey(payload.user.id));
    const resultData = locationResult[key];
    if (coordinateValue) {
      const locationMatch = resultData.filter((item) => item.value === coordinateValue)
        .map((item) => {
          const { value: coordinate, text: address } = item;
          return { address, ...RouteInputHandlerHelper.getLongLat(coordinate) };
        });
      if (locationMatch.length) {
        return locationMatch[0];
      }

      return null;
    }
    return resultData;
  }

  static async resolveDestinationPreviewData(payload, busStopCoordinate) {
    const [staticMapString, savedHomeAddress, savedBusStop, theDojo] = await Promise.all([
      GoogleMapsStatic.getPathFromDojoToDropOff(busStopCoordinate),
      RouteInputHandlerHelper.getLocationDetailsFromCache(payload, 'homeAddress'),
      payload.submission.otherBusStop ? RouteInputHandlerHelper.getLocation(
        payload, 'dropOffAddress'
      ) : RouteInputHandlerHelper.getLocationDetailsFromCache(
        payload, 'busStageList', busStopCoordinate
      ),
      RoutesHelper.getDojoCoordinateFromDb()
    ]);
    const {
      homeToDropOffDistance,
      dojoToDropOffDistance,
      validationError
    } = await RouteInputHandlerHelper.calculateDistance(savedBusStop, savedHomeAddress, theDojo);

    const staticMapUrl = RouteInputHandlerHelper.convertStringToUrl(staticMapString);
    return {
      staticMapUrl,
      homeToDropOffDistance,
      dojoToDropOffDistance,
      validationError,
      savedBusStop,
      savedHomeAddress,
    };
  }

  static async savePreviewDataToCache(key, previewData) {
    const {
      staticMapUrl, homeToDropOffDistance,
      dojoToDropOffDistance, savedBusStop, savedHomeAddress,
    } = previewData;
    const locationInfo = {
      dojoToDropOffDistance,
      homeToDropOffDistance,
      staticMapUrl,
      savedHomeAddress,
      savedBusStop
    };
    await Cache.save(getNewRouteKey(key), 'busStop', savedBusStop);
    await Cache.save(getNewRouteKey(key), 'locationInfo', locationInfo);
  }

  static async checkIfAddressExistOnDatabase(payload, respond, locationSearchString) {
    const resultFromDatabase = await addressService
      .findAddressIfExists(locationSearchString);

    const SuggestionForSlackSelect = resultFromDatabase
      .map(((result) => {
        const { longitude } = result.get('location');
        const { latitude } = result.get('location');
        const { address } = result;

        const requiredValue = `{ "address": "${address}", "value": "${latitude},${longitude}"}`;

        return { text: result.address, value: requiredValue };
      }));

    if (resultFromDatabase.length > 0) {
      await Cache.save(getNewRouteKey(payload.user.id), 'newRouteRequest', locationSearchString);
      const suggestion = LocationPrompts
        .sendDatbaseLocationSuggestionResponse(SuggestionForSlackSelect);
      respond(suggestion);
      return true;
    }
    return false;
  }

  static async cacheLocationAddress(payload) {
    const locationToBeCached = JSON.parse(payload.actions[0].selected_options[0].value);
    await Cache.save(getNewRouteKey(payload.user.id), 'homeAddress', {
      address: locationToBeCached.address,
      latitude: locationToBeCached.value.split(',')[0],
      longitude: locationToBeCached.value.split(',')[1]
    });
  }

  static async generateResolvedBusList(busStageList, location, payload) {
    const filteredPromise = busStageList.map(async (busStop) => {
      const res = await RoutesHelper.verifyDistanceBetween(location, busStop.value, 2000);
      return { busStop, valid: res };
    });
    const resolvedList = await Promise.all(filteredPromise);
    const filteredBusStops = resolvedList.filter((b) => b.valid).map((a) => a.busStop);
    await Cache.save(getNewRouteKey(payload.user.id), 'busStageList', filteredBusStops);
    return filteredBusStops;
  }

  static async coordinatesFromPlusCodes(payload) {
    const busStop = await RoutesHelper.getReverseGeocodePayload(payload);
    const { plus_code: { geometry: { location: { lat: latitude, lng: longitude } } } } = busStop;
    const locationGeometry = `${latitude},${longitude}`;
    const address = `${busStop.plus_code.best_street_address}`;
    await Cache.save(getNewRouteKey(payload.user.id), 'dropOffAddress', { address, latitude, longitude });
    return locationGeometry;
  }
}
