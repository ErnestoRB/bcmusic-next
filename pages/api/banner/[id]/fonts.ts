import { NextApiRequest, NextApiResponse } from "next";
import { ValidationError } from "joi";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import logError from "../../../../utils/log";
import { Banner, Fonts, User } from "../../../../utils/database/models";
import { IFontType } from "../../../../utils/database/models/Fonts";
import { ResponseData } from "../../../../types/definitions";
import { havePermission } from "../../../../utils/authorization/validation/permissions/server";
import { sessionRequired } from "../../../../utils/authorization/validation/permissions/browser";
import { API_FONTS_GET } from "../../../../utils/authorization/permissions";
import { UserModel } from "../../../../utils/database/models/User";
import { isBannerAuthor } from "../../../../utils/database/querys";

export type IBannerFont = Pick<IFontType["dataValues"], "id" | "name">;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData<IBannerFont>>
) {
  try {
    if (req.method?.toLowerCase() !== "get") {
      res.status(405).send({ message: "Metodo invalido" });
      return;
    }
    const session = await unstable_getServerSession(
      req,
      res,
      authOptions(req, res)
    );
    if (sessionRequired(session, res)) {
      return;
    }
    const id = req.query.id;
    if (!id) {
      res.status(400).send({ message: "Incluye un parametro" });
      return;
    }
    if (Array.isArray(id)) {
      res.status(400).send({ message: "Proporciona un solo valor para 'id'!" });
      return;
    }
    const banner = await Banner.findByPk(id, {
      include: [
        {
          model: Fonts,
          attributes: ["id", "name"],
          through: {
            attributes: [],
          },
        },
      ],
    });
    if (!banner) {
      return res.status(404).send({ message: "Banner no encontrado!" });
    }
    const isAuthor = await isBannerAuthor(
      banner.dataValues.id,
      session.user.id
    );
    if (!isAuthor || !(await havePermission(session.user.id, API_FONTS_GET))) {
      return res.status(400).send({
        message: "No tienes permisos para ver las fuentes de este banner",
      });
    }

    return res.send({
      message: "Fuentes para banner",
      data: (banner as any).fonts,
    });
  } catch (error: any) {
    if (error.isJoi) {
      res
        .status(400)
        .send({ message: (error as ValidationError).details[0].message });
      return;
    }

    logError(error);
    res.status(500).send({ message: "Error interno" });
  }
}
