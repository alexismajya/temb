import { ChannelNotification } from '../channel.notification';
import { mockInformation, mockProviderInformation,
  mockTeamDetailInformation } from '../__mocks__/mockInformation';
import SlackNotifications from '../../../slack/SlackPrompts/Notifications';
import BugsnagHelper from '../../../../helpers/bugsnagHelper';

describe(ChannelNotification, () => {
  const channel = new ChannelNotification();

  describe(ChannelNotification.prototype.notifyNewTripRequest, () => {
    it('should notify provider using his private channel', async() => {
      jest.spyOn(SlackNotifications, 'sendNotification').mockResolvedValue('message');
      await channel.notifyNewTripRequest(mockProviderInformation as any,
          mockInformation.tripDetails, mockTeamDetailInformation);
      expect(SlackNotifications.sendNotification).toBeCalled();
    });

    it('should return error when there is server errors', async() => {
      jest.spyOn(BugsnagHelper, 'log');
      const func = await channel.notifyNewTripRequest(null,
              mockInformation.tripDetails, null);
      expect(func).toBeUndefined();
      expect(BugsnagHelper.log).toBeCalled();
    });
  });
});
