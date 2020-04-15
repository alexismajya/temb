import TripHelpers from './trip.helpers';
import travelTripsActions from '../travel/actions';
import NewSlackHelpers from '../../helpers/slack-helpers';
import userTripBlocks from './blocks';
import userTripActions from './actions';

class TripController {
  static async launch(req: any, res: any) {
    const { body: { user_id: slackId } } = req;
    const message = await TripHelpers.getWelcomeMessage(slackId);
    return res.status(200).json(message);
  }

  static async changeLocation(payload: any, respond: Function) {
    let message;
    let navBlock;
    const { actions: [{ action_id }] } = payload;
    if (action_id === travelTripsActions.changeLocation) {
      navBlock = NewSlackHelpers.getNavBlock(userTripBlocks.navBlock,
        userTripActions.back, 'back_to_travel_launch');
      message = await TripHelpers.changeLocation(payload, navBlock);
    } else {
      message = await TripHelpers.changeLocation(payload);
    }
    respond(message);
  }

  static async selectLocation(payload: any, respond: Function) {
    const message = await TripHelpers.selectLocation(payload);
    respond(message);
  }
}

export default TripController;
