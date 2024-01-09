import { NextApiRequest, NextApiResponse } from "next";
import { ResponseData } from "../../../types/definitions";
import Cookies from "cookies";
import { NATIVE_URL_COOKIE } from "../../auth/native";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<undefined>
) {
  const cookies = new Cookies(req, res);
  const sessionCookieName = getSessionCookie(getRefererProtocol(req));
  const appUrl = cookies.get(NATIVE_URL_COOKIE);
  const sessionToken = cookies.get(sessionCookieName);
  if (!appUrl || !sessionToken) {
    res.redirect(
      "/auth/login?" +
        new URLSearchParams({
          error: "Error while logging in from native plataform ",
        })
    );
    return;
  }

  res.redirect(`${appUrl}/${sessionToken}`);
  return;
}

export function getRefererProtocol(req: NextApiRequest) {
  if (!req.headers || !req.headers.referer) {
    return "http";
  }

  return new URL(req.headers.referer!).protocol;
}

export function getSessionCookie(context: string) {
  /* if (context === "https") {
    return "__Secure-next-auth.session-token";
  } */
  return "next-auth.session-token";
}
