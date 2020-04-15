import { Table, Column, ForeignKey, BelongsTo, HasMany, DataType } from 'sequelize-typescript';
import { Base, enumToStringArray } from '../base';
import User from './user';
import Cab from './cab';
import Driver from './driver';
import Homebase from './homebase';
import TripRequest from './trip-request';
​
export enum ProviderNotificationChannel {
  directMessage = '0',
  channel = '1',
  email = '2',
  whatsapp = '3',
}
​
@Table({
  paranoid: true,
  timestamps: true,
})
export default class Provider extends Base<Provider> {
  @Column
  name: string;
​
  @Column({
    allowNull: true,
  })
  channelId?: string;
​
  @Column
  email: string;
​
  @Column
  phoneNo: string;
​
  @Column({
    allowNull: false,
    type: DataType.ENUM(...enumToStringArray(ProviderNotificationChannel)),
  })
  notificationChannel: ProviderNotificationChannel;
​
  @Column
  @ForeignKey(() => User)
  providerUserId?: number;
​
  @Column
  @ForeignKey(() => Homebase)
  homebaseId: number;

  @Column({
    defaultValue: false,
  })
  verified: boolean;
​
  @BelongsTo(() => User, 'providerUserId')
  user: User;
​
  @BelongsTo(() => Homebase)
  homebase: Homebase;
​
  @HasMany(() => Cab)
  vehicles: Cab[];
​
  @HasMany(() => Driver)
  drivers: Driver[];

  @HasMany(() => TripRequest)
  trips: TripRequest[];

  get isDirectMessage () {
    return this.notificationChannel === ProviderNotificationChannel.directMessage;
  }
}
