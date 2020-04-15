import { Table, Column, BelongsTo, ForeignKey, HasMany } from 'sequelize-typescript';
import { Base } from '../base';
import Location from './location';
import Homebase from './homebase';
import Embassy from './Embassy';

@Table
export default class Address extends Base<Address> {
  @Column
  address: string;

  @Column
  isDefault: Boolean;

  @Column
  @ForeignKey(() => Location)
  locationId: number;

  @Column
  @ForeignKey(() => Homebase)
  homebaseId: number;

  @BelongsTo(() => Location)
  location: Location;

  @BelongsTo(() =>  Homebase, 'homebaseId')
  homebase: Homebase;

  @HasMany(() => Embassy, 'addressId')
  embassies: Embassy[];
}
