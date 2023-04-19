import { NextApiRequest, NextApiResponse } from "next";
import { BannerRecord, BannerRecordType } from "../../../utils/database/models";
import { ValidationError } from "joi";
import { BannerRecordValidation } from "../../../utils/validation/bannerRecords";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { onlyAllowAdmins } from "../../../utils/validation/user";

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
    if (req.method?.toLowerCase() === "post") {
      const { body } = req.body;
      const record = (await BannerRecordValidation.validateAsync(
        body
      )) as BannerRecordType["dataValues"];
      console.log({ record });

      const recordInstance = await BannerRecord.create(record);
      res.send({ message: `Record creado!`, id: recordInstance.dataValues.id });
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
    console.log(error);

    res.status(500).send({ message: "Error interno" });
  }
}
