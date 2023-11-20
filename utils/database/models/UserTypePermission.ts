import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";
import { Permission } from "./Permission";
import { UserType } from "./UserType";

export interface IPermissionStatus {
  active: boolean;
  expirationDate: Date;
  validFrom: Date;
}
export interface IUserTypePermission extends IPermissionStatus {
  userTypeId: number;
  permissionName: number;
}

export const UserTypePermission = sequelize.define<Model<IUserTypePermission>>(
  "userTypePermission",
  {
    userTypeId: {
      type: DataTypes.INTEGER,
      references: {
        model: UserType,
        key: "id",
      },
    },
    permissionName: {
      type: DataTypes.STRING,
      references: {
        model: Permission,
        key: "name",
      },
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    expirationDate: {
      type: DataTypes.DATE,
      defaultValue: null,
      allowNull: true,
    },
    validFrom: { type: DataTypes.DATE, defaultValue: null, allowNull: true },
  },
  { tableName: "user_type_permission", createdAt: false, updatedAt: false }
);
