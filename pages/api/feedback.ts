import type { NextApiRequest, NextApiResponse } from "next";
import {
  Feedback as FeedbackType,
  ResponseData,
} from "../../types/definitions";
import Joi from "joi";
import { validate } from "../../utils/middleware/validation";
import { Feedback } from "../../utils/database/models/Feedback";
import { StoredPlaylist } from "../../utils/database/models/Playlist";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { sessionRequired } from "../../utils/authorization/validation/permissions/browser";
import { isPlaylistAuthor } from "../../utils/database/querys";

export default validate(
  {
    body: Joi.object({
      playlistId: Joi.string().required(),
      rating: Joi.number().integer().min(1).max(5).required(),
    }).required(),
  },
  async (
    req: NextApiRequest,
    res: NextApiResponse<ResponseData<StoredPlaylist>>
  ) => {
    try {
      const session = await unstable_getServerSession(
        req,
        res,
        authOptions(req, res)
      );
      if (sessionRequired(session, res)) {
        return;
      }
      const { playlistId, rating } = req.body;

      if (!(await isPlaylistAuthor(playlistId, session.user.id))) {
        return res
          .status(400)
          .json({ message: "No puedes evaluar playlist ajenas!" });
      }

      const feedback: Omit<FeedbackType, "id"> = {
        userId: session.user.id,
        playlistId,
        rating,
        date: new Date().toISOString(),
      };

      const row = await Feedback.create(feedback);

      if (row) {
        res.json({ message: "Feedback guardado exitosamente" });
      } else {
        res.status(500).json({ message: "Error al guardar el feedback" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error en el servidor" });
    }
  }
);
