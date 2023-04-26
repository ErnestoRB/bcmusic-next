import { NextApiRequest, NextApiResponse } from "next";
import { ValidationError } from "joi";
import {
  BannerRecord,
  BannerRecordTypeObject,
  User,
  UserType,
} from "../../../utils/database/models";
import { PaginationValidation } from "../../../utils/validation/pagination";
import { Model } from "sequelize";
import logError from "../../../utils/log";

const PAGE_SIZE = 10;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string; data?: any; id?: string }>
) {
  try {
    if (req.method?.toLowerCase() === "get") {
      const { page } = await PaginationValidation.validateAsync(req.query, {
        allowUnknown: true,
      });
      const records = (await BannerRecord.findAll({
        attributes: {
          exclude: ["script"],
        },
        include: {
          model: User,
          as: "authors",
          attributes: ["name"],
          through: {
            attributes: [],
          },
        },
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
      })) as Model<BannerRecordTypeObject & { authors: UserType[] }>[];

      // aplanar para que sea un arreglo de strings en vez de un objeto de usuarios
      records.forEach((banner) => {
        /// @ts-ignore
        banner.dataValues.authors = banner.dataValues.authors.map(
          (author) => author.name
        );
      });

      res.send({
        message: `Ok`,
        data: records.map((banner) => banner.dataValues),
      });
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
