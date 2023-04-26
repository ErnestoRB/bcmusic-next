import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { ValidationError } from "joi";
import { Fonts } from "../../utils/database/models";
import { copyFile, rm } from "fs/promises";
import path from "path";
import { FONTS_PATH } from "../../utils/banners/path";
import { onlyAllowAdmins } from "../../utils/validation/user";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { PaginationValidation } from "../../utils/validation/pagination";
import { isDuplicateError } from "../../utils/database";
import logError from "../../utils/log";

const parser = formidable();
const parse = (req: Parameters<typeof parser.parse>[0]) =>
  new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
    (res, rej) => {
      parser.parse(req, (err, fields, files) => {
        if (err) {
          rej(err);
          return;
        }
        res({ fields, files });
      });
    }
  );

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
    if (onlyAllowAdmins(session, res)) {
      return;
    }
    if (req.method?.toLowerCase() === "get") {
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
    if (req.method?.toLowerCase() === "post") {
      const session = await unstable_getServerSession(
        req,
        res,
        authOptions(req, res)
      );
      console.log({ session });

      if (onlyAllowAdmins(session, res)) {
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

      await copyFile(
        files.font.filepath,
        path.join(FONTS_PATH, files.font.newFilename)
      );
      await rm(files.font.filepath);

      await Fonts.create({
        nombre: fields.name,
        fileName: files.font.newFilename,
      });
      res.send({ message: `Fuente "${fields.name}" registrada` });
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
