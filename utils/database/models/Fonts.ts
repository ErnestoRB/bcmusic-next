import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";
export type IFontType = Model<{
  id?: string;
  name: string;
  fileName: string;
}>;

export const Fonts = sequelize.define<IFontType>(
  "fonts",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    fileName: { type: DataTypes.STRING(100), allowNull: false },
  },
  { tableName: "fonts", createdAt: false, updatedAt: false }
);
