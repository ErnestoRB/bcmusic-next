import { IS_DEVELOPMENT } from "../../environment";
import { sequelize } from "../connection";
import { Model, DataTypes } from "sequelize";
import { Fonts } from "./Fonts";
import { Banner } from "./Banner";

interface IBannerFonts {
  fontId: number;
  bannerId: number;
}
export const BannerFonts = sequelize.define<Model<IBannerFonts>>(
  "banner_fonts",
  {
    fontId: {
      type: DataTypes.INTEGER,
      references: {
        model: Fonts,
        key: "id",
      },
    },
    bannerId: {
      type: DataTypes.INTEGER,
      references: {
        model: Banner,
        key: "id",
      },
    },
  },
  { timestamps: false }
);
