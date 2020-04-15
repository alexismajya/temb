import { DirectMessage } from '../dm.notification';
import { mockInformation, mockProviderInformation,
  mockTeamDetailInformation } from '../__mocks__/mockInformation';
import SlackNotifications from '../../../slack/SlackPrompts/Notifications';
import BugsnagHelper from '../../../../helpers/bugsnagHelper';

describe(DirectMessage, () => {
  const directMessage = new DirectMessage();

  describe(DirectMessage.prototype.notifyNewTripRequest, () => {
    it('should notify provider using direct message', async () => {
      jest.spyOn(SlackNotifications, 'getDMChannelId').mockResolvedValue('directMessageId');
      jest.spyOn(SlackNotifications, 'sendNotification').mockResolvedValue(null);
      await directMessage.notifyNewTripRequest(mockProviderInformation as any,
          mockInformation.tripDetails, mockTeamDetailInformation);
      expect(SlackNotifications.getDMChannelId).toBeCalled();
    });

    it('should return error when there is server errors', async() => {
      jest.spyOn(BugsnagHelper, 'log');
      const func = await directMessage.notifyNewTripRequest(null,
              mockInformation.tripDetails, null);
      expect(func).toBeUndefined();
      expect(BugsnagHelper.log).toBeCalled();
    });
  });
});
