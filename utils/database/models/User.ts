import { models } from "@next-auth/sequelize-adapter";
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";
import { Country } from "./Country";
import { UserType } from "./UserType";
export interface UserType {
  id?: string;
  name: string;
  email: string;
  password: string;
  birth: string | Date;
  lastName: string;
  image?: string;
  countryId: number;
  userTypeId?: number;
}

export type UserModel = Model<UserType>;

export const User = sequelize.define<UserModel>("user", {
  ...models.User,
  password: DataTypes.STRING(65),
  birth: DataTypes.DATE,
  lastName: DataTypes.STRING,
  countryId: {
    type: DataTypes.INTEGER,
    references: {
      model: Country,
      key: "id",
    },
  },
});
