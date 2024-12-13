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

interface ConversationsAttributes {
  id: number;
  listingRequestId: number;
  message: string;
  sender: User;
  receiver: User;
}

interface ConversationsCreationAttributes
  extends Optional<ConversationsAttributes, "id"> {}

@Table({
  timestamps: true,
  tableName: "conversations",
  modelName: "Conversations",
})
export default class Conversations extends Model<
  ConversationsAttributes,
  ConversationsCreationAttributes
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
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100],
    },
  })
  declare message: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: "sender_id",
    validate: {
      isUUID: 4,
    },
  })
  declare senderId: string;

  @BelongsTo(() => User, "senderId")
  declare sender: User;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: "receiver_id",
    validate: {
      isUUID: 4,
    },
  })
  declare receiverId: string;

  @BelongsTo(() => User, "receiverId")
  receiver!: User;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: "created_date",
  })
  declare createdDate: Date;
}
