import type { NextApiRequest, NextApiResponse } from "next";
import { availableSpotifyTimeRanges, getSpotifyData } from "../../../utils";
import { createBannerBuffer } from "../../../utils/banners/synthwave";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { refreshToken } from "../../../utils/spotify";
import { Account, Banner } from "../../../utils/database/models";
import { ResponseData } from "../../../types/definitions";
import { sequelize } from "../../../utils/database/connection";
import { Op, Transaction } from "sequelize";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | Buffer>
) {
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
    const banner = await Banner.findOne({
      where: sequelize.where(
        sequelize.fn(
          "TIMESTAMPDIFF",
          sequelize.literal("MINUTE"),
          sequelize.col("fecha_generado"),
          sequelize.fn("NOW")
        ),
        Op.lte,
        60
      ),
    });
    if (banner) {
      res
        .status(400)
        .send({ message: "Sólo puedes crear un banner por hora. " });
      return;
    }
    const { refresh_token, access_token, id } = spotifyToken.dataValues;
    let data: any;
    for (const time of availableSpotifyTimeRanges) {
      data = await getSpotifyData(access_token as string, time);
      if (data.error || (!data.error && data.total > 0)) {
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
          if (data.error || (!data.error && data.total > 0)) {
            break;
          }
        }
      } catch (error: any) {
        res.send({ message: "Error al renovar el token de acceso" });
        return;
      }
    }
    if (data.error) {
      console.error(data);
      res.status(400).send({ message: "Error al contactar la API De Spotify" });
      return;
    }
    let t: Transaction = await sequelize.transaction();
    try {
      const img = await createBannerBuffer(data.items);
      const banner = await Banner.create(
        { idUsuario: session?.user.id, fecha_generado: new Date() },
        { transaction: t }
      );
      const imgId = banner.dataValues.id;
      //await fs.writeFile("./public/" + imgId, img);
      await t.commit();
      res.send(img);
      //res.send({ message: "Banner creado" });
    } catch (err: any) {
      await t.rollback();
      res.status(400).send({ message: "Error" });
    }
  } catch (err) {
    res.status(500).send({ message: "Error interno" });
  }
}
