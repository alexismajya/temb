import { SlackText, MarkdownText, Block, ButtonElement,
    BlockMessage, ActionBlock, ImageBlock,
  } from '../../models/slack-block-models';
import userRouteActions from '../actions';
import userRouteBlocks from '../blocks';
import { SlackActionButtonStyles } from '../../../slack/SlackModels/SlackMessageModels';
import NewSlackHelpers from '../../helpers/slack-helpers';
import { Marker, RoutesHelper } from '../../../../helpers/googleMaps/googleMapsHelpers';
import GoogleMapsPlaceDetails from '../../../../services/googleMaps/GoogleMapsPlaceDetails';
import GoogleMapsStatic from '../../../../services/googleMaps/GoogleMapsStatic';
import Cache from '../../../shared/cache';

class RouteLocationHelpers {
  static async confirmLocationMessage(payload: any) {
    const headerText = new MarkdownText('*Confirm your home location*');
    const heading = new Block().addText(headerText);
    const detailsBlock = await RouteLocationHelpers.getPlaceDetails(payload);
    const navBlock = NewSlackHelpers.getNavBlock(userRouteBlocks.navBlock,
        userRouteActions.back, 'back_to_routes_launch');
    const message = new BlockMessage([heading, ...detailsBlock, navBlock]);
    return message;
  }

  static async getPlaceDetails(payload: any) {
    const place = await RoutesHelper.getReverseGeocodePayloadOnBlock(payload);
    const { geometry: { location: { lat: latitude } } } = place;
    const { geometry: { location: { lng: longitude } } } = place;
    const locationGeometry = `${latitude},${longitude}`;

    const placeDetails = await GoogleMapsPlaceDetails.getPlaceDetails(place.place_id);
    const address = `${placeDetails.result.name}, ${placeDetails.result.formatted_address}`;
    const locationMarker = new Marker('red', 'H');
    locationMarker.addLocation(locationGeometry);
    const staticMapString = GoogleMapsStatic.getLocationScreenshot([locationMarker]);
    await Cache.save(payload.user.id, 'homeAddress', { address, latitude, longitude });

    const homeLocation =  new Block().addText(new MarkdownText(`*${address}*`));
    const imageBlock = new ImageBlock('Map route', staticMapString, 'Map route');
    const confirmButton = [new ButtonElement(new SlackText('Confirm home location'),
      locationGeometry, userRouteActions.confirmLocation, SlackActionButtonStyles.primary)];

    const confirmLocAction = new ActionBlock(userRouteBlocks.confirmHomeLocation);
    confirmLocAction.addElements(confirmButton);
    return [homeLocation, imageBlock, confirmLocAction];
  }
}

export default RouteLocationHelpers;
