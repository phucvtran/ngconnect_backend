import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
  tableName: "listing_categories",
  timestamps: false,
})
export class ListingCategory extends Model {
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;
}
