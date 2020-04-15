import faker from 'faker';
import { homebaseService } from '../src/modules/homebases/homebase.service';
import database from '../src/database';

const { models } = database;

describe('create Homebase', () => {
  let country;
  beforeAll(async () => {
    country = await models.Country.findOne();
  });

  afterAll(async () => {
    await database.close();
  });

  it('should create a homebase', async () => {
    const testHomebase = {
      homebaseName: faker.address.county().concat('rand'),
      countryId: country.id,
      channel: 'UPOIUJ',
      address: {
        address: 'nairobi',
        location: {
          longitude: '23', latitude: '53'
        }
      }
    };
    
    const result = await homebaseService.createHomebase(testHomebase);
    const { homebase } = result;

    expect(homebase.deletedAt).toEqual(null);
    expect(homebase.countryId).toEqual(testHomebase.countryId);
    expect(homebase.name).toEqual(testHomebase.homebaseName);
  });
});
