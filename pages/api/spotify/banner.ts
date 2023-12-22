import type { NextApiRequest, NextApiResponse } from "next";
import { getSpotifyData } from "../../../utils";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { refreshToken } from "../../../utils/spotify";
import { ResponseData } from "../../../types/definitions";
import { sequelize } from "../../../utils/database/connection";
import { Op, Transaction } from "sequelize";
import { executeBanner } from "../../../vm";
import logError from "../../../utils/log";
import { Banner } from "../../../utils/database/models";
import { Fonts } from "../../../utils/database/models";
import { Account } from "../../../utils/database/models/next-auth";
import { GeneratedBanner } from "../../../utils/database/models";
import { randomUUID } from "crypto";
import { mkdir, stat, writeFile } from "fs/promises";
import path, { join } from "path";
import { BANNERS_PATH } from "../../../utils/paths";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData<undefined> | Buffer>
) {
  const { id = "synthwave" } = req.query;
  if (id instanceof Array) {
    res.status(400).json({ message: "Sólo especifica un valor para banner" });
    return;
  }
  const record = await Banner.findByPk(id, {
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
                sequelize.col("date"),
                sequelize.fn("NOW")
              ),
              Op.lte,
              10
            ),
            { idUser: session.user?.id },
          ],
        },
      });
      if (banner) {
        res
          .status(400)
          .send({ message: "Sólo puedes crear un banner cada 10 minutos." });
        return;
      }
    }
    const { refresh_token, access_token, id } = spotifyToken.dataValues;

    let data = await getSpotifyData(access_token as string, "long_term");
    if (data.error && data.error.status == 401) {
      try {
        const { access_token } = await refreshToken(refresh_token!);
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
        res
          .status(400)
          .send({ message: "Error al renovar el token de acceso" });
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
      logError(JSON.stringify(data));
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
      data.items!,
      /// @ts-ignore
      record.fonts.map((font) => font.dataValues)
    );
    if (!img) {
      res.status(400).send({
        message:
          "Este banner no regresó ningun resultado... ¿Probablemente esté en desarrollo?",
      });
      return;
    }
    const bannerUUID = randomUUID();
    try {
      const folder = join(
        BANNERS_PATH,
        session.user.id,
        `${record.dataValues.id}`
      );
      await mkdir(folder, { recursive: true });
      await writeFile(join(folder, `${bannerUUID}.png`), img);
    } catch (error: any) {
      logError("No se pudo guardar el banner");
    }
    let t: Transaction = await sequelize.transaction();
    try {
      const historyRecord = await GeneratedBanner.create(
        { id: bannerUUID, idUser: session?.user.id, date: new Date() },
        { transaction: t }
      );
      /// @ts-ignore
      historyRecord.setBanner(record);
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
      return;
    }
    res.send(img);
  } catch (error: any) {
    logError(error);
    res.status(500).send({ message: "Error al generar tu banner :(" });
  }
}
