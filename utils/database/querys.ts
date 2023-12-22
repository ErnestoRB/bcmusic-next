import { isPermissionValid } from "../authorization/validation/permissions/server";
import { Banner, Permission } from "./models";
import { IPermission } from "./models/Permission";
import { User, UserModel } from "./models/User";
import { IUserType } from "./models/UserType";
import { UserType } from "./models";
import { IPermissionStatus } from "./models/UserTypePermission";
import logError from "../log";
import { Playlist } from "./models/Playlist";

export type IUserTypePermissionData = IPermission & {
  userTypePermission: IPermissionStatus;
};

export type TipoUsuarioPermissions = IUserType & {
  permissions: IUserTypePermissionData[];
};

export const getTypeUser = async (id: string): Promise<string> => {
  return (
    (await UserType.findByPk((await User.findByPk(id))?.dataValues.userTypeId))
      ?.dataValues.name || "default"
  );
};

export const getTypeUserPermissions = async (
  tipoUsuarioId: string
): Promise<string[]> => {
  let permissions: string[] = [];
  const tipoUsuario = await UserType.findByPk(tipoUsuarioId, {
    include: {
      model: Permission,
      through: {
        attributes: ["active", "expirationDate", "validFrom"],
      },
    },
  });

  if (tipoUsuario) {
    let values = tipoUsuario.dataValues as TipoUsuarioPermissions;
    permissions = values.permissions
      .filter((permisoInfo) => isPermissionValid(permisoInfo))
      .map((p) => p.name);
  }
  return permissions;
};

export async function isBannerAuthor(
  bannerId: string,
  userId: string
): Promise<boolean> {
  try {
    const banner = await Banner.findByPk(bannerId, {
      attributes: ["id"],
      include: [
        {
          model: User,
          attributes: ["id"],
          as: "authors",
          through: {
            attributes: [],
          },
        },
      ],
    });
    const bannerAuthors = (banner as any).authors as Pick<
      UserModel["dataValues"],
      "id"
    >[];
    return bannerAuthors.some((a) => a.id == userId);
  } catch (error: any) {
    logError(error);
    return false;
  }
}

export async function isPlaylistAuthor(
  id: string,
  userId: string
): Promise<boolean> {
  try {
    const playlist = await Playlist.findByPk(id, {
      attributes: ["id", "userId"],
    });
    return playlist?.dataValues.userId == userId;
  } catch (error: any) {
    logError(error);
    return false;
  }
}
