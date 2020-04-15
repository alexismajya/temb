import { teamDetailsService } from '../../../teamDetails/teamDetails.service';
import NewSlackHelpers from '../../helpers/slack-helpers';
import DateDialogHelper from '../../../../helpers/dateHelper';
import { getTripPickupSchema } from '../schemas';

export default class Validators {
  static async validatePickUpSubmission(payload) {
    try {
      const { submission, user, team } = payload;
      const botToken = await teamDetailsService.getTeamDetailsBotOauthToken(team.id);
      const userInfo = await NewSlackHelpers.getUserInfo(user.id, botToken);
      submission.dateTime = DateDialogHelper.transformDate(submission.dateTime, userInfo.tz);
      return NewSlackHelpers.dialogValidator(submission, getTripPickupSchema(userInfo.tz));
    } catch (err) {
      return err;
    }
  }
}
