import { config } from "dotenv";

// Configura dotenv para cargar las variables de entorno desde el archivo .env.custom
config({ path: process.cwd() + "/.env.setup" });
import { sync } from "../utils/database/models";

sync().then(() => console.log("Modelo actualizado a la base de datos"));
