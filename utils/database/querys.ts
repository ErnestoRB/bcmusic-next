import { isPermissionValid } from "../authorization/querys";
import {
  Permiso,
  PermisoMeta,
  PermisoType,
  TipoUsuario,
  TipoUsuarioType,
  User,
} from "./models";

export type TipoUsuarioPermissions = TipoUsuarioType & {
  permisos: (PermisoType & { tipoUsuarioPermiso: PermisoMeta })[];
};

export const getTypeUser = async (id: string): Promise<string> => {
  return (
    (
      await TipoUsuario.findByPk(
        (
          await User.findByPk(id)
        )?.dataValues.tipoUsuarioId
      )
    )?.dataValues.nombre || "default"
  );
};

export const getTypeUserPermissions = async (
  tipoUsuarioId: string
): Promise<string[]> => {
  let permissions: string[] = [];
  const tipoUsuario = await TipoUsuario.findByPk(tipoUsuarioId, {
    include: {
      model: Permiso,
      through: {
        attributes: ["active", "expirationDate", "validFrom"],
      },
    },
  });

  if (tipoUsuario) {
    console.log(JSON.stringify(tipoUsuario.dataValues));

    let values = tipoUsuario.dataValues as TipoUsuarioPermissions;
    permissions = values.permisos
      .filter((permisoInfo) => isPermissionValid(permisoInfo))
      .map((p) => p.name);
  }
  permissions.forEach(console.log);
  return permissions;
};
