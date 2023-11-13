import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";
import { IS_DEVELOPMENT } from "../../environment";

export interface IUserType {
  id: number;
  name: string;
}
export const UserType = sequelize.define<Model<IUserType>>(
  "userType",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
  },
  { tableName: "user_type", createdAt: false, updatedAt: false }
);
