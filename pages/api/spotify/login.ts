import type { NextApiRequest, NextApiResponse } from "next";
import {
  CLIENT_ID,
  SPOTIFY_REDIRECT_ID,
  SPOTIFY_SCOPES,
} from "../../../utils/credentials";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const query = new URLSearchParams({
    client_id: CLIENT_ID!,
    response_type: "code",
    scope: SPOTIFY_SCOPES!,
    redirect_uri: SPOTIFY_REDIRECT_ID,
    state: "olvidalo",
  }).toString();

  res.redirect(`https://accounts.spotify.com/authorize?${query}`);
}
