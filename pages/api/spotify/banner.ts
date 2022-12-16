import type { NextApiRequest, NextApiResponse } from "next";
import { availableSpotifyTimeRanges, getSpotifyData } from "../../../utils";
import { createBannerBuffer } from "../../../utils/banners/synthwave";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { refreshToken } from "../../../utils/spotify";
import { Account } from "../../../utils/database/models";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Buffer>
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: "Debes iniciar sesióm" });
    return;
  }
  const spotifyToken = await Account.findOne({
    attributes: ["id", "refresh_token", "access_token"],
    where: {
      userId: session?.user.id,
      provider: "spotify",
    },
  });
  const { refresh_token, access_token, id } = spotifyToken;
  let data: any;
  for (const time of availableSpotifyTimeRanges) {
    data = await getSpotifyData(access_token as string, time);
    if (data.error || (!data.error && data.total > 0)) {
      break;
    }
  }
  if (data.error && data.error.status == 401) {
    try {
      const { access_token } = await refreshToken(refresh_token);
      await Account.update(
        { access_token },
        {
          where: {
            id,
          },
        }
      );
      for (const time of availableSpotifyTimeRanges) {
        data = await getSpotifyData(access_token as string, time);
        if (data.error || (!data.error && data.total > 0)) {
          break;
        }
      }
    } catch (error: any) {
      res.send({ message: "Error al renovar el token de acceso" });
      return;
    }
  }
  if (data.error) {
    res.status(400).send(data);
    return;
  }
  const img = await createBannerBuffer(data.items);
  res.send(img);
}
