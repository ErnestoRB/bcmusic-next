import { NextApiRequest, NextApiResponse } from "next";
import { Fonts } from "../../../utils/database/models";
import { readFile } from "fs/promises";
import path from "path";
import { FONTS_PATH } from "../../../vm/fonts/path";
import { onlyAllowAdmins } from "../../../utils/validation/user";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import logError from "../../../utils/log";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string; data?: any } | Buffer>
) {
  try {
    const session = await unstable_getServerSession(
      req,
      res,
      authOptions(req, res)
    );
    const { name } = req.query;
    if (onlyAllowAdmins(session, res)) {
      return;
    }
    if (req.method?.toLowerCase() === "get") {
      const font = await Fonts.findOne({ where: { nombre: name } });
      if (!font) {
        res.status(404).send({ message: "Fuente no existe" });
        return;
      }
      try {
        const fontBinary = await readFile(
          path.join(FONTS_PATH, font.dataValues.fileName)
        );
        res.send(fontBinary);
      } catch (error) {
        res.status(404).send({ message: "Fuente no existe" });
        return;
      }
      return;
    }
    res.status(400).send({ message: "Metodo no implementado" });
  } catch (error: any) {
    logError(error);
    res.status(500).send({ message: "Error interno" });
  }
}
