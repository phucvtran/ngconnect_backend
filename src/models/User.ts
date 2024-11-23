import { Optional } from "sequelize";
import "reflect-metadata";
import {
  Table,
  Model,
  Column,
  DataType,
  CreatedAt,
  UpdatedAt,
  NotNull,
  IsEmail,
  Unique,
  HasMany,
} from "sequelize-typescript";
import Listing from "./Listing";

interface UserAttributes {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  phone: string;
  password: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

@Table({
  timestamps: true,
  tableName: "users",
  modelName: "User",
})
export default class User extends Model<
  UserAttributes,
  UserCreationAttributes
> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    field: "first_name",
    allowNull: false,
  })
  declare firstName: string;

  @Column({
    type: DataType.STRING,
    field: "last_name",
    allowNull: false,
  })
  declare lastName: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.ENUM("ADMIN", "BUSINESS", "USER"),
    defaultValue: "USER",
  })
  declare role: string;

  @Column({
    type: DataType.STRING,
  })
  declare address: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare city: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare state: string;

  @Column({
    type: DataType.STRING,
  })
  declare zipcode: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;

  @HasMany(() => Listing)
  declare listings: Listing[];
}
