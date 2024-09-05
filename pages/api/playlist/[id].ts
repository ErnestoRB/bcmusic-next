import type { NextApiRequest, NextApiResponse } from "next";
import { EmptyResponse, ResponseData } from "../../../types/definitions";
import logError from "../../../utils/log";

import { validate } from "../../../utils/middleware/validation";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { Account, User } from "../../../utils/database/models";
import {
  Playlist,
  StoredPlaylist,
} from "../../../utils/database/models/Playlist";
import { Song } from "../../../utils/database/models/Song";
import { Model } from "sequelize";
import { IRoute, Route } from "../../../utils/database/models/Route";

export type PlaylistInfo = StoredPlaylist & {
  songs: Song[];
  route: IRoute;
};

export default validate(
  {},
  async (
    req: NextApiRequest,
    res: NextApiResponse<ResponseData<PlaylistInfo> | EmptyResponse>
  ) => {
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
      const user = await User.findByPk(session.user.id);
      if (!user) {
        res.status(401).json({ message: "No encontramos tu cuenta!" });
        return;
      }
      let id = req.query.id!;
      if (Array.isArray(id)) {
        id = id[0];
      }
      const playlist = await Playlist.findByPk(id, { include: [Song, Route] });
      if (!playlist) {
        return res.send({ message: "No encontrada!" });
      }

      res.json({
        message: "Playlist encontrada",
        data: (playlist as Model<PlaylistInfo, PlaylistInfo>).dataValues,
      });
    } catch (error: any) {
      logError(error);
      res.status(500).send({ message: "Error al consultar" });
    }
  }
);
