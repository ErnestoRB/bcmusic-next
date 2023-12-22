import { Session } from "next-auth";
import { NextApiResponse } from "next";

/**
 * Compara si una cadena es igual es igual a "admin"
 * @param cadena nombre del tipo de usuario
 * @returns Verdadero si el tipo de usuario es 'admin'
 */
export const isAdmin = (cadena?: string) => {
  if (!cadena) {
    return false;
  }
  return cadena.toLowerCase() === "admin";
};

/**
 * Compara si una cadena es igual es igual a "colab"
 * @param cadena nombre del tipo de usuario
 * @returns Verdadero si el tipo de usuario es 'colab'
 */
export const isCollaborator = (cadena?: string) => {
  if (!cadena) {
    return false;
  }
  return cadena.toLowerCase() === "colab";
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
): session is null => {
  if (!session) {
    res.status(401).json({ message: "Inicia sesión primero!" });
    return true;
  }
  return false;
};

/**
 * Método usado para filtrar peticiones a sólo colaboradores
 * @param session Session generada por next-auth
 * @param res NextResponse
 * @returns Verdadero cuando se ha enviado una respuesta
 */
export const onlyCollaborators = (
  session: Session | null,
  res: NextApiResponse
): boolean => {
  if (sessionRequired(session, res)) {
    return true;
  }
  if (!isCollaboratorSession(session!) && !isAdminSession(session!)) {
    res.status(403).json({ message: "No eres colaborador!" });
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
  if (!isAdminSession(session!)) {
    res.status(403).json({ message: "No eres admin!" });
    return true;
  }
  return false;
};

/**
 * Comprueba si una sesión es de un administrador
 * @param session Sesión del usuario
 * @returns Verdadero si la sesión es de tipo Administrador
 */
export function isAdminSession(session?: Session) {
  return isAdmin(session?.user.tipo_usuario) ?? false;
}
/**
 * Comprueba si una sesión es de un Colaborador
 * @param session Sesión del usuario
 * @returns Verdadero si la sesión es de tipo Colaborador
 */
export function isCollaboratorSession(session: Session) {
  return isCollaborator(session?.user.tipo_usuario) ?? false;
}
