import { NextApiRequest, NextApiResponse } from "next";
import { BannerRecord, Fonts } from "../../../utils/database/models";
import { ValidationError } from "joi";
import { UpdateScriptValidation } from "../../../utils/validation/bannerRecords";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { onlyAllowAdmins } from "../../../utils/validation/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string; data?: any; id?: string }>
) {
  try {
    const id = req.query.id;
    const script = req.query.script;
    const session = await unstable_getServerSession(
      req,
      res,
      authOptions(req, res)
    );
    if (!id) {
      res.status(400).send({ message: "Incluye un parametro" });
      return;
    }
    if (Array.isArray(id)) {
      res.status(400).send({ message: "Proporciona un solo valor para 'id'!" });
      return;
    }

    if (req.method?.toLowerCase() === "get") {
      if (script) {
        if (onlyAllowAdmins(session, res)) {
          return;
        }
        const record = await BannerRecord.findByPk(id, {
          include: {
            model: Fonts,
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
      const record = await BannerRecord.findByPk(id, {
        attributes: { exclude: ["script"] },
      });
      res.send({ message: "Registro encontrado", data: record?.dataValues });
    } else if (req.method?.toLowerCase() === "patch") {
      if (onlyAllowAdmins(session, res)) {
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
    res.status(500).send({ message: "Error interno" });
  }
}
