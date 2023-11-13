import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";

interface ICountry {
  id: string;
  shortName: string;
  name: string;
}

export const Country = sequelize.define<Model<ICountry>>(
  "pais",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    shortName: DataTypes.STRING(2),
    name: DataTypes.STRING,
  },
  { tableName: "country", createdAt: false, updatedAt: false }
);
