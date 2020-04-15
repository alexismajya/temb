import { Table, Column, BelongsTo, ForeignKey, HasMany } from 'sequelize-typescript';
import { Base } from '../base';
import RouteBatch from './route-batch';
import BatchUseRecord from './batch-use-record';

@Table
export default class RouteUseRecord extends Base<RouteUseRecord> {
  @Column({
    allowNull: true,
    defaultValue: 0,
  })
  confirmedUsers: number;

  @Column({
    allowNull: true,
    defaultValue: 0,
  })
  unConfirmedUsers: number;

  @Column({
    allowNull: true,
    defaultValue: 0,
  })
  skippedUsers: number;

  @Column({
    allowNull: true,
    defaultValue: 0,
  })
  pendingUsers: number;

  @Column({
    allowNull: false,
  })
  batchUseDate: string;

  @Column
  @ForeignKey(() => RouteBatch)
  batchId: number;

  @BelongsTo(() => RouteBatch)
  batch: RouteBatch;

  @HasMany(() => BatchUseRecord)
  records: BatchUseRecord[];
}
