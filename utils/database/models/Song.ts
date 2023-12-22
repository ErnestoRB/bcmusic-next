import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";
import { Playlist } from "./Playlist";

export interface Song {
  id?: string;
  artist: string;
  name: string;
  url: string;
  playlistId?: number;
}

export const Song = sequelize.define<Model<Song>>(
  "song",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    artist: { type: DataTypes.STRING(500), allowNull: false },
    name: { type: DataTypes.STRING(500), allowNull: false },
    url: { type: DataTypes.STRING(1000), allowNull: false },
  },
  { tableName: "song", createdAt: true, updatedAt: true }
);
