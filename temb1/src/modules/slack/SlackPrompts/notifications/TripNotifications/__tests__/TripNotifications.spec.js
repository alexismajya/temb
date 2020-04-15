import { teamDetailsService } from '../../../../../teamDetails/teamDetails.service';
import SlackNotifications from '../../../Notifications';
import { SlackAttachmentField } from '../../../../SlackModels/SlackMessageModels';
import TripNotifications from '..';


describe('TripNotifications', () => {
  it('should send notification', async () => {
    const trip = {
      rider: {
        slackId: 2
      },
      department: {
        teamId: 'TCPCFU4RF'
      },
      departureTime: '2019-03-27T14:10:00.000Z',
      reason: 'It is approved'
    };
    const mockToken = 'X0Xb-2345676543-hnbgrtg';
    jest.spyOn(teamDetailsService, 'getTeamDetailsBotOauthToken')
      .mockResolvedValue(mockToken);
    jest.spyOn(SlackNotifications, 'getDMChannelId').mockResolvedValue('CG6BU8BG8');
    jest.spyOn(SlackNotifications, 'notificationFields').mockReturnValue(
      new SlackAttachmentField('Trip Date', trip.departureTime, true),
      new SlackAttachmentField('Reason', trip.reason, true),
    );
    jest.spyOn(SlackNotifications, 'createDirectMessage').mockReturnValue({
      channelId: 'TCPCFU4RF',
      text: 'Hi! @kica Did you take this trip?',
      attachment: ['trip_completion', new SlackAttachmentField(
        'Reason', trip.reason, true
      )]
    });
    jest.spyOn(SlackNotifications, 'sendNotification').mockReturnValue({});
    await TripNotifications.sendCompletionNotification(trip, mockToken);
    expect(SlackNotifications.sendNotification).toBeCalledTimes(1);
    expect(SlackNotifications.notificationFields).toBeCalledWith(trip);
    expect(SlackNotifications.getDMChannelId).toBeCalledWith(2, mockToken);
  });

  it('should sendTripReminderNotifications', async () => {
    const mockTrip = { department: { teamId: 1 } };
    jest.spyOn(teamDetailsService, 'getTeamDetailsBotOauthToken').mockResolvedValue();
    jest.spyOn(TripNotifications, 'sendDriverReminderNotification').mockResolvedValue();
    jest.spyOn(TripNotifications, 'sendRiderReminderNotification').mockResolvedValue();
    await TripNotifications.sendTripReminderNotifications(mockTrip);
    expect(TripNotifications.sendDriverReminderNotification).toBeCalled();
    expect(TripNotifications.sendRiderReminderNotification).toBeCalled();
  });

  it('should sendDriverReminderNotification if driver has slackId', async () => {
    const mockTrip = {
      driver: { user: { slackId: 'SlackUID' } },
      destination: { address: 'Kampala' },
      origin: { address: 'Mulago' },
      rider: { slackId: 'IDONSLA' }
    };
    jest.spyOn(SlackNotifications, 'getDMChannelId').mockReturnValue({});
    jest.spyOn(SlackNotifications, 'createDirectMessage').mockReturnValue({});
    jest.spyOn(SlackNotifications, 'sendNotification').mockReturnValue({});
    await TripNotifications.sendDriverReminderNotification(mockTrip, 'token');
    expect(SlackNotifications.sendNotification).toBeCalled();
  });
  it('sendRiderReminderNotification', async () => {
    const mockTrip = {
      driver: { user: null },
      destination: { address: 'Kampala' },
      origin: { address: 'Mulago' },
      rider: { slackId: 'IDONSLA' }
    };
    jest.spyOn(SlackNotifications, 'getDMChannelId').mockReturnValue({});
    jest.spyOn(SlackNotifications, 'createDirectMessage').mockReturnValue({});
    jest.spyOn(SlackNotifications, 'sendNotification').mockReturnValue({});
    await TripNotifications.sendRiderReminderNotification(mockTrip, 'token');
    expect(SlackNotifications.sendNotification).toBeCalled();
  });
});
