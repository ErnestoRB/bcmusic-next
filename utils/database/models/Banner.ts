import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";
import { TimeRanges } from "./TimeRanges";
import { Fonts } from "./Fonts";
import { BannerFonts } from "./BannerFonts";
export type IBanner = {
  id: string;
  minItems: number; // número minimo de items de datos, por defecto, 1.
  width: number; // ancho en px del banner
  height: number; // altura del banner
  exampleUrl?: string; // url de imagen de ejemplo
  description?: string; // descripción del banner
  name: string; // nombre del banner
  script: string;
};
export type BannerModel = Model<IBanner>;

export const Banner = sequelize.define<BannerModel>(
  "banner",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    minItems: DataTypes.INTEGER,
    exampleUrl: DataTypes.STRING(500),
    width: { type: DataTypes.INTEGER, allowNull: false },
    height: { type: DataTypes.INTEGER, allowNull: false },
    description: DataTypes.STRING(500),
    name: { type: DataTypes.STRING, allowNull: false },
    script: DataTypes.STRING(5000),
  },
  { tableName: "banner", createdAt: false, updatedAt: false }
);
