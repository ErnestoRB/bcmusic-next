import { NextApiRequest, NextApiResponse } from "next";
import { ValidationError } from "joi";
import { Op } from "sequelize";
import logError from "../../../utils/log";
import { BannerHistoryDate } from "../../../utils/authorization/validation/joi/bannerRecords";
import { sessionRequired } from "../../../utils/authorization/validation/permissions/browser";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { sequelize } from "../../../utils/database/connection";
import { GeneratedBanner } from "../../../utils/database/models";
import { Banner } from "../../../utils/database/models";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string; data?: any; id?: string }>
) {
  try {
    if (req.method?.toLowerCase() === "get") {
      const session = await unstable_getServerSession(
        req,
        res,
        authOptions(req, res)
      );
      if (sessionRequired(session, res)) {
        return;
      }

      const { month, year } = (await BannerHistoryDate.validateAsync({
        month: req.query.month,
        year: req.query.year,
      })) as { month: number; year: number };

      const idUsuario = session?.user.id;
      const bannerModels = await GeneratedBanner.findAll({
        attributes: ["id", "date", "idUser"],
        include: {
          model: Banner,
          attributes: ["name"],
        },
        where: {
          [Op.and]: [
            { idUser: idUsuario },
            sequelize.where(sequelize.fn("YEAR", sequelize.col("date")), year),
            sequelize.where(
              sequelize.fn("MONTH", sequelize.col("date")),
              month
            ),
          ],
        },
      });
      const banners = bannerModels.map((banner) => banner.dataValues);
      res.send({ message: `Historial de banners generados`, data: banners });
      return;
    }
    res.status(400).send({ message: `Metodo no implementado!` });
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
