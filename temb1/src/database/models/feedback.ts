import { Base } from '../base';
import { Table, Column, ForeignKey, BelongsTo } from 'sequelize-typescript';
import User from './user';

@Table
export default class Feedback extends Base<Feedback> {
  @ForeignKey(() => User)
  userId: number;

  @Column
  feedback: string;

  @BelongsTo(() => User)
  user: User;
}
