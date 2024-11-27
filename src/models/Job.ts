import { Optional } from "sequelize";
import "reflect-metadata";
import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import Listing from "./Listing";

interface JobAttributes {
  id: number;
  listingId: string;
  minRate: number;
  maxRate: number;
  startDate: Date;
  endDate: Date;
}

interface JobCreationAttributes
  extends Optional<JobAttributes, "id" | "listingId"> {}

@Table({
  timestamps: false,
  tableName: "job_listings",
  modelName: "Job",
})
export default class Job extends Model<JobAttributes, JobCreationAttributes> {
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
    type: DataType.INTEGER,
    allowNull: false,
    field: "listing_id",
    validate: {
      isInt: true,
    },
  })
  declare listingId: number;

  @BelongsTo(() => Listing)
  declare listing: Listing;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    field: "min_rate",
    validate: {
      isNumeric: true,
      notEmpty: true,
    },
  })
  declare minRate: number;

  @Column({
    type: DataType.FLOAT,
    field: "max_rate",
    validate: {
      isNumeric: true,
    },
  })
  declare maxRate: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: "start_date",
    validate: {
      isDate: true,
      isAfter: new Date().toISOString(),
    },
  })
  declare startDate: Date;

  @Column({
    type: DataType.DATE,
    field: "end_date",
    validate: {
      isDate: true,
    },
  })
  declare endDate: Date;
}
