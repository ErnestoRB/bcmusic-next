import { Sequelize } from "sequelize";
import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASS,
  DATABASE_PORT,
  DATABASE_USER,
} from "../credentials";
export const sequelize = new Sequelize({
  dialect: "mysql",
  host: DATABASE_HOST ?? "127.0.0.1",
  port: Number(DATABASE_PORT) ?? 2020,
  username: DATABASE_USER ?? "root",
  database: DATABASE_NAME ?? "musica",
  password: DATABASE_PASS,
});
