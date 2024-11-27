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
  NotEmpty,
  AllowNull,
  Length,
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
    validate: {
      isUUID: 4,
    },
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    field: "first_name",
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "first name must not be empty",
      },
      isAlpha: true,
      len: [3, 20],
    },
  })
  declare firstName: string;

  @Column({
    type: DataType.STRING,
    field: "last_name",
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "last name must not be empty",
      },
      isAlpha: true,
      len: [3, 20],
    },
  })
  declare lastName: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: {
        msg: "must has email",
      },
    },
  })
  declare email: string;

  @Column({
    type: DataType.ENUM("ADMIN", "BUSINESS", "USER"),
    defaultValue: "USER",
    validate: {
      isIn: [["ADMIN", "BUSINESS", "USER"]],
    },
  })
  declare role: string;

  @Column({
    type: DataType.STRING,
    validate: {
      notEmpty: true,
      len: [5, 50],
    },
  })
  declare address: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      isAlpha: true,
      len: [2, 50],
    },
  })
  declare city: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      isAlpha: true,
      len: [2, 20],
    },
  })
  declare state: string;

  @Column({
    type: DataType.STRING,
    validate: {
      notEmpty: true,
      isNumeric: true,
      len: [5, 10],
    },
  })
  declare zipcode: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [5, 15],
    },
  })
  declare phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  declare password: string;

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;

  @HasMany(() => Listing)
  declare listings: Listing[];
}
