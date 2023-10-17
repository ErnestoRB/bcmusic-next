import { NextApiRequest, NextApiResponse } from "next";
import { BannerRecord, Fonts } from "../../../utils/database/models";
import { ValidationError } from "joi";
import { UpdateScriptValidation } from "../../../utils/authorization/validation/bannerRecords";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import type { Model } from "sequelize";
import logError from "../../../utils/log";
import { apiUserHavePermission } from "../../../utils/authorization/validation/user/server";
import {
  API_BANNER_DELETE,
  API_BANNER_GET,
  API_BANNER_PATCH,
} from "../../../utils/authorization/permissions";

const MAX_FONTS_PER_BANNER = 10;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string; data?: any; id?: string }>
) {
  try {
    const session = await unstable_getServerSession(
      req,
      res,
      authOptions(req, res)
    );
    const id = req.query.id;
    const script = req.query.script;
    if (!id) {
      res.status(400).send({ message: "Incluye un parametro" });
      return;
    }
    if (Array.isArray(id)) {
      res.status(400).send({ message: "Proporciona un solo valor para 'id'!" });
      return;
    }

    if (req.method?.toLowerCase() === "get") {
      if (apiUserHavePermission(session, res, API_BANNER_GET)) {
        return;
      }
      if (script) {
        const record = await BannerRecord.findByPk(id, {
          include: {
            model: Fonts,
            attributes: ["id", "nombre"],
            through: {
              attributes: [],
            },
          },
        });
        if (!record) {
          res.status(400).send({ message: `Banner ${id} no existe!` });
          return;
        }
        res.send({ message: "Registro encontrado", data: record?.dataValues });
        return;
      }
      if (req.query.fonts) {
        const record = (await BannerRecord.findByPk(id, {
          include: {
            model: Fonts,
            attributes: ["id", "nombre"],

            through: {
              attributes: [],
            },
          },
        })) as Model;
        if (!record) {
          res.status(400).send({ message: `Banner ${id} no existe!` });
          return;
        }
        const recordFonts = record.dataValues.fonts;
        res.send({
          message: `Fuentes del banner "${record.dataValues.name}"`,
          data: recordFonts,
        });
        return;
      }
      const record = await BannerRecord.findByPk(id, {
        attributes: { exclude: ["script"] },
      });
      if (!record) {
        res.status(400).send({ message: `Banner ${id} no existe!` });
        return;
      }
      res.send({ message: "Registro encontrado", data: record?.dataValues });
    } else if (req.method?.toLowerCase() === "patch") {
      if (apiUserHavePermission(session, res, API_BANNER_PATCH)) {
        return;
      }
      const record = await BannerRecord.findByPk(id, {
        attributes: { exclude: ["script"] },
      });
      if (!record) {
        res.status(400).send({ message: `Banner ${id} no existe!` });
        return;
      }
      if (req.query.addFont) {
        /// @ts-ignore
        const fountsCount = await record.countFonts();
        if (fountsCount >= MAX_FONTS_PER_BANNER) {
          res.status(400).send({
            message: `Ya no puedes agregar más fuentes a este banner!`,
          });
          return;
        }
        const fontName = req.query.addFont;
        const font = await Fonts.findOne({
          where: {
            nombre: fontName,
          },
        });
        if (!font) {
          res.status(400).send({ message: `Fuente ${fontName} no existe!` });
          return;
        }
        /// @ts-ignore
        await record!.addFont(font);
        res.send({
          message: `Se ha agregado la fuente ${font.dataValues.nombre} al banner ${record.dataValues.name}`,
        });
        return;
      }
      const updateRecord = (await UpdateScriptValidation.validateAsync(
        req.body
      )) as { script: string };
      BannerRecord.update(
        { script: updateRecord.script },
        {
          where: {
            id,
          },
        }
      );
      res.send({ message: `Banner ${id} actualizado!` });
      return;
    } else if (req.method?.toLowerCase() === "delete") {
      if (apiUserHavePermission(session, res, API_BANNER_DELETE)) {
        return;
      }
      const record = await BannerRecord.findByPk(id, {
        attributes: { exclude: ["script"] },
      });
      if (!record) {
        res.status(400).send({ message: `Banner ${id} no existe!` });
        return;
      }
      if (req.query.deleteFont) {
        const fontId = Array.isArray(req.query.deleteFont)
          ? req.query.deleteFont[0]
          : req.query.deleteFont;
        const font = await Fonts.findByPk(fontId);
        if (!font) {
          res
            .status(400)
            .send({ message: `Fuente  con id "${id}" no existe!` });
          return;
        }
        /// @ts-ignore
        await record!.removeFont(font);
        res.send({
          message: `Se eliminado la fuente ${font.dataValues.nombre} al banner ${record.dataValues.name}`,
        });
        return;
      }
      record.destroy();
      res.send({ message: `Banner ${id} eliminado!` });
      return;
    } else {
      res.status(400).send({ message: `Método no implementado!` });
    }
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
