import { NextApiResponse } from "next";
import { sessionRequired } from "./browser";
import { Session } from "next-auth";
import { havePermission } from "../../querys";

/**
 *
 * @param session
 * @param res
 * @returns verdadero si no tiene permiso y se mandó mensaje de no autorización
 */
export const apiUserHavePermission = (
  session: Session | null,
  res: NextApiResponse,
  permission: string
): boolean => {
  if (sessionRequired(session, res)) {
    return true;
  }
  if (!havePermission(session!.user.id, permission)) {
    res.status(403).json({ message: "No puedes realizar esta accion!" });
    return true;
  }
  return false;
};

/**
 * Checks on database if the user have the specified permission
 * @param session
 * @param permission
 * @returns true if user have permission
 */
export const userHavePermission = (
  session: Session | null,
  permission: string
): boolean => {
  if (!session) {
    return false;
  }
  if (!havePermission(session!.user.id, permission)) {
    return false;
  }
  return true;
};
