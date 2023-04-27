import { Session } from "next-auth";
import { getTypeUser } from "../database/querys";
import { NextApiResponse } from "next";

/**
 * Consultar si el usuario es admin, realiza consulta a DB
 * @param id ID del usuario
 * @returns Verdadero si el usuario es 'admin'
 */
export const isAdminDB = (id: string) =>
  getTypeUser(id).then((type) => type.toLowerCase() === "admin");

/**
 * Compara si una cadena es igual es igual a "admin"
 * @param cadena ID del usuario
 * @returns Verdadero si el usuario es 'admin'
 */
export const isAdmin = (cadena?: string) => {
  if (!cadena) {
    return false;
  }
  return cadena.toLowerCase() === "admin";
};

/**
 * Método usado para filtrar peticiones a sólo usuarios con sesión iniciada
 * @param session Session generada por next-auth
 * @param res NextResponse
 * @returns Verdadero cuando se ha enviado una respuesta
 */
export const sessionRequired = (
  session: Session | null,
  res: NextApiResponse
): boolean => {
  if (!session) {
    res.status(401).json({ message: "Inicia sesión primero!" });
    return true;
  }
  return false;
};

/**
 * Método usado para filtrar peticiones a sólo administradores
 * @param session Session generada por next-auth
 * @param res NextResponse
 * @returns Verdadero cuando se ha enviado una respuesta
 */
export const onlyAllowAdmins = (
  session: Session | null,
  res: NextApiResponse
): boolean => {
  if (sessionRequired(session, res)) {
    return true;
  }
  if (
    !session!.user?.tipo_usuario ||
    !isAdmin(session!.user.tipo_usuario.nombre)
  ) {
    res.status(403).json({ message: "No eres admin!" });
    return true;
  }
  return false;
};
