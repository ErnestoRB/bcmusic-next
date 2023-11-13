import { NextApiRequest, NextApiResponse } from "next";
import { ValidationError } from "joi";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { PaginationValidation } from "../../utils/authorization/validation/joi/pagination";
import { isDuplicateError } from "../../utils/database";
import logError from "../../utils/log";
import { apiUserHavePermission } from "../../utils/authorization/validation/permissions/server";
import { API_FONTS_GET } from "../../utils/authorization/permissions";
import { Fonts } from "../../utils/database/models";

const FONTS_PER_PAGE = 15;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string; data?: any }>
) {
  try {
    const session = await unstable_getServerSession(
      req,
      res,
      authOptions(req, res)
    );
    if (req.method?.toLowerCase() === "get") {
      if (!(await apiUserHavePermission(session, res, API_FONTS_GET))) {
        return;
      }
      const { page } = (await PaginationValidation.validateAsync(
        req.query
      )) as { page: number };
      const fonts = await Fonts.findAll({
        limit: FONTS_PER_PAGE,
        order: [["id", "DESC"]],
        offset: (page - 1) * FONTS_PER_PAGE,
      });

      res.send({
        message: `Fuentes disponbles: ${fonts.length}`,
        data: fonts.map((font) => font.dataValues),
      });
      return;
    }

    res.status(400).send({ message: "Metodo no implementado" });
  } catch (error: any) {
    if (error.isJoi) {
      res
        .status(400)
        .send({ message: (error as ValidationError).details[0].message });
      return;
    }
    if (isDuplicateError(error)) {
      res
        .status(400)
        .send({ message: `Ya existe una fuente con esas propiedades!` });
      return;
    }
    logError(error);
    res.status(500).send({ message: "Error interno" });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
