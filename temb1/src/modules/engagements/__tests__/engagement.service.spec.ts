import { engagementService } from '../engagement.service';
import database from '../../../database';
import { engagement, updateEngagement } from '../__mocks__/engagementMocks';

const { models: { Engagement } } = database;

describe('Engagement Service', () => {
  let engagementFindOrCreate: any;
  let engagementFindByPk: any;
  beforeEach(() => {
    engagementFindOrCreate = jest.spyOn(Engagement, 'findOrCreate');
    engagementFindByPk = jest.spyOn(Engagement, 'findByPk');
  });
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });
  it('should create engagement', async () => {
    const {
      startDate, endDate, workHours, fellow, partner, fellowId, partnerId,
    } = engagement;
    engagementFindOrCreate.mockResolvedValue([engagement]);
    const result = await engagementService.findOrCreateEngagement(
      workHours, fellow, partner, startDate, endDate,
    );
    expect(engagementFindOrCreate).toHaveBeenCalled();
    expect(engagementFindOrCreate.mock.calls[0][0].where)
      .toEqual({
        fellowId,
        partnerId,
      });
    expect(result).toEqual(engagement);
  });

  it('should update engagement', async () => {
    const { startDate, endDate, workHours } = updateEngagement;
    const update = jest.fn();
    engagementFindByPk.mockResolvedValue({
      ...updateEngagement,
      update,
    });
    const result = await engagementService
      .updateEngagement(updateEngagement.id, updateEngagement);

    expect(engagementFindByPk).toHaveBeenCalled();
    expect(update.mock.calls[0][0])
      .toEqual({
        startDate,
        endDate,
        workHours,
      });
    expect(result)
      .toEqual({
        ...updateEngagement,
        update,
      });
  });
  it('should get engagement', async () => {
    engagementFindByPk.mockResolvedValue({
      ...engagement,
    });
    const result = await engagementService.getEngagement(engagement.id);
    expect(engagementFindByPk).toHaveBeenCalled();
    expect(result).toEqual(engagement);
  });
});
