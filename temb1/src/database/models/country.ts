import { Table, Column, DataType, DefaultScope, Scopes, HasMany } from 'sequelize-typescript';
import { Base, enumToStringArray } from '../base';
import { Op } from 'sequelize';
import Embassy from './Embassy';

export enum CountryStatuses {
  active = 'Active',
  inactive = 'Inactive',
}

@DefaultScope({
  where: { status: CountryStatuses.active },
})
@Scopes({
  all: {
    where: {
      status: { [Op.or]: [CountryStatuses.active, CountryStatuses.inactive] },
    },
  },
  inactive: {
    where: {
      status: CountryStatuses.inactive,
    },
  },
})
@Table
export default class Country extends Base<Country> {
  @Column({
    unique: true,
  })
  name: string;

  @Column({
    type: DataType.ENUM(...enumToStringArray(CountryStatuses)),
    defaultValue: CountryStatuses.active,
  })
  status: CountryStatuses;

  @HasMany(() => Embassy, 'countryId')
  embassies: Embassy[];
}
