import { NextApiRequest, NextApiResponse } from "next";
import { executeBanner } from "../../../utils/banners/vm";
import { BannerRecord, Fonts } from "../../../utils/database/models";
import { unstable_getServerSession } from "next-auth";
import { onlyAllowAdmins } from "../../../utils/validation/user";
import { authOptions } from "../auth/[...nextauth]";
import logError from "../../../utils/log";

const artistSample = [
  { name: "Duck Fizz", images: [] },
  { name: "Arctic Monkeys", images: [] },
  { name: "Foo Fighters", images: [] },
  { name: "Red Hot Chili Peppers", images: [] },
  { name: "Clairo", images: [] },
  { name: "The Strokes", images: [] },
];

const requestHistory: { id: string; executed: Date }[] = [];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string; data?: any }>
) {
  const session = await unstable_getServerSession(
    req,
    res,
    authOptions(req, res)
  );
  if (onlyAllowAdmins(session, res)) {
    return;
  }

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
    const { width, height, id } = record.dataValues;

    const executedRecord = requestHistory.find((value) => value.id === id);
    if (
      executedRecord &&
      executedRecord.executed.getTime() >= Date.now() - 60000
    ) {
      res.status(400).json({
        message: "Hey, calma! Ya ejecutaste ese banner hace menos de un minuto",
      });
      return;
    }
    if (!executedRecord) {
      requestHistory.push({ id, executed: new Date() });
    }

    const data = await executeBanner(
      record.dataValues.script,
      { width, height },
      [],
      artistSample,
      /// @ts-ignore
      record.dataValues.fonts.map((font) => font.dataValues)
    );

    if (!data) {
      res.status(400).send({ message: "Tu script no regresó nada!" });
      return;
    }
    res.status(200).send({
      message: "Script ejecutado correctamente",
      data: (data as Buffer).toString("base64"),
    });
  } catch (error: any) {
    if (error.isJoi) {
      res.status(400).send({
        message:
          "El script no regresó un tipo válido! (función/promesa/buffer)",
      });
      return;
    }
    logError("Error al ejecutar banner!");
    logError(error);
    res.status(500).send({ message: `¡Ocurrió un error en tu script!` });
  }
}
