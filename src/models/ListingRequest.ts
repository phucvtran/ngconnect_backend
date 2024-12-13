import { Optional } from "sequelize";
import "reflect-metadata";
import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
  HasMany,
} from "sequelize-typescript";
import Listing from "./Listing";
import User from "./User";
import Conversations from "./Conversations";
import ReservationDates from "./ReservationDates";

interface ListingRequestAttributes {
  id: number;
  listingId: string;
  createdUser: User;
}

interface ListingRequestCreationAttributes
  extends Optional<ListingRequestAttributes, "id"> {}

@Table({
  timestamps: false,
  tableName: "listing_requests",
  modelName: "ListingRequest",
})
export default class ListingRequest extends Model<
  ListingRequestAttributes,
  ListingRequestCreationAttributes
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

  @ForeignKey(() => Listing)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
    field: "listing_id",
    validate: {
      isInt: true,
    },
  })
  declare listingId: number;

  @BelongsTo(() => Listing)
  declare listing: Listing;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: "created_user",
    validate: {
      isUUID: 4,
    },
  })
  declare createdUserID: string;

  @BelongsTo(() => User)
  declare receiver: User;

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

  @HasMany(() => Conversations)
  declare conversations: Conversations[];

  @HasMany(() => ReservationDates)
  declare reservationDates: ReservationDates[];
}