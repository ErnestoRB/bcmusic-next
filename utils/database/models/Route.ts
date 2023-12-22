import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";
import { User } from "./User";
import { models } from "@next-auth/sequelize-adapter";

export interface IRoute {
  id?: number;
  fromLat: number;
  fromLng: number;
  toLat: number;
  toLng: number;
  date?: Date;
  geometry: string;
  distance: number;
  duration: number;
  profile?: string;
  userId?: string;
}

export const Route = sequelize.define<Model<IRoute>>(
  "route",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fromLat: { type: DataTypes.DECIMAL(10, 6), allowNull: false },
    toLat: { type: DataTypes.DECIMAL(10, 6), allowNull: false },
    fromLng: { type: DataTypes.DECIMAL(10, 6), allowNull: false },
    toLng: { type: DataTypes.DECIMAL(10, 6), allowNull: false },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    geometry: { type: DataTypes.TEXT, allowNull: false },
    distance: { type: DataTypes.DOUBLE(12, 4), allowNull: false },
    duration: { type: DataTypes.DOUBLE(12, 4), allowNull: false },
    profile: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ["foot-walking", "driving-car", "cycling-regular"],
    },
  },
  { tableName: "route", createdAt: true, updatedAt: true }
);
