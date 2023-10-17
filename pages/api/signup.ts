import { NextApiRequest, NextApiResponse } from "next";
import { ResponseData, SignUpInput } from "../../types/definitions";
import signup from "../../utils/validation/signup";
import { hash } from "bcrypt";
import { User } from "../../utils/database/models";
import { isDuplicateError } from "../../utils/database";
import { validateRecaptchaToken } from "../../utils/recaptcha";
import logError from "../../utils/log";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData<undefined>>
) {
  try {
    const { Apellido, Email, Nombre, Nacimiento, Pais, Contraseña, token } =
      (await signup.validateAsync(req.body)) as SignUpInput;

    //validar token
    const gResponse = await validateRecaptchaToken(token);

    if (!gResponse.success || gResponse.score < 0.7) {
      res.status(400).send({
        message: "Identificamos actividad sospechosa. Intenta más tarde",
      });
      return;
    }

    const hashed = await hash(Contraseña, 10);

    await User.create({
      email: Email,
      name: Nombre,
      nacimiento: Nacimiento,
      idPais: Pais,
      password: hashed,
      apellido: Apellido,
    });
    res.send({ message: "Registro exitoso" });
  } catch (error: any) {
    logError(error);

    if (error.isJoi) {
      res.status(400).send({ message: error.details[0].message });
      return;
    }
    if (isDuplicateError(error)) {
      res.status(400).send({ message: "Este email ya está registrado!" });
      return;
    }
    res.status(500).send({ message: "Error interno" });
  }
}
