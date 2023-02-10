import Joi from "joi";

export default Joi.object({
  width: Joi.number().required(),
  height: Joi.number().required(),
  description: Joi.string(),
  author: Joi.string().required(),
  example: Joi.string().uri(),
  name: Joi.string().required(),
  images: Joi.array().items(Joi.string()).required(),
  fonts: Joi.array()
    .items(
      Joi.object({
        src: Joi.string()
          .regex(/^[^\.\/\\]+\.ttf$/)
          .message("El nombre del archivo no debe contener '..', '/' o '\\'")
          .required(),
        family: Joi.string().required(),
      })
    )
    .required(),
});

export interface BannerConfig {
  width: number;
  height: number;
  description?: string;
  example?: string;
  author: string;
  name: string;
  images: string[];
  fonts: {
    src: string;
    family: string;
  }[];
}
