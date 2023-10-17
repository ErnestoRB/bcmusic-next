import {
  Permiso,
  PermisoMeta,
  PermisoType,
  TipoUsuario,
  User,
} from "../database/models";
import { TipoUsuarioPermissions } from "../database/querys";

/**
 * Comprueba en la base de datos si el usuario tiene un permiso
 * @param userId Id del usuario a comprobar
 * @param permisoEsperado El permiso que se desea del usuario
 * @returns Verdadero si tiene permisos
 */
export async function havePermission(
  userId: string,
  permisoEsperado: string
): Promise<boolean> {
  const user: any = await User.findOne({
    where: { id: userId },
    include: [
      {
        model: TipoUsuario,
        include: [Permiso],
      },
    ],
  });
  if (!user) return false;
  if (
    (user.tipoUsuario as TipoUsuarioPermissions)?.permisos?.some(
      (p) => likePermission(p.name, permisoEsperado) && isPermissionValid(p)
    )
  )
    return true;

  return false;
}

/**
 * Hace la comprobación de permisos iguales y/o de mayor jerarquía
 * @param permission Permiso real
 * @param expectedPermission Permiso que se busca
 * @returns Verdadero si el permiso esperado es igual o de una especificidad mayor
 */
function likePermission(permission: string, expectedPermission: string) {
  return (
    permission.toLowerCase() == expectedPermission.toLowerCase() ||
    expectedPermission.toLowerCase().includes(permission.toLowerCase())
  );
}

export function isPermissionValid(
  permiso: PermisoType & { tipoUsuarioPermiso: PermisoMeta }
) {
  return (
    permiso.active && isTipoUsuarioPermissionValid(permiso.tipoUsuarioPermiso)
  );
}

/**
 * Comprueba si el permiso es realmente válido
 * @param permisoInfo Record de base de datos
 * @returns Verdadero si un permiso es valido
 */
export function isTipoUsuarioPermissionValid(
  permisoInfo: PermisoMeta
): boolean {
  if (!permisoInfo.active) return false; // permiso no está activo

  if (!permisoInfo.expirationDate && !permisoInfo.validFrom) return true; // permiso está activo, no hay fechas limite
  const today = new Date();

  if (permisoInfo.validFrom && today < permisoInfo.validFrom)
    // checar que la fecha inicial ya haya pasado
    return false;

  if (permisoInfo.expirationDate && today >= permisoInfo.expirationDate)
    // checar que la fecha final no haya pasado
    return false;

  return true;
}
