import { NextApiResponse } from "next";
import { sessionRequired } from "./browser";
import { Session } from "next-auth";
import {
  IUserTypePermissionData,
  TipoUsuarioPermissions,
} from "../../../database/querys";
import { User } from "../../../database/models";
import { UserType } from "../../../database/models";
import { Permission } from "../../../database/models";
import { IPermissionStatus } from "../../../database/models/UserTypePermission";

/**
 *
 * @param session
 * @param res
 * @returns verdadero si tiene permiso y falso si se mando mensaje de no autorización
 */
export const apiUserHavePermission = async (
  session: Session | null,
  res: NextApiResponse,
  permission: string
): Promise<boolean> => {
  if (sessionRequired(session, res)) {
    return false;
  }
  return await havePermission(session!.user.id, permission);
};

export function verifyPermissionSyntax(permission: string) {
  return /^([a-zA-Z0-9_]+|\*)(\.([a-zA-Z0-9_]+|\*))*$/.test(permission);
}
/**
 * Checks on database if the user have the specified permission
 * @param session
 * @param permission
 * @returns true if user have permission
 */
export const userHavePermission = async (
  session: Session | null,
  permission: string
): Promise<boolean> => {
  if (!session) {
    return false;
  }
  return await havePermission(session!.user.id, permission);
};

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
        model: UserType,
        include: [Permission],
      },
    ],
  });
  if (!user) return false;
  if (
    (user.userType as TipoUsuarioPermissions)?.permissions?.some(
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
  // Escapamos caracteres especiales para usarlos literalmente en la expresión regular
  const escapedPattern = permission.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");

  // Reemplazamos el asterisco (*) con una expresión regular para cualquier carácter (excepto saltos de línea)
  const regexPattern = escapedPattern.replace(/\\\*/g, ".*");

  // Creamos una expresión regular con la cadena de búsqueda modificada
  const regex = new RegExp(`^${regexPattern}$`);

  // Probamos si la cadena coincide con el patrón
  return regex.test(expectedPermission);
}

export function isPermissionValid(permiso: IUserTypePermissionData) {
  return (
    permiso.active && isTipoUsuarioPermissionValid(permiso.userTypePermission)
  );
}

/**
 * Comprueba si el permiso es realmente válido
 * @param permisoInfo Record de base de datos
 * @returns Verdadero si un permiso es valido
 */
function isTipoUsuarioPermissionValid(permisoInfo: IPermissionStatus): boolean {
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
