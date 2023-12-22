import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";
import { Feedback as FeedbackType } from "../../../types/definitions";
import { models } from "@next-auth/sequelize-adapter";
import { Playlist } from "./Playlist";
import { User } from "./User";

export const Feedback = sequelize.define<Model<FeedbackType>>(
  "feedback",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: {
      type: models.User.id.type,
      references: {
        model: User,
        key: "id",
      },

      allowNull: false,
    },
    playlistId: {
      type: DataTypes.INTEGER,
      references: {
        model: Playlist,
        key: "id",
      },

      allowNull: false,
    },
    rating: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 5,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  { tableName: "feedback", createdAt: true, updatedAt: true }
);
