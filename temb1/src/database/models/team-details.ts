import { Table, Model, Column, DataType, HasMany } from 'sequelize-typescript';
import Department from './department';

@Table
export default class TeamDetails extends Model<TeamDetails> {
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.STRING,
  })
  teamId: string;

  @Column({
    unique: true,
    type: DataType.STRING,
    allowNull: false,
  })
  botId: string;

  @Column({
    unique: true,
    type: DataType.STRING,
    allowNull: false,
  })
  botToken: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  teamName: string;

  @Column({
    unique: true,
    type: DataType.STRING,
    allowNull: false,
  })
  teamUrl: string;

  @HasMany(() => Department)
  departments: Department[];
}
