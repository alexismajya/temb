import tripService from '../../trips/trip.service';
import { SlackDialogError } from '../SlackModels/SlackDialogModels';
import DateDialogHelper from '../../../helpers/dateHelper';
import Utils from '../../../utils';
import bugsnagHelper from '../../../helpers/bugsnagHelper';
import SlackEvents from '../events';
import { slackEventNames } from '../events/slackEvents';
import SlackHelpers from '../../../helpers/slack/slackHelpers';
import InteractivePromptSlackHelper from '../helpers/slackHelpers/InteractivePromptSlackHelper';
import UpdateSlackMessageHelper from '../../../helpers/slack/updatePastMessageHelper';


class RescheduleTripController {
  static async runValidations(date, user, slackBotOauthToken) {
    const userInfo = await SlackHelpers.fetchUserInformationFromSlack(user.id, slackBotOauthToken);
    const errors = [];
    if (!DateDialogHelper.validateDateTime(date)) {
      errors.push(
        new SlackDialogError('time', 'The time should be in the 24 hours format hh:mm')
      );
    }

    if (DateDialogHelper.dateChecker(date, userInfo.tz_offset) < 0) {
      errors.push(
        new SlackDialogError('newMonth', 'This date seems to be in the past!'),
        new SlackDialogError('newDate', 'This date seems to be in the past!'),
        new SlackDialogError('time', 'This date seems to be in the past!')
      );
    }

    return errors;
  }

  static async rescheduleTrip(tripId, newDate, payload, respond) {
    try {
      const trip = await tripService.getById(tripId, true);
      if (trip) {
        const { user: { id: slackUserId }, team: { id: teamId } } = payload;
        const slackInfo = await SlackHelpers.getUserInfoFromSlack(slackUserId, teamId);
        const departureTime = Utils.formatDateForDatabase(newDate, slackInfo.tz);
        const newTrip = await tripService.updateRequest(tripId, { departureTime });
        const requestType = 'reschedule';
        SlackEvents.raise(slackEventNames.NEW_TRIP_REQUEST, payload, newTrip, respond, requestType);

        // update the current message after rescheduling
        const message = await InteractivePromptSlackHelper.sendRescheduleCompletion({},
          trip.rider.slackId);
        const state = payload.state.split(' ');
        const origin = { ...state };
        const newMessage = await UpdateSlackMessageHelper.newUpdateMessage(origin[1], message);
        return newMessage;
      }

      return InteractivePromptSlackHelper.sendTripError();
    } catch (error) {
      bugsnagHelper.log(error);
      return InteractivePromptSlackHelper.sendRescheduleError(tripId);
    }
  }
}

export default RescheduleTripController;
