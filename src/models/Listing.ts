import { Optional } from "sequelize";
import "reflect-metadata";
import {
  Table,
  Model,
  Column,
  DataType,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import User from "./User";

interface ListingAttributes {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  city: string;
  state: string;
  zipcode: string;
  createdDate: Date;
  createdUser?: string;
  isDeleted: boolean;
  tags: string[];
  status: string;
}

interface ListingCreationAttributes
  extends Optional<ListingAttributes, "id" | "createdUser"> {}

@Table({
  timestamps: true,
  tableName: "listings",
  modelName: "Listing",
})
export default class Listing extends Model<
  ListingAttributes,
  ListingCreationAttributes
> {
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    autoIncrement: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare description: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare price: number;

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
    allowNull: false,
  })
  declare zipcode: string;

  @Column({
    type: DataType.ENUM("CAT1", "CAT2", "CAT3"),
  })
  declare category: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: "created_user",
  })
  declare createdUser: string;

  @BelongsTo(() => User)
  declare user: User;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare isDeleted: boolean;

  @Column({
    type: DataType.JSON,
    allowNull: true,
    defaultValue: [],
  })
  declare tags: string[];

  @Column({
    type: DataType.ENUM("ACTIVE", "IN_PROGRESS", "COMPLETED"),
    allowNull: false,
    defaultValue: "ACTIVE",
  })
  declare status: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: "created_date",
  })
  declare createdDate: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    field: "updated_date",
  })
  declare updatedDate: Date;
}
