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
  HasOne,
  HasMany,
} from "sequelize-typescript";
import User from "./User";
import Job from "./Job";
import ListingRequest from "./ListingRequest";
import { ListingImage } from "./ListingImage";

interface ListingAttributes {
  id: number;
  title: string;
  description: string;
  categoryId: number;
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
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    validate: {
      isInt: true,
    },
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100],
    },
  })
  declare title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  declare description: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    validate: {
      notEmpty: true,
      isNumeric: true,
    },
  })
  declare price: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 20],
      isAlpha: true,
    },
  })
  declare city: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 15],
      isAlpha: true,
    },
  })
  declare state: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      isNumeric: true,
      len: [5, 10],
    },
  })
  declare zipcode: string;

  @Column({
    type: DataType.INTEGER.UNSIGNED,
    defaultValue: 0,
    field: "category_id",
    validate: {
      notEmpty: true,
      isInt: true,
    },
  })
  declare categoryId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: "created_user",
    validate: {
      isUUID: 4,
    },
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
    validate: {
      isIn: [["ACTIVE", "IN_PROGRESS", "COMPLETED"]],
    },
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

  @HasMany(() => ListingImage)
  listingImages!: ListingImage[];

  @HasOne(() => Job)
  declare job: Job;

  @HasMany(() => ListingRequest)
  declare listingRequests: ListingRequest[];
}
