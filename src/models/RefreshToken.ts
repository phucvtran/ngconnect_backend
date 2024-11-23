import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
} from "sequelize-typescript";
import User from "./User";

@Table({
  tableName: "refresh_tokens",
  timestamps: true,
})
export class RefreshToken extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  token!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId!: string;
}
