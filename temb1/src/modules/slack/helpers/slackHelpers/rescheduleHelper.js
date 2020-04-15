import tripService from '../../../trips/trip.service';
import { isTripRescheduleTimedOut, isTripRequestApproved } from './slackValidations';
import bugsnagHelper from '../../../../helpers/bugsnagHelper';
import InteractivePromptSlackHelper from './InteractivePromptSlackHelper';
import { RescheduleController } from '../../../new-slack/trips/user/reschedule.controller';

export default class TripRescheduleHelper {
  static respondRescheduleError(timedOut, approved) {
    if (timedOut) {
      return InteractivePromptSlackHelper.passedTimeOutLimit();
    }

    if (approved) {
      return InteractivePromptSlackHelper.rescheduleConfirmedApprovedError();
    }
  }

  static async sendTripRescheduleDialog(payload, requestId) {
    try {
      const tripRequest = await tripService.getById(requestId);
      const approved = isTripRequestApproved(tripRequest);
      const timedOut = isTripRescheduleTimedOut(tripRequest);

      const rescheduleError = TripRescheduleHelper.respondRescheduleError(timedOut, approved);

      if (!timedOut && !approved) {
        await RescheduleController.sendRescheduleModal(payload, requestId);
      }
      return rescheduleError;
    } catch (error) {
      bugsnagHelper.log(error);
      return InteractivePromptSlackHelper.sendTripError();
    }
  }
}
