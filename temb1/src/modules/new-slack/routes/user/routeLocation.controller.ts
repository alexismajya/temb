import RouteLocationHelpers from './routeLocation.helpers';
import LocationPrompts from '../../../slack/SlackPrompts/LocationPrompts';

class RouteLocationController {
  static async confirmLocation(payload: any, respond: Function) {
    if (payload.actions[0].value === 'notListedLoc') {
      LocationPrompts.sendLocationCoordinatesNotFound(respond);
      return;
    }
    const message = await RouteLocationHelpers.confirmLocationMessage(payload);
    respond(message);
  }
}

export default RouteLocationController;
