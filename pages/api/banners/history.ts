import { NextApiRequest, NextApiResponse } from "next";
import { ValidationError } from "joi";
import {
  BannerRecord,
  BannerRecordTypeObject,
  GeneratedBanner,
  User,
  UserType,
} from "../../../utils/database/models";
import { PaginationValidation } from "../../../utils/authorization/validation/pagination";
import { Model, Op } from "sequelize";
import logError from "../../../utils/log";
import { BannerHistoryDate } from "../../../utils/authorization/validation/bannerRecords";
import { sessionRequired } from "../../../utils/authorization/validation/user/browser";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { sequelize } from "../../../utils/database/connection";

const PAGE_SIZE = 10;

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
        attributes: ["id", "fecha_generado", "idUsuario"],
        include: {
          model: BannerRecord,
          attributes: ["name"],
        },
        where: {
          [Op.and]: [
            { idUsuario },
            sequelize.where(
              sequelize.fn("YEAR", sequelize.col("fecha_generado")),
              year
            ),
            sequelize.where(
              sequelize.fn("MONTH", sequelize.col("fecha_generado")),
              month
            ),
          ],
        },
        /*  include: [
          {
            model: BannerRecord,
            attributes: ["name"],
            through: { attributes: [] },
          },
        ], */
        /* attributes: [
          [sequelize.fn("COUNT", sequelize.col("*")), "cantidad"],
          [sequelize.fn("MONTH", sequelize.col("fecha_generado")), "mes"],
        ],
        group: "mes",
        order: ["mes"],
        where: {
          [Op.and]: [
            { idUsuario },
            sequelize.where(
              sequelize.fn("YEAR", sequelize.fn("CURDATE")),
              sequelize.fn("YEAR", sequelize.col("fecha_generado"))
            ),
          ],
        }, */
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
