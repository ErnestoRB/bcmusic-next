import Joi from "joi";

export default Joi.object({
  width: Joi.number().required(),
  height: Joi.number().required(),
  description: Joi.string(),
  author: Joi.string().required(),
  example: Joi.string().uri(),
  name: Joi.string().required(),
  images: Joi.array()
    .items(
      Joi.string()
        .regex(/^[^\.\/\\]+\.[^\.\/\\]+/)
        .message("El nombre del archivo no debe contener '..', '/' o '\\'")
        .required()
    )
    .required(),
  fonts: Joi.array()
    .items(
      Joi.object({
        src: Joi.string()
          .regex(/^[^\.\/\\]+\.ttf$/)
          .message(
            "El nombre del archivo no debe contener '..', '/' o '\\' y debe terminar en '.ttf'"
          )
          .required(),
        family: Joi.string().required(),
      })
    )
    .required(),
  min_items: Joi.number().default(1),
  time_range: Joi.string()
    .allow("long_term", "short_term", "medium_term")
    .default("medium_term"),
});

export interface BannerConfig {
  time_range: "long_term" | "medium_term" | "short_term";
  min_items: number;
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
