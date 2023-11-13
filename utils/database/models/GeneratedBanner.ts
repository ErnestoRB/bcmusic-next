import { DataTypes } from "sequelize";
import { sequelize } from "../connection";
import { Model } from "sequelize";
import { User } from "./User";

export interface IGeneratedBanner {
  id: string;
  idUser: string;
  date: Date;
}

export const GeneratedBanner = sequelize.define<Model<IGeneratedBanner>>(
  "generatedBanner",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    date: DataTypes.DATE,
    idUser: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  { tableName: "generated_banner" }
);
