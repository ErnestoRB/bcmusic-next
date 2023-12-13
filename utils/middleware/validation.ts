import withJoi from "next-joi";

export const validate = withJoi({
  onValidationError: (_, res, error) => {
    res.status(400).send({ errors: error.details.map((e) => e.message) });
  },
});
