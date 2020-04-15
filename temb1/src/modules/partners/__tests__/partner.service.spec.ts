import { partnerService } from '../../../modules/partners/partner.service';
import database from '../../../database';

const { models: { Partner } } = database;

describe('Partner Service', () => {
  let partnerFindOrCreate: any;
  beforeEach(() => {
    partnerFindOrCreate = jest.spyOn(Partner, 'findOrCreate');
  });
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });
  it('should create partner', async () => {
    const name = 'AAAAAA';
    partnerFindOrCreate.mockResolvedValue([{ name }]);
    const result = await partnerService.findOrCreatePartner(name);
    expect(partnerFindOrCreate).toHaveBeenCalled();
    expect(result).toEqual({ name });
  });
});
