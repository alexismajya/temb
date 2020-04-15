import { Table, Model, Column, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import Address from './address';
import Country from './country';

@Table({
  paranoid: true,
  timestamps: true,
})
export default class Embassy extends Model<Embassy> {
  @Column({
    unique: true,
  })
  name: string;

  @ForeignKey(() =>  Address)
  @Column
  addressId: number;

  @ForeignKey(() =>  Country)
  @Column
  countryId: number;

  @BelongsTo(() => Address, 'addressId')
  address: Address;

  @BelongsTo(() => Country, 'countryId')
  country: Country;

}
