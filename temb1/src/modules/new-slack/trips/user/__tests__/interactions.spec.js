import Interactions from '../interactions';
import Cache from '../../../../shared/cache';
import DialogPrompts from '../../../../slack/SlackPrompts/DialogPrompts';
import UpdateSlackMessageHelper from '../../../../../helpers/slack/updatePastMessageHelper';
import { userTripDetails } from '../__mocks__/user-data-mocks';
import UserTripHelpers from '../user-trip-helpers';
import { getTripKey } from '../../../../../helpers/slack/ScheduleTripInputHandlers';
import PreviewScheduleTrip
  from '../../../../slack/helpers/slackHelpers/previewScheduleTripAttachments';
import { teamDetailsService } from '../../../../teamDetails/teamDetails.service';
import { SlackViews } from '../../../extensions/SlackViews';
import {
  tripInfo, responseUrl, allDepartments, homeBaseName
} from '../__mocks__';

describe('Interactions', () => {
  let payload;
  let state;
  let dialogSpy;
  
  beforeEach(() => {
    payload = { user: { id: 'U1567' } };
    state = { origin: 'https;//github.com' };
    dialogSpy = jest.spyOn(DialogPrompts, 'sendDialog').mockResolvedValue();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('sendTripReasonForm', () => {
    it('should send trip reason form', async () => {
      await Interactions.sendTripReasonForm(payload, state);

      expect(dialogSpy).toHaveBeenCalledTimes(1);
      expect(dialogSpy).toHaveBeenCalledWith((expect.objectContaining({
        title: 'Reason for booking trip',
        submit_label: 'Submit'
      })), payload);
    });
  });

  describe('sendDetailsForm', () => {
    it('should send details form', async () => {
      const details = {
        title: 'pickup details',
        submitLabel: 'Submit',
        callbackId: 'id',
        fields: 'fields'
      };
      await Interactions.sendDetailsForm(payload, state, details);
      expect(dialogSpy).toHaveBeenCalledTimes(1);
      expect(dialogSpy).toHaveBeenCalledWith((expect.objectContaining({
        title: 'pickup details',
        submit_label: 'Submit'
      })), payload);
    });
  });

  describe('sendPostDestinationMessage, sendPostPickupMessage', () => {
    const newPayload = {
      submission: {
        date: '2019-12-03',
        time: '23:09',
        pickup: 'Andela Nairobi'
      },
      team: {
        id: 'HGYYY667'
      },
      user: {
        id: 'HUIO56LO'
      },
      view: {
        private_metadata: '{ "origin": "https://origin.com"}'
      }
    };

    beforeEach(() => {
      jest.spyOn(UpdateSlackMessageHelper, 'newUpdateMessage').mockResolvedValue();
    });

    it('should send post destination message', async () => {
      jest.spyOn(JSON, 'parse').mockImplementationOnce(() => ({ origin: '' }));
      jest.spyOn(Cache, 'fetch').mockResolvedValue(userTripDetails);
      jest.spyOn(UserTripHelpers, 'getLocationVerificationMsg').mockResolvedValue();
      jest.spyOn(PreviewScheduleTrip, 'getDistance').mockResolvedValue('10 Km');
      await Interactions.sendPostDestinationMessage(newPayload);
      expect(Cache.fetch).toHaveBeenCalledWith(getTripKey(newPayload.user.id));
      expect(UpdateSlackMessageHelper.newUpdateMessage).toHaveBeenCalled();
    });

    it('should send post pickup message', async () => {
      jest.spyOn(UserTripHelpers, 'getPostPickupMessage')
        .mockResolvedValue(newPayload, newPayload.submission);
      jest.spyOn(UpdateSlackMessageHelper, 'newUpdateMessage')
        .mockResolvedValue('origin', 'message');
      await Interactions.sendPostPickUpMessage(newPayload, newPayload.submission);
      expect(UserTripHelpers.getPostPickupMessage).toBeCalled();
    });
  });
  describe(Interactions.sendPickupModal, () => {
    const teamdetails = { teamId: 'U123', botToken: 'xoxp-123' };

    it('should send pickup modal', async () => {
      jest.spyOn(teamDetailsService, 'getTeamDetailsBotOauthToken')
        .mockResolvedValue(teamdetails.botToken);
      const slackViewsSpy = jest.spyOn(SlackViews.prototype, 'open');

      const payloadData = {
        team: {
          id: teamdetails.teamId,
        },
        trigger_id: '123',
      };
      await Interactions.sendPickupModal('homebase', payloadData);
      expect(slackViewsSpy)
        .toHaveBeenCalledWith(payloadData.trigger_id, expect.any(Object));
    });
  });

  describe('send Edit Request Modal', () => {
    const teamdetails = { teamId: 'U123', botToken: 'xoxp-123' };

    it('should send edit request modal', async () => {
      jest.spyOn(teamDetailsService, 'getTeamDetailsBotOauthToken')
        .mockResolvedValue(teamdetails.botToken);
      const slackViewsSpy = jest.spyOn(SlackViews.prototype, 'open');

      await Interactions.sendEditRequestModal(
        tripInfo, 1, 'ABC', responseUrl, allDepartments, homeBaseName,
      );
      expect(slackViewsSpy)
        .toHaveBeenCalledWith('ABC', expect.any(Object));
    });
  });
});
