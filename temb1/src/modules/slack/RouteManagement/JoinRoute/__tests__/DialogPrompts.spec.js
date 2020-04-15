import { SlackDialog } from '../../../SlackModels/SlackDialogModels';
import { teamDetailsService } from '../../../../teamDetails/teamDetails.service';
import WebClientSingleton from '../../../../../utils/WebClientSingleton';
import JoinRouteDialogPrompts from '../JoinRouteDialogPrompts';
import DialogPrompts from '../../../SlackPrompts/DialogPrompts';

jest.mock('../../../../../helpers/slack/slackHelpers');
jest.mock('../../../../../services/AISService');

describe('JoinRouteDialogPrompts', () => {
  let engagement = null;

  beforeEach(() => {
    engagement = { startDate: '', endDate: '', partnerStatus: '' };
    jest.spyOn(teamDetailsService, 'getTeamDetailsBotOauthToken')
      .mockResolvedValue('token');
  });
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });
  describe('sendFellowDetailsForm', () => {
    it('should call sendDialogTryCatch', async () => {
      const payload = { trigger_id: 'triggerId', team: { id: 'teamId' }, user: { id: 'userId' } };
      const addElementsSpy = jest.spyOn(SlackDialog.prototype, 'addElements');
      const sendDialog = jest.spyOn(DialogPrompts, 'sendDialog');
      const webSpy = jest.spyOn(WebClientSingleton, 'getWebClient')
        .mockImplementation(() => ({
          dialog: {
            open: jest.fn()
          }
        }));
      await JoinRouteDialogPrompts.sendFellowDetailsForm(payload, 2, engagement);
      expect(addElementsSpy).toBeCalledTimes(1);
      expect(webSpy).toBeCalled();
      expect(sendDialog).toBeCalled();
    });
  });
});
