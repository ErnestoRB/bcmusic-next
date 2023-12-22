import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";
import { Route } from "./Route";

export interface StoredPlaylist {
  id?: number;
  name: string;
  url?: string;
  date?: string;
  routeId: string;
  uri?: string;
  userId?: string;
}

export const Playlist = sequelize.define<Model<StoredPlaylist>>(
  "playlist",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.TEXT, allowNull: false },
    url: { type: DataTypes.TEXT, allowNull: false },
    routeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Route,
        key: "id",
      },
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    uri: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
  },
  { tableName: "playlist", createdAt: true, updatedAt: true }
);
