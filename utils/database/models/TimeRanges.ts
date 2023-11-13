import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";

export interface ITimeRanges {
  id: number;
  name: string;
}
export const TimeRanges = sequelize.define<Model<ITimeRanges>>(
  "timeRanges",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
  },
  { tableName: "time_ranges", createdAt: false, updatedAt: false }
);
