import { models } from "@next-auth/sequelize-adapter";
import { DataTypes, Model } from "sequelize";
import { sequelize } from "./connection";
export const Pais = sequelize.define<
  Model<{
    ID: string;
    Nombre_Corto: string;
    Nombre: string;
  }>
>(
  "pais",
  {
    ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Nombre_Corto: DataTypes.STRING(2),
    Nombre: DataTypes.STRING,
  },
  { tableName: "paises", createdAt: false, updatedAt: false }
);
export const TipoUsuario = sequelize.define<
  Model<{
    id: number;
    nombre: string;
  }>
>(
  "tipoUsuario",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: DataTypes.STRING,
  },
  { tableName: "tipo_usuario", createdAt: false, updatedAt: false }
);

export const TimeRanges = sequelize.define<
  Model<{
    id: number;
    nombre: string;
  }>
>(
  "timeRanges",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: DataTypes.STRING,
  },
  { tableName: "time_ranges", createdAt: false, updatedAt: false }
);

export type FontsType = Model<{
  id?: string;
  nombre: string;
  fileName: string;
}>;

export const Fonts = sequelize.define<FontsType>(
  "fonts",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    fileName: { type: DataTypes.STRING(100), allowNull: false },
  },
  { tableName: "fonts", createdAt: false, updatedAt: false }
);

export type BannerRecordTypeObject = {
  id: string;
  minItems: number; // número minimo de items de datos, por defecto, 1.
  width: number; // ancho en px del banner
  height: number; // altura del banner
  exampleUrl?: string; // url de imagen de ejemplo
  description?: string; // descripción del banner
  name: string; // nombre del banner
  script: string;
};
export type BannerRecordModel = Model<BannerRecordTypeObject>;

export const BannerRecord = sequelize.define<BannerRecordModel>(
  "bannerRecord",
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
  { tableName: "banner_record", createdAt: false, updatedAt: false }
);

BannerRecord.belongsTo(TimeRanges, {
  foreignKey: { name: "timeRangeId", allowNull: false, defaultValue: 1 },
});
TimeRanges.hasMany(BannerRecord);
export const BannerFonts = sequelize.define<Model<{}>>(
  "banner_fonts",
  {},
  { timestamps: false }
);
BannerRecord.belongsToMany(Fonts, {
  through: BannerFonts,
  foreignKey: { name: "bannerId", allowNull: false, defaultValue: 1 },
});
Fonts.belongsToMany(BannerRecord, { through: BannerFonts });

export interface UserType {
  id?: string;
  name: string;
  email: string;
  password: string;
  nacimiento: string | Date;
  apellido: string;
  image?: string;
  idPais: number;
  tipoUsuarioId?: number;
}

export const User = sequelize.define<Model<UserType>>("user", {
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

TipoUsuario.hasMany(User);
User.belongsTo(TipoUsuario, {
  foreignKey: { name: "tipoUsuarioId", defaultValue: 1, allowNull: true },
});

User.belongsToMany(BannerRecord, {
  through: "user_banner",
  foreignKey: "authorId",
});

BannerRecord.belongsToMany(User, {
  as: "authors",
  through: "user_banner",
});

export const Account = sequelize.define("account", { ...models.Account });
export const Session = sequelize.define("session", { ...models.Session });
export const VerificationToken = sequelize.define("verificationToken", {
  ...models.VerificationToken,
});
export const GeneratedBanner = sequelize.define("banner", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  fecha_generado: DataTypes.DATE,
  idUsuario: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: "id",
    },
  },
});

GeneratedBanner.belongsTo(BannerRecord);
BannerRecord.hasMany(GeneratedBanner, {
  foreignKey: "bannerRecordId",
  onDelete: "cascade",
});

// sequelize.sync({ alter: true });
// sequelize.sync({ force: true });
