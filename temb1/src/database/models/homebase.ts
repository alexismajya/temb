import { Table, Model, Column, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Base } from '../base';
import Country from './country';
import Location from './location';
import User from './user';
import Address from './address';
import Provider from './provider';

@Table({
  paranoid: true,
  timestamps: true,
})
export default class Homebase extends Base<Homebase> {
  @Column({
    unique: true,
  })
  name: string;

  @Column
  channel: string;

  @Column({
    defaultValue: 'tembea@andela.com',
  })
  opsEmail: string;

  @Column
  travelEmail: string;

  @ForeignKey(() =>  Country)
  @Column
  countryId: number;

  @ForeignKey(() =>  Address)
  @Column
  addressId: number;

  @Column
  @ForeignKey(() => Location)
  locationId: number;

  @BelongsTo(() => Country, {
    onDelete: 'cascade',
    hooks: true,
  })
  country: Country;

  @BelongsTo(() => Address, 'addressId')
  address: Address;

  @HasMany(() => User, 'homebaseId')
  users: User[];

  @BelongsTo(() => Location, 'locationId')
  location: Location;

  @HasMany(() => Provider, 'homebaseId')
  providers: Provider[];

  @Column
  currency: string;
}
