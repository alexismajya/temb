import createTripDetailsForm from '../createTripDetailsForm';
import {
  SlackDialog, SlackDialogModel
} from '../../../modules/slack/SlackModels/SlackDialogModels';
import { homebaseService } from '../../../modules/homebases/homebase.service';
import { addressService } from '../../../modules/addresses/address.service';

export default async (
  payload,
  formElementsFunctionName,
  callbackId,
  dialogTitle = 'Trip Details', defaultNote
) => {
  const { user: { id: slackId } } = payload;
  const { name: homebaseName } = await homebaseService.getHomeBaseBySlackId(slackId);
  const addresses = await addressService.getAddressListByHomebase(homebaseName);
  const stateValue = JSON.stringify(payload);
  const dialog = new SlackDialog(callbackId, dialogTitle, 'Submit', ' ', stateValue);
  const formElements = createTripDetailsForm[formElementsFunctionName](defaultNote, addresses, payload);
  dialog.addElements(formElements);
  return new SlackDialogModel(payload.trigger_id, dialog);
};
