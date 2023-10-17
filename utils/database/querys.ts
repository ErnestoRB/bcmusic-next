import { TipoUsuario, User } from "./models";

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
