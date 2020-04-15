import {
  Block, BlockTypes, ActionBlock, MarkdownText, SelectElement,
  ElementTypes, BlockMessage, ImageBlock, ButtonElement, SlackText
} from '../models/slack-block-models';
import NewSlackHelpers, { sectionDivider } from './slack-helpers';
import LocationHelpers from '../../../helpers/googleMaps/locationsMapHelpers';
import Cache from '../../shared/cache';
import { addressService } from '../../addresses/address.service';
import { getTripKey } from '../../../helpers/slack/ScheduleTripInputHandlers';
import { RoutesHelper } from '../../../helpers/googleMaps/googleMapsHelpers';
import UserService from '../../users/user.service';
import { SlackActionButtonStyles } from '../../slack/SlackModels/SlackMessageModels';
import userRouteBlocks from '../routes/blocks';
import userRouteActions from '../routes/actions';

export const getPredictionsKey = (userId) => `TRIP_LOCATION_PREDICTIONS_${userId}`;

export default class NewLocationHelpers {
  static createLocationConfirmMsg(details, {
    selectBlockId, selectActionId, navBlockId, navActionId, backActionValue
  }) {
    const header = new Block(BlockTypes.section)
      .addText(new MarkdownText('Please confirm your location'));

    const imgBlock = new ImageBlock('Map', details.url, 'Select Map Location');
    const mapBlock = new ActionBlock(selectBlockId);
    const selectPlace = new SelectElement(ElementTypes.staticSelect,
      'Select the nearest location', selectActionId);

    const places = NewSlackHelpers.toSlackDropdown(details.predictions, {
      text: 'description', value: 'place_id'
    });
    selectPlace.addOptions(places);

    const locationNotListed = new ButtonElement(new SlackText('Location not listed'), 'notListedLoc',
      userRouteActions.locationNotFound, SlackActionButtonStyles.primary);

    if (selectBlockId === userRouteBlocks.confirmLocation) {
      mapBlock.addElements([selectPlace, locationNotListed]);
    } else {
      mapBlock.addElements([selectPlace]);
    }

    const navigation = NewSlackHelpers.getNavBlock(navBlockId,
      navActionId, backActionValue);
    const message = new BlockMessage([header, imgBlock, mapBlock, sectionDivider, navigation]);
    return message;
  }

  static async getLocationVerificationMsg(location, userId, options) {
    const { homebase: { name } } = await UserService.getUserBySlackId(userId);
    const final = {};
    const details = await LocationHelpers.getPredictionsOnMap(location, name);
    if (!details) {
      return false;
    }
    // eslint-disable-next-line array-callback-return
    await details.predictions.map((prediction) => {
      final[prediction.description] = prediction.place_id;
    });
    await Cache.saveObject(getPredictionsKey(userId), final);
    return this.createLocationConfirmMsg(details, options);
  }

  static async getCoordinates(location) {
    const coordinates = location !== 'Others'
      ? await addressService.findCoordinatesByAddress(location) : null;

    return coordinates;
  }

  static async getDestinationCoordinates(userId, { destination, othersDestination }) {
    const tripData = await Cache.fetch(getTripKey(userId));
    const tripDetails = { ...tripData };
    const destinationCoords = await this.getCoordinates(destination);
    if (destinationCoords) {
      const { id, location: { longitude, latitude } } = destinationCoords;
      tripDetails.destinationLat = latitude;
      tripDetails.destinationLong = longitude;
      tripDetails.destinationId = id;
    }
    tripDetails.destination = destination;
    tripDetails.othersDestination = othersDestination;
    return tripDetails;
  }

  static async handleLocationVerfication(placeIds, location) {
    const pickupCoords = await RoutesHelper
      .getAddressDetails('placeId', placeIds[location]);
    return pickupCoords.results[0].geometry.location;
  }

  static async updateLocation(type, userId, placeId, latitude, longitude, location) {
    const tripData = await Cache.fetch(getTripKey(userId));
    tripData[`${type}Lat`] = latitude;
    tripData[`${type}Long`] = longitude;
    tripData[`${type}Id`] = placeId;
    tripData[type] = location;
    return tripData;
  }
}
