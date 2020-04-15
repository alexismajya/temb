import {
    SlackText, Block, TextTypes, ButtonElement, BlockMessage, ActionBlock,
} from '../../models/slack-block-models';
import SlackHelpers from '../../../../helpers/slack/slackHelpers';
import { homebaseService } from '../../../homebases/homebase.service';
import userTripActions, { itineraryActions } from '../user/actions';
import userTripBlocks from './blocks';
import NewSlackHelpers from '../../../new-slack/helpers/slack-helpers';
import { SlackActionButtonStyles } from '../../../slack/SlackModels/SlackMessageModels';
import UserTripHelpers from './user-trip-helpers';
import UserService from '../../../users/user.service';
import travelTripsActions from '../travel/actions';

export const getWelcomeMessage = async (slackId: string) => {
  const welcome = 'Welcome to Tembea!';
  const homeBase = await homebaseService.getHomeBaseBySlackId(slackId, true);
  const homeBaseMessage = homeBase
      ? `_Your current home base is ${SlackHelpers.getLocationCountryFlag(homeBase.country.name)} *${homeBase.name}*_`
      : '`Please set your location to continue`';
  const tembeaGreeting = '*I am your trip operations assistant at Andela*\nWhat would you like to do today?';
  return `${welcome}\n${homeBaseMessage}\n${tembeaGreeting}`;
};

class TripHelpers {
  static async getWelcomeMessage(slackId: string) {
    const welcomeMessage = await getWelcomeMessage(slackId);
    const headerText = new SlackText(welcomeMessage, TextTypes.markdown);
    const header = new Block().addText(headerText);
    const mainButtons = [
      new ButtonElement(new SlackText('Schedule a Trip'), 'bookNewtrip',
          userTripActions.scheduleATrip, SlackActionButtonStyles.primary),
      new ButtonElement(new SlackText('See Trip Itinerary'), 'viewTripsItinerary',
          itineraryActions.viewTripsItinerary, SlackActionButtonStyles.primary),
      new ButtonElement(new SlackText('Change Location'), 'changeLocation',
          userTripActions.changeLocation, SlackActionButtonStyles.primary),
      NewSlackHelpers.getCancelButton(userTripActions.cancel),
    ];
    const newTripBlock = new ActionBlock(userTripBlocks.start);
    newTripBlock.addElements(mainButtons);
    const blocks = [header, newTripBlock];
    const message = new BlockMessage(blocks);
    return message;
  }

  static async changeLocation(payload: any, customNav?: ActionBlock) {
    let navigation;
    const slackId = payload.user.id;
    const homeBases = await homebaseService.getAllHomebases(true);
    const userHomeBase = await homebaseService.getHomeBaseBySlackId(slackId);
    const filteredHomeBases = homebaseService.filterHomebase(userHomeBase, homeBases);
    const headerText = new SlackText('Please choose your current location', TextTypes.markdown);
    const header = new Block().addText(headerText);
    const mainBlock = filteredHomeBases.map((homeBase: any) => {
      const homeBaseCountryFlag = SlackHelpers.getLocationCountryFlag(homeBase.country.name);
      return new ButtonElement(`${homeBaseCountryFlag} ${homeBase.name}`, homeBase.id.toString(),
        `${userTripActions.changeLocation}_${homeBase.id}`, SlackActionButtonStyles.primary);
    });
    const locationBlock = new ActionBlock(userTripBlocks.selectLocation);
    locationBlock.addElements(mainBlock);
    if (customNav) navigation = customNav;
    else navigation = UserTripHelpers.getTripNavBlock('back_to_launch');
    const blocks = [header, locationBlock, navigation];
    const message = new BlockMessage(blocks);
    return message;
  }

  static async selectLocation(payload: any) {
    const { user: { id: slackId }, actions: [{ value: homebaseId }] } = payload;
    await UserService.updateDefaultHomeBase(slackId, Number(homebaseId));
    return TripHelpers.getWelcomeMessage(slackId);
  }
}

export default TripHelpers;
