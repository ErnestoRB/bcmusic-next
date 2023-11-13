import { NextApiRequest, NextApiResponse } from "next";
import { copyFile, mkdir, rm, stat } from "fs/promises";
import path from "path";
import { FONTS_PATH } from "../../../vm/fonts/path";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import logError from "../../../utils/log";
import { parse } from "../../../utils/forms/formidable";
import { apiUserHavePermission } from "../../../utils/authorization/validation/permissions/server";
import { API_FONTS_POST } from "../../../utils/authorization/permissions";
import { Fonts } from "../../../utils/database/models";
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
    if (req.method?.toLowerCase() === "post") {
      if (!(await apiUserHavePermission(session, res, API_FONTS_POST))) {
        return;
      }
      const { files, fields } = await parse(req);
      if (!fields.name) {
        res.status(400).send({ message: "No especificaste un nombre" });
        return;
      }
      if (Array.isArray(fields.name)) {
        res.status(400).send({ message: "Solo puedes especificar un nombre" });
        return;
      }
      if (!files.font) {
        res.status(400).send({ message: "No incluiste una fuente!" });
        return;
      }
      if (Array.isArray(files.font)) {
        res.status(400).send({ message: "Sólo puedes subir un archivo " });
        return;
      }
      if (
        !(
          /font\/ttf/.test(files.font.mimetype || "") ||
          files.font.originalFilename?.toLowerCase().endsWith(".ttf")
        )
      ) {
        res.status(400).send({ message: "Sólo puedes subir un archivo TTF!" });
        return;
      }

      let folderExists: boolean = false;
      try {
        folderExists = !!(await stat(FONTS_PATH));
      } catch (error) {
        await mkdir(FONTS_PATH, { recursive: true })
          .then(() => (folderExists = true))
          .catch(() => (folderExists = false));
      }
      if (!folderExists) {
        res.status(400).send({ message: `No se pudo guardar la fuente` });
        return;
      }
      await copyFile(
        files.font.filepath,
        path.join(FONTS_PATH, files.font.newFilename)
      );
      await rm(files.font.filepath);

      await Fonts.create({
        name: fields.name,
        fileName: files.font.newFilename,
      });
      res.send({ message: `Fuente "${fields.name}" registrada` });
      return;
    }
    res.status(400).send({ message: "Metodo no implementado" });
  } catch (error: any) {
    logError(error);
    res.status(500).send({ message: "Error interno" });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
