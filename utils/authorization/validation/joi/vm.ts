import Joi from "joi";
import { isPromise } from "node:util/types";

export const PromiseValidation = Joi.custom((value, helpers) => {
  if (!isPromise(value)) {
    return helpers.error("custom.promise");
  }
  return value;
});

export const ScriptReturn = Joi.alternatives().try(
  Joi.binary(),
  Joi.func(),
  PromiseValidation
);
