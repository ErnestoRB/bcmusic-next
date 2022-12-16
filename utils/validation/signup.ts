import Joi from "joi";

export default Joi.object({
  Nombre: Joi.string().required(),
  Apellido: Joi.string().required(),
  Email: Joi.string().email().required(),
  Contraseña: Joi.string().alphanum().required().min(8).max(24),
  Pais: Joi.number().required(),
  Nacimiento: Joi.date().greater("0001-01-01").less("9999-12-31"),
});
