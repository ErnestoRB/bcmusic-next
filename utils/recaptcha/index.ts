import { RECAPTCHA_SECRET } from "../credentials";

export const validateRecaptchaToken = async (token: string) =>
  await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    body: new URLSearchParams({
      secret: RECAPTCHA_SECRET as string,
      response: token,
    }),
  }).then((res) => res.json());
