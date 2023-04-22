import Joi from "joi";

export const BannerRecordValidation = Joi.object({
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
