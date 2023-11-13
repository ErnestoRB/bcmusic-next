import { sequelize } from "../../connection";
import { models } from "@next-auth/sequelize-adapter";

export const Account = sequelize.define("account", { ...models.Account });
export const Session = sequelize.define("session", { ...models.Session });
export const VerificationToken = sequelize.define("verificationToken", {
  ...models.VerificationToken,
});
