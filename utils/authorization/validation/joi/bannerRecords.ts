import Joi from "joi";

export const BannerValidation = Joi.object({
  id: Joi.number().optional(),
  minItems: Joi.number().required(),
  exampleUrl: Joi.string().uri().optional().allow(""),
  width: Joi.number().required(),
  height: Joi.number().required(),
  description: Joi.string().allow(""),
  name: Joi.string().required(),
  script: Joi.string().allow(""),
}).required();

export const UpdateScriptValidation = Joi.object({
  script: Joi.string(),
});

export const UpdateFontValidation = Joi.object({
  id: Joi.number().required(),
  font: Joi.string(),
});

export const BannerHistoryDate = Joi.object({
  month: Joi.number()
    .min(1)
    .max(12)
    .default(() => new Date().getMonth() + 1),
  year: Joi.number()
    .min(0)
    .max(9999)
    .default(() => new Date().getFullYear()),
});
