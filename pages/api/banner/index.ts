import { NextApiRequest, NextApiResponse } from "next";
import { ValidationError } from "joi";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import logError from "../../../utils/log";
import { sequelize } from "../../../utils/database/connection";
import { apiUserHavePermission } from "../../../utils/authorization/validation/permissions/server";
import {
  API_BANNER_CREATE,
  API_BANNER_PATCH,
} from "../../../utils/authorization/permissions";
import { IBanner } from "../../../utils/database/models/Banner";
import { User, Banner } from "../../../utils/database/models";
import { BannerValidation } from "../../../utils/authorization/validation/joi/bannerRecords";
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
      if (!apiUserHavePermission(session, res, API_BANNER_CREATE)) {
        return;
      }
      const { body } = req;
      const record = (await BannerValidation.validateAsync(body)) as IBanner;
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

      const recordInstance = await Banner.create(record, {
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
      if (!(await apiUserHavePermission(session, res, API_BANNER_PATCH))) {
        return;
      }
      const { body } = req;
      const record = (await BannerValidation.validateAsync(body)) as IBanner;
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
      const result = await Banner.update(record, {
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
