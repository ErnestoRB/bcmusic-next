import type { NextApiRequest, NextApiResponse } from "next";
import { availableSpotifyTimeRanges, getSpotifyData } from "../../../utils";
import executeBanner, { getAvailableBanners } from "../../../utils/banners";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { refreshToken } from "../../../utils/spotify";
import { Account, Banner } from "../../../utils/database/models";
import { ResponseData } from "../../../types/definitions";
import { sequelize } from "../../../utils/database/connection";
import { Op, Transaction } from "sequelize";
import path from "path";

export const MIN_ARTISTS = 3;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | Buffer>
) {
  const { nombre = "synthwave" } = req.query;
  console.log(nombre);
  if (nombre instanceof Array) {
    res.status(400).json({ message: "Sólo especifica un valor para banner" });
    return;
  }
  const availableBanners = (await getAvailableBanners())?.map(
    (bannerConfig) => bannerConfig.fileName
  );
  console.log(availableBanners);

  if (
    !availableBanners ||
    !availableBanners.find((banner) => banner === nombre)
  ) {
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
      const banner = await Banner.findOne({
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
    let data: any;
    for (const time of availableSpotifyTimeRanges) {
      data = await getSpotifyData(access_token as string, time);
      if (data.error || (!data.error && data.total >= MIN_ARTISTS)) {
        break;
      }
    }
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
        for (const time of availableSpotifyTimeRanges) {
          data = await getSpotifyData(access_token as string, time);
          if (data.error || (!data.error && data.total >= MIN_ARTISTS)) {
            break;
          }
        }
      } catch (error: any) {
        res.send({ message: "Error al renovar el token de acceso" });
        return;
      }
    }
    if (
      !data.error &&
      data.total < MIN_ARTISTS &&
      process.env.NODE_ENV === "production"
    ) {
      res.status(400).send({
        message:
          "Para generar un banner se necesitan al menos " +
          MIN_ARTISTS +
          " artistas y tú sólo tienes " +
          data.total,
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
    const img = await executeBanner(
      nombre,
      data.items,
      session.user,
      path.join(process.cwd(), "./utils/banners")
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
        await Banner.create(
          { idUsuario: session?.user.id, fecha_generado: new Date() },
          { transaction: t }
        );
        await t.commit();
        res.send(img);
      } catch (err: any) {
        console.log(err);
        await t.rollback();
        if (err.isBanner) {
          res.status(400).send({ message: err.message });
          return;
        }
        res.status(400).send({ message: "Error" });
      }
      return;
    }
    res.send(img);
  } catch (err) {
    console.log(err);

    res.status(500).send({ message: "Error interno" });
  }
}
