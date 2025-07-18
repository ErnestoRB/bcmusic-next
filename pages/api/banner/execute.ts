import { NextApiRequest, NextApiResponse } from "next";
import { executeBanner } from "../../../vm";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import logError from "../../../utils/log";
import { censureError } from "../../../vm/errors";
import { apiUserHavePermission } from "../../../utils/authorization/validation/permissions/server";
import { API_BANNER_EXECUTE } from "../../../utils/authorization/permissions";
import { Banner } from "../../../utils/database/models";
import { Fonts } from "../../../utils/database/models";

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
  console.log({ body: req.body });

  const artists = Array.isArray(req.body) ? req.body : artistSample;
  if (!(await apiUserHavePermission(session, res, API_BANNER_EXECUTE))) {
    return;
  }

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
    const { width, height, id } = record.dataValues;

    const executedRecord = requestHistory.find((value) => value.id === id);
    if (process.env.NODE_ENV === "production") {
      if (
        executedRecord &&
        executedRecord.executed.getTime() >= Date.now() - 60000
      ) {
        res.status(400).json({
          message:
            "Hey, calma! Ya ejecutaste ese banner hace menos de un minuto",
        });
        return;
      }
    }

    const data = await executeBanner(
      record.dataValues.script,
      { width, height },
      artists,
      /// @ts-ignore
      record.dataValues.fonts.map((font) => font.dataValues)
    );

    if (!data) {
      res.status(400).send({ message: "Tu script no regresó un Buffer!" });
      return;
    }
    if (process.env.NODE_ENV === "production" && !executedRecord) {
      requestHistory.push({ id, executed: new Date() });
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
    censureError(error);
    res
      .status(500)
      .send({ message: `¡Ocurrió un error en tu script: "${error.message}"` });
  }
}
