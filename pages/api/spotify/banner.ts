import type { NextApiRequest, NextApiResponse } from "next";
import { getSpotifyData } from "../../../utils";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { refreshToken } from "../../../utils/spotify";
import {
  Account,
  BannerRecord,
  Fonts,
  GeneratedBanner,
} from "../../../utils/database/models";
import { ResponseData } from "../../../types/definitions";
import { sequelize } from "../../../utils/database/connection";
import { Op, Transaction } from "sequelize";
import { executeBanner } from "../../../utils/banners/vm";
import logError from "../../../utils/log";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | Buffer>
) {
  const { id = "synthwave" } = req.query;
  if (id instanceof Array) {
    res.status(400).json({ message: "Sólo especifica un valor para banner" });
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
    res.status(400).json({ message: "No se encontró ese banner" });
    return;
  }
  try {
    const session = await unstable_getServerSession(
      req,
      res,
      authOptions(req, res)
    );
    if (!session) {
      res.status(401).json({ message: "Debes iniciar sesión" });
      return;
    }
    const spotifyToken = await Account.findOne({
      attributes: ["id", "refresh_token", "access_token"],
      where: {
        userId: session?.user.id,
        provider: "spotify",
      },
    });
    if (!spotifyToken) {
      res
        .status(400)
        .send({ message: "No has vinculado ninguna cuenta de spotify!" });
      return;
    }
    if (process.env.NODE_ENV === "production") {
      const banner = await GeneratedBanner.findOne({
        where: {
          [Op.and]: [
            sequelize.where(
              sequelize.fn(
                "TIMESTAMPDIFF",
                sequelize.literal("MINUTE"),
                sequelize.col("fecha_generado"),
                sequelize.fn("NOW")
              ),
              Op.lte,
              60
            ),
            { idUsuario: session.user?.id },
          ],
        },
      });
      if (banner) {
        res
          .status(400)
          .send({ message: "Sólo puedes crear un banner por hora." });
        return;
      }
    }
    const { refresh_token, access_token, id } = spotifyToken.dataValues;

    let data = await getSpotifyData(access_token as string, "long_term");
    if (data.error && data.error.status == 401) {
      try {
        const { access_token } = await refreshToken(refresh_token);
        await Account.update(
          { access_token },
          {
            where: {
              id,
            },
          }
        );
        data = await getSpotifyData(access_token as string, "long_term");
      } catch (error: any) {
        res.send({ message: "Error al renovar el token de acceso" });
        return;
      }
    }
    if (!data.error && data.total! < record.dataValues.minItems) {
      res.status(400).send({
        message: `Para generar un banner '${record.dataValues.name}' se necesitan al menos ${record.dataValues.minItems} artistas y tú sólo tienes ${data.total}`,
      });
      return;
    }
    if (data.error) {
      console.error(data);
      if (data.error.status === 403) {
        res.status(400).send({
          message:
            "No pudimos obtener permisos necesarios para crear el banner",
        });
        return;
      }
      res.status(400).send({ message: "Error al contactar la API De Spotify" });
      return;
    }
    const { width, height } = record.dataValues;
    const img = await executeBanner(
      record.dataValues.script,
      { width, height },
      [],
      data.items!,
      /// @ts-ignore
      record.fonts.map((font) => font.dataValues)
    );
    if (!img) {
      res.status(400).send({
        message:
          "No fue posible crear el banner solcitado, ¿probablemente no existe?",
      });
      return;
    }
    if (process.env.NODE_ENV === "production") {
      let t: Transaction = await sequelize.transaction();
      try {
        await GeneratedBanner.create(
          { idUsuario: session?.user.id, fecha_generado: new Date() },
          { transaction: t }
        );
        await t.commit();
        res.send(img);
      } catch (error: any) {
        logError(error);
        await t.rollback();
        if (error.isBanner) {
          res.status(400).send({ message: error.message });
          return;
        }
        res.status(400).send({ message: "Error" });
      }
      return;
    }
    res.send(img);
  } catch (error: any) {
    logError(error);
    res.status(500).send({ message: "Error interno" });
  }
}
