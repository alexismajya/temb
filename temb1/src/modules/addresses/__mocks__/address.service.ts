import { Address } from '../../../database';
import { Repository } from 'sequelize-typescript';
import { Op, FindOrCreateOptions } from 'sequelize';
import AddressService from '../address.service';
import { mockLocationService } from '../../locations/__mocks__/location.service';
import { mockLogger } from '../../shared/logging/__mocks__/logger';
import { MockRepository } from '../../../database/__mocks__';

class MockAddress extends MockRepository<Address> {
  constructor(addresses: Address[] = []) {
    super(Address, addresses);
  }

  async findOrCreate(options: FindOrCreateOptions) {
    return new Promise(async (resolve, reject) => {
      try {
        const where = options.where as any;
        const testAddress = where['address'][Op.iLike] || '';
        const existing = this.data
          .find((a) => a.address.includes(testAddress.replace(/[\$%]/g, '')));
        if (existing) { resolve([this.wrapInModel(existing), false]); }
        const newLoc = await this.create(options.defaults);
        resolve([this.wrapInModel(newLoc), true]);
      } catch (err) {
        reject(new Error('error creating new address'));
      }
    });
  }
}

export const mockAddressRepo = (new MockAddress() as unknown) as Repository<Address>;

export const mockAddressService = new AddressService(mockAddressRepo,
  mockLocationService, mockLogger);
