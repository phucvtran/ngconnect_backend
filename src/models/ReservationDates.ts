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
} from "sequelize-typescript";
import Listing from "./Listing";
import User from "./User";
import ListingRequest from "./ListingRequest";

interface ReservationDatesAttributes {
  id: number;
  listingRequestId: number;
  reservationDate: Date;
}

interface ReservationDatesCreationAttributes
  extends Optional<ReservationDatesAttributes, "id"> {}

@Table({
  timestamps: true,
  tableName: "reservation_dates",
  modelName: "ReservationDates",
})
export default class ReservationDates extends Model<
  ReservationDatesAttributes,
  ReservationDatesCreationAttributes
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

  @ForeignKey(() => ListingRequest)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
    field: "listing_request_id",
    validate: {
      isInt: true,
    },
  })
  declare listingRequestId: number;

  @BelongsTo(() => ListingRequest)
  declare listingRequest: ListingRequest;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: "reservation_date",
  })
  declare reservationDate: Date;

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
