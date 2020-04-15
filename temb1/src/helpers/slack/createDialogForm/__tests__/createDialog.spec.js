import createDialogForm from '../index';
import createTripDetailsForm from '../../createTripDetailsForm';
import {
  SlackDialogModel
} from '../../../../modules/slack/SlackModels/SlackDialogModels';
import { homebaseService } from '../../../../modules/homebases/homebase.service';

describe('createDialogForm tests', () => {
  const payload = { user: { id: 1 } };

  it('should test that new dialog is created', async () => {
    const createTripDetailsFormHandler = jest
      .spyOn(createTripDetailsForm, 'regularTripForm')
      .mockImplementation(() => {});
    jest.spyOn(homebaseService, 'getHomeBaseBySlackId').mockResolvedValue({ name: 'Kampala' });

    const dialogForm = await createDialogForm(payload, 'regularTripForm', 'someCallbackId');
    expect(createTripDetailsFormHandler).toBeCalled();
    expect(dialogForm instanceof SlackDialogModel).toBeTruthy();
  });
});
