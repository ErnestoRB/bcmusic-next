import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";
export interface IPermission {
  name: string;
  active: boolean;
}

export const Permission = sequelize.define<Model<IPermission>>(
  "permission",
  {
    name: { type: DataTypes.STRING, primaryKey: true },
    active: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
  },
  { tableName: "permission", createdAt: false, updatedAt: false }
);
