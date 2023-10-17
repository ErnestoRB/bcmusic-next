import { NextApiRequest, NextApiResponse } from "next";
import {
  BannerRecord,
  BannerRecordModel,
  User,
} from "../../../utils/database/models";
import { ValidationError } from "joi";
import { BannerRecordValidation } from "../../../utils/authorization/validation/bannerRecords";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import logError from "../../../utils/log";
import { sequelize } from "../../../utils/database/connection";
import { apiUserHavePermission } from "../../../utils/authorization/validation/user/server";
import {
  API_BANNER_CREATE,
  API_BANNER_PATCH,
} from "../../../utils/authorization/permissions";
const createCache: { userId: string; lastCreated: Date }[] = [];
const updateCache: { userId: string; lastUpdated: Date }[] = [];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string; data?: any; id?: string }>
) {
  const transaction = await sequelize.transaction();

  try {
    const session = await unstable_getServerSession(
      req,
      res,
      authOptions(req, res)
    );

    const userId = session!.user.id;
    if (req.method?.toLowerCase() === "post") {
      if (apiUserHavePermission(session, res, API_BANNER_CREATE)) {
        return;
      }
      const { body } = req;
      const record = (await BannerRecordValidation.validateAsync(
        body
      )) as BannerRecordModel["dataValues"];
      const userRecord = await User.findByPk(userId);
      if (!userRecord) {
        res.status(400).send({
          message: `Tuvimos un problema para determinar quien eres, no fue posible crear el banner.`,
        });
        return;
      }

      const lastCreatedRecord = createCache.find(
        (record) => userId === record.userId
      );
      if (
        lastCreatedRecord &&
        lastCreatedRecord.lastCreated.getTime() >= Date.now() - 3_600_000
      ) {
        res.status(400).send({
          message: `Debes esperar 1h antes de crear otro banner!`,
        });
        return;
      }

      const recordInstance = await BannerRecord.create(record, {
        transaction,
      });
      /// @ts-ignore
      recordInstance.addAuthor(userRecord);
      transaction.commit();
      if (!lastCreatedRecord) {
        createCache.push({ userId, lastCreated: new Date() });
      }
      res.send({ message: `Record creado!`, id: recordInstance.dataValues.id });
    } else if (req.method?.toLowerCase() === "patch") {
      if (apiUserHavePermission(session, res, API_BANNER_PATCH)) {
        return;
      }
      const { body } = req;
      const record = (await BannerRecordValidation.validateAsync(
        body
      )) as BannerRecordModel["dataValues"];
      if (!record.id) {
        res.status(400).send({ message: `Incluye un ID en el cuerpo!` });
        return;
      }
      const lastEditedRecord = updateCache.find(
        (record) => userId === record.userId
      );
      if (
        lastEditedRecord &&
        lastEditedRecord.lastUpdated.getTime() >= Date.now() - 300_000
      ) {
        res.status(400).send({
          message: `Debes esperar 5m antes de editar el banner!`,
        });
        return;
      }
      const result = await BannerRecord.update(record, {
        where: { id: record.id },
        transaction,
      });
      if (result[0] >= 1) {
        transaction.commit();
        if (!lastEditedRecord) {
          updateCache.push({ userId, lastUpdated: new Date() });
        }
        res.send({ message: `Banner "${body.id}" actualizado!` });
      } else {
        transaction.rollback();
        res.status(400).send({
          message: `Record no pudo ser alterado! ¿Probablemente no hubo cambios?`,
        });
      }
      return;
    }
    res.status(400).send({ message: `Método no implementado!` });
  } catch (error: any) {
    transaction.rollback();
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
