import { RescheduleController } from '../reschedule.controller';
import database from '../../../../../database';

const { models: { TeamDetails } } = database;
describe(RescheduleController, () => {
  let teamId:number;
  beforeAll(async() => {
    const teamDetail = await TeamDetails.findAll({ limit: 1 });
    teamId = teamDetail[0].teamId;
  });
  describe(RescheduleController.getRescheduleModal, () => {
    it('should add reschedullar modal', () => {
      const func = RescheduleController.getRescheduleModal(1);
      expect(typeof func).toBe('object');
      expect(func.type).toEqual('modal');
      expect(func.title.text).toEqual('Reschedule Trip');
    });
  });
  describe(RescheduleController.sendRescheduleModal, () => {
    it('should send reschedule modal', async () => {
      const payloadData = {
        team:{
          id: teamId,
        },
      };
      await RescheduleController.sendRescheduleModal(payloadData, Number(teamId));
    });
  });
});
