import InteractivePrompts from '../../../SlackPrompts/InteractivePrompts';
import feedbackHelper from '../feedbackHelper';
import { teamDetailsService } from '../../../../teamDetails/teamDetails.service';

describe('feedback helper', () => {
  let spyOnMessageUpdate;

  beforeAll(() => {
    spyOnMessageUpdate = jest.spyOn(InteractivePrompts, 'messageUpdate').mockResolvedValue(null);
    jest.spyOn(teamDetailsService, 'getTeamDetailsBotOauthToken').mockResolvedValue('token');
  });

  afterAll(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should update the message', async () => {
    await feedbackHelper.sendFeedbackSuccessmessage('xxx', 'xxx', 'xxx');
    expect(spyOnMessageUpdate).toBeCalled();
  });
});
