import { LocationService } from '../location.service';
import { mockLogger } from '../../shared/logging/__mocks__/logger';
import { Repository } from 'sequelize-typescript';
import { Location, Op } from '../../../database';

class MockLocation {
  private readonly locations: Location[];

  constructor() {
    this.locations = [];
  }

  async findOne(options: any) {
    return new Promise((resolve, reject) => {
      try {
        const [{ latitude }, { longitude }] = options.where[Op.and];
        if (latitude == null || longitude == null) throw new Error();
        const found = this.locations.find((l) => {
          return l.longitude === longitude && l.latitude === latitude;
        });
        found ? resolve({ get: () => found }) : resolve(found);
      } catch (err) {
        reject(err);
      }
    });
  }

  findOrCreate(options: any) {
    return new Promise((resolve, reject) => {
      try {
        const { latitude, longitude } = options.defaults;
        if (latitude && longitude) {
          let theLocation = this.locations.find((l) => {
            console.log(longitude, 'long', latitude, 'lat');
            return l.longitude === longitude && l.latitude === latitude;
          });
  
          console.log(theLocation, 'location');
          if (theLocation) resolve([theLocation, false]);
          theLocation = { latitude, longitude, id: this.locations.length + 2 } as Location;
          this.locations.push(theLocation);
          resolve([{ get: () => theLocation }, true]);
        }
        throw new Error();
      } catch (err) {
        reject(err);
      }
    });
  }

  async findByPk(pk: any, options: any) {
    return new Promise((resolve, reject) => {
      const found = this.locations.find((l) => l.id === pk);
      resolve(found ? { get: () => found } : found);
    });
  }
}

export const mockLocationRepo = (new MockLocation() as unknown) as Repository<Location>;
export const mockLocationService = new LocationService(mockLocationRepo, mockLogger);
