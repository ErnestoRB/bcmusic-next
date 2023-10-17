import Joi from "joi";

export default Joi.object({
  Nombre: Joi.string().required(),
  Apellido: Joi.string().required(),
  Email: Joi.string().email().required(),
  Contraseña: Joi.string()
    .required()
    .min(8)
    .max(24)
    .message("La contraseña no debe tener mínimo 8 caracteres y máximo 24."),
  Pais: Joi.number().required(),
  Nacimiento: Joi.date()
    .greater("0001-01-01")
    .less("9999-12-31")
    .label("Fecha de nacimiento"),
  token: Joi.string().required(),
});
