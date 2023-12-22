import type { NextApiRequest, NextApiResponse } from "next";
import { ResponseData, EmptyResponse } from "../../types/definitions";
import logError from "../../utils/log";
import { Playlist, StoredPlaylist } from "../../utils/database/models/Playlist";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { User } from "../../utils/database/models";
import { sequelize } from "../../utils/database/connection";

export default async function playlistUser(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData<StoredPlaylist[]> | EmptyResponse>
) {
  try {
    const session = await unstable_getServerSession(
      req,
      res,
      authOptions(req, res)
    );
    if (!session) {
      return res.status(401).json({ message: "Debes iniciar sesión" });
    }

    const user = await User.findByPk(session.user.id);
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado!" });
    }

    const playlists = await Playlist.findAll({
      attributes: {
        include: [
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM feedback as f WHERE f.playlistId = playlist.id)`
            ),
            "feedbacks",
          ],
        ],
      },
      where: {
        userId: user.dataValues.id,
      },
    });
    res.json({
      message: "Playlists del usuario",
      data: playlists.map((p) => p.dataValues),
    });
  } catch (error: any) {
    logError(error);
    res
      .status(500)
      .json({ message: "Error al obtener las playlists del usuario" });
  }
}
