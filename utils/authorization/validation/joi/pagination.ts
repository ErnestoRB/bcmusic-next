import Joi from "joi";

export const PaginationValidation = Joi.object({
  page: Joi.number().min(1).max(1000).default(1),
}).default({ page: 1 });
