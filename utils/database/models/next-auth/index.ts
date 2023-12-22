import { VerificationToken as VerificationTokenType } from "next-auth/adapters";
import { sequelize } from "../../connection";
import { models } from "@next-auth/sequelize-adapter";
import { DataTypes, Model } from "sequelize";
import { Account as AccountType } from "next-auth";

export const Account = sequelize.define<Model<AccountType>>("account", {
  ...models.Account,
  access_token: {
    type: DataTypes.STRING(500),
  },
  refresh_token: {
    type: DataTypes.STRING(500),
  },
});
export const Session = sequelize.define<Model<typeof models.Session>>(
  "session",
  { ...models.Session }
);
export const VerificationToken = sequelize.define<Model<VerificationTokenType>>(
  "verificationToken",
  {
    ...models.VerificationToken,
  }
);
