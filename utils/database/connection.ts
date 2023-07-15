import { Sequelize } from "sequelize";
import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASS,
  DATABASE_PORT,
  DATABASE_URL,
  DATABASE_USER,
} from "../environment";

let possibleSequelize: Sequelize | undefined = undefined;

if (DATABASE_URL) {
  console.log(DATABASE_URL);

  possibleSequelize = new Sequelize(DATABASE_URL);
} else {
  possibleSequelize = new Sequelize({
    dialect: "mysql",
    host: DATABASE_HOST ?? "127.0.0.1",
    port: DATABASE_PORT ? Number(DATABASE_PORT) : 2020,
    username: DATABASE_USER ?? "root",
    database: DATABASE_NAME ?? "musica",
    password: DATABASE_PASS,
  });
}

export const sequelize = possibleSequelize;
