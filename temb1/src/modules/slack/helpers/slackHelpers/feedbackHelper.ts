import { teamDetailsService } from '../../../teamDetails/teamDetails.service';
import InteractivePrompts from '../../SlackPrompts/InteractivePrompts';
import BugsnagHelper from '../../../../helpers/bugsnagHelper';
import {
    SectionBlock, SlackText, TextTypes,
} from '../../../new-slack/models/slack-block-models';

export class FeedbackHelper {
  async sendFeedbackSuccessmessage(teamId: string, channelId: string, actionTs: string) {
    try {
      const slackBotOauthToken = await teamDetailsService.getTeamDetailsBotOauthToken(teamId);
      await InteractivePrompts.messageUpdate(channelId,
        undefined,
          actionTs,
        undefined,
          slackBotOauthToken,
        [new SectionBlock().addText(
            new SlackText(':white_check_mark: Thanks ! We\'ve successfully received your feedback',
              TextTypes.markdown))]);
    } catch (err) {
      BugsnagHelper.log(err);
    }
  }
}

export default new FeedbackHelper();
