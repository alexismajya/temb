import OpsDialogPrompts from '../OpsDialogPrompts';
import DialogPrompts from '../DialogPrompts';
import { homebaseService } from '../../../homebases/homebase.service';
import { SlackDialog } from '../../SlackModels/SlackDialogModels';

describe('OpsDialogPrompts', () => {
  beforeEach(() => {
    jest.spyOn(DialogPrompts, 'sendDialog').mockResolvedValue();
    jest.spyOn(homebaseService, 'getHomeBaseBySlackId').mockResolvedValue({ id: 1 });
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  const payloadMock = {
    user: { id: 1 },
    actions: [{ value: 'value_id' }],
    message_ts: '',
    channel: { id: 'channel' }
  };
  it('should send a dialog prompt', async () => {
    await OpsDialogPrompts.selectDriverAndCab(payloadMock, 1);
    expect(DialogPrompts.sendDialog).toBeCalledTimes(1);
  });

  it('should create SelectDriverCabDailog', async () => {
    const response = await OpsDialogPrompts.createSelectDriverCabDailog({}, [], []);
    expect(response).toBeInstanceOf(SlackDialog);
  });
});
