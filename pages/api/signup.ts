import { NextApiRequest, NextApiResponse } from "next";
import { SignUpInput } from "../../utils/definitions";
import signup from "../../utils/validation/signup";
import { hash } from "bcrypt";
import { User } from "../../utils/database/models";
import { isDuplicateError } from "../../utils/database";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { Apellido, Email, Nombre, Nacimiento, Pais, Contraseña } =
      (await signup.validateAsync(req.body)) as SignUpInput;

    const hashed = await hash(Contraseña, 10);

    await User.create({
      email: Email,
      name: Nombre,
      nacimiento: Nacimiento,
      idPais: Pais,
      password: hashed,
      apellido: Apellido,
    });
    res.send({ msg: "Registro exitoso" });
  } catch (err: any) {
    console.log(err);

    if (err.isJoi) {
      res.send(err.details);
      return;
    }
    if (isDuplicateError(err)) {
      res.status(400).send({ msg: "Este email ya está registrado!" });
      return;
    }
    res.status(500).send({ msg: "Error interno" });
  }
}
