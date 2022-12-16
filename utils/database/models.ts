import { models } from "@next-auth/sequelize-adapter";
import { DataTypes } from "sequelize";
import { sequelize } from "./connection";
export const Pais = sequelize.define(
  "pais",
  {
    ID: DataTypes.INTEGER,
    Nombre_Corto: DataTypes.STRING(2),
    Nombre: DataTypes.STRING,
  },
  { tableName: "paises", createdAt: false, updatedAt: false }
);

export const User = sequelize.define("user", {
  ...models.User,
  password: DataTypes.STRING(65),
  nacimiento: DataTypes.DATE,
  apellido: DataTypes.STRING,
  idPais: {
    type: DataTypes.INTEGER,
    references: {
      model: Pais,
      key: "ID",
    },
  },
});
export const Account = sequelize.define("account", { ...models.Account });
export const Session = sequelize.define("session", { ...models.Session });
export const VerificationToken = sequelize.define("verificationToken", {
  ...models.VerificationToken,
});

sequelize.modelManager.models.map((model) => model.sync());
