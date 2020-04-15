import { DatePicker, Modal, InputBlock, TextInput } from '../../models/slack-block-models';
import userTripActions from './actions';
import getSlackViews  from '../../extensions/SlackViews';
import { teamDetailsService } from '../../../teamDetails/teamDetails.service';

export class RescheduleController {
  static async sendRescheduleModal(payload: any, tripRequestId: number) {
    const modal = await RescheduleController.getRescheduleModal(tripRequestId);
    const token = await teamDetailsService.getTeamDetailsBotOauthToken(payload.team.id);
    return getSlackViews(token).open(payload.trigger_id, modal);
  }

  static getRescheduleModal(tripRequestId: number) {
    const date = new Date();
    const month = date.getMonth() + 1;
    const organizeDate = `${date.getFullYear()}-${month}-${date.getDate()}`;
    const mainBlock = new InputBlock(new DatePicker(organizeDate, 'select a date', 'date'),
      'Select Date', 'date');
    const anotherBlock = new InputBlock(new TextInput('HH:mm', 'time'), 'Time', 'time');
    const modal = new Modal('Reschedule Trip', {
      submit: 'Reschedule',
      close: 'Cancel',
    }).addBlocks([mainBlock, anotherBlock])
      .addCallbackId(userTripActions.reschedule)
      .addMetadata(tripRequestId.toString());
    return modal;
  }
}
