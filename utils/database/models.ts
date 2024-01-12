import { sequelize } from "./connection";
import { User } from "./models/User";
import { Account, Session, VerificationToken } from "./models/next-auth";
import { TimeRanges } from "./models/TimeRanges";
import { Banner } from "./models/Banner";
import { UserType } from "./models/UserType";
import { Permission } from "./models/Permission";
import { Fonts } from "./models/Fonts";
import { Country } from "./models/Country";
import { BannerFonts } from "./models/BannerFonts";
import { UserTypePermission } from "./models/UserTypePermission";
import { GeneratedBanner } from "./models/GeneratedBanner";
import { Feedback } from "./models/Feedback";
import { Playlist } from "./models/Playlist";
import { Song } from "./models/Song";
import { Route } from "./models/Route";
import { models } from "@next-auth/sequelize-adapter";

// N:M thru defined model
UserType.belongsToMany(Permission, { through: UserTypePermission });
Permission.belongsToMany(UserType, { through: UserTypePermission });

// 1:N
UserType.hasMany(User);
User.belongsTo(UserType, {
  foreignKey: { name: "userTypeId", defaultValue: 1, allowNull: true },
});

// N:M
User.belongsToMany(Banner, {
  through: "user_banner",
  foreignKey: "authorId",
});
Banner.belongsToMany(User, {
  as: "authors",
  foreignKey: "bannerId",
  through: "user_banner",
});

// 1:N
Banner.belongsTo(TimeRanges, {
  foreignKey: { name: "timeRangeId", allowNull: false, defaultValue: 1 },
});
TimeRanges.hasMany(Banner);

// N:M
Banner.belongsToMany(Fonts, {
  through: BannerFonts,
  foreignKey: { name: "bannerId", allowNull: false, defaultValue: 1 },
});
Fonts.belongsToMany(Banner, { through: BannerFonts });

GeneratedBanner.belongsTo(Banner);
Banner.hasMany(GeneratedBanner, {
  foreignKey: "bannerId",
  onDelete: "cascade",
});

// 1:N
Playlist.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "id",
  keyType: models.Account.userId.type,
});
User.hasMany(Playlist);

// 1:N
Song.belongsTo(Playlist, { foreignKey: "playlistId", targetKey: "id" });
Playlist.hasMany(Song);

// 1:N
Route.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "id",
  keyType: models.Account.userId.type,
});
User.hasMany(Route);

// 1:N
Feedback.belongsTo(Playlist);
Playlist.hasMany(Feedback);

// 1:N
Playlist.belongsTo(Route);
Route.hasMany(Playlist);

// 1:N
Feedback.belongsTo(User);
User.hasMany(Feedback);

const sync = async () => {
  /*   await TimeRanges.sync();
  await Banner.sync();
  await Route.sync();
  await Playlist.sync();
  await Song.sync(); */
  await Feedback.sync();
  /*   await sequelize.sync();
   */
};

export {
  Banner,
  Country,
  TimeRanges,
  Fonts,
  BannerFonts,
  User,
  GeneratedBanner,
  Account,
  Session,
  VerificationToken,
  UserTypePermission,
  UserType,
  Permission,
  sync,
};
