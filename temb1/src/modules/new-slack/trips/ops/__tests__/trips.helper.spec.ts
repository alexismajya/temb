
import TripHelpers from '../trips.helper';
import ManagerTripHelpers from '../../manager/trip.helpers';
import { trip } from '../../__mocks__/trip';
import { BlockMessage } from '../../../models/slack-block-models';

describe(TripHelpers, () => {
  describe(TripHelpers.getDelayedTripApprovalMessage, () => {
    it('should send a approval message when user delayed', async () => {
      jest.spyOn(ManagerTripHelpers, 'getApprovalPromptMessage').mockResolvedValue('message');
      await TripHelpers.getDelayedTripApprovalMessage(trip as any);
      expect(ManagerTripHelpers.getApprovalPromptMessage).toBeCalled();
    });
  });

  describe(TripHelpers.getOpsApprovalMessageForManager, () => {
    it('should send a message to a manager when ops approved a trip', () => {
      const message = TripHelpers.getOpsApprovalMessageForManager(trip as any, 'channelId');
      expect(message).toBeInstanceOf(BlockMessage);
    });
  });
});
