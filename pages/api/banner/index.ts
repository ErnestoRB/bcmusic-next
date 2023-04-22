import { NextApiRequest, NextApiResponse } from "next";
import {
  BannerRecord,
  BannerRecordType,
  User,
} from "../../../utils/database/models";
import { ValidationError } from "joi";
import { BannerRecordValidation } from "../../../utils/validation/bannerRecords";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { onlyAllowAdmins } from "../../../utils/validation/user";
import logError from "../../../utils/log";

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
    if (onlyAllowAdmins(session, res)) {
      return;
    }
    const userId = session!.user.id;
    if (req.method?.toLowerCase() === "post") {
      const { body } = req;
      const record = (await BannerRecordValidation.validateAsync(
        body
      )) as BannerRecordType["dataValues"];
      const userRecord = await User.findByPk(userId);
      if (!userRecord) {
        res.status(400).send({
          message: `Tuvimos un problema para determinar quien eres, no fue posible crear el banner.`,
        });
        return;
      }

      const recordInstance = await BannerRecord.create(record);
      /// @ts-ignore
      recordInstance.addUser(userRecord);
      res.send({ message: `Record creado!`, id: recordInstance.dataValues.id });
    } else if (req.method?.toLowerCase() === "patch") {
      const { body } = req;
      const record = (await BannerRecordValidation.validateAsync(
        body
      )) as BannerRecordType["dataValues"];
      if (!record.id) {
        res.status(400).send({ message: `Incluye un ID en el cuerpo!` });
        return;
      }
      const result = await BannerRecord.update(record, {
        where: { id: record.id },
      });
      if (result[0] >= 1) {
        res.send({ message: `Banner "${body.id}" actualizado!` });
      } else {
        res.status(400).send({
          message: `Record no pudo ser alterado! ¿Probablemente no hubo cambios?`,
        });
      }
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
