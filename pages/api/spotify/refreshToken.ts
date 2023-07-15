import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { Account } from "../../../utils/database/models";
import { EmptyResponse } from "../../../types/definitions";
import { refreshToken } from "../../../utils/spotify";
import { authOptions } from "../auth/[...nextauth]";
import logError from "../../../utils/log";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EmptyResponse>
) {
  try {
    const session = await unstable_getServerSession(
      req,
      res,
      authOptions(req, res)
    );
    if (!session) {
      res.status(401).json({ message: "Debes iniciar sesión" });
      return;
    }
    const spotifyToken = await Account.findOne({
      attributes: ["id", "refresh_token"],
      where: {
        userId: session?.user.id,
        provider: "spotify",
      },
    });
    if (!spotifyToken) {
      res
        .status(400)
        .send({ message: "No has vinculado ninguna cuenta de spotify!" });
      return;
    }
    const { refresh_token, id } = spotifyToken?.dataValues;
    const { access_token, error } = await refreshToken(refresh_token);
    if (error) {
      res.status(400).send({ message: "Error con la API de Spotify " });
      return;
    }
    await Account.update(
      { access_token },
      {
        where: {
          id,
        },
      }
    );
    res.status(200).send({ message: "Token actualizado" });
  } catch (error: any) {
    logError(error);

    res.status(500).send({ message: "Error al guardar el token" });
  }
}
