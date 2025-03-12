import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import Listing from "./Listing";

@Table({ tableName: "listing_images" })
export class ListingImage extends Model {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
  })
  declare url: string;

  @ForeignKey(() => Listing)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  declare listingId: number;

  @BelongsTo(() => Listing)
  declare listing: Listing;
}
