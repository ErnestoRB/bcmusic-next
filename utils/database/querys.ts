import { isPermissionValid } from "../authorization/validation/permissions/server";
import { Permission } from "./models";
import { IPermission } from "./models/Permission";
import { User } from "./models/User";
import { IUserType } from "./models/UserType";
import { UserType } from "./models";
import { IPermissionStatus } from "./models/UserTypePermission";

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
