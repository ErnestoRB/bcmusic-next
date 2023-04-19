import { NextApiRequest, NextApiResponse } from "next";
import { BannerRecordValidation } from "../../../utils/validation/bannerRecords";
import { ValidationError } from "joi";
import { BannerRecord, BannerRecordType } from "../../../utils/database/models";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string; data?: any; id?: string }>
) {
  try {
    if (req.method?.toLowerCase() === "get") {
      const records = await BannerRecord.findAll({
        attributes: {
          exclude: ["script"],
        },
      });
      res.send({
        message: `Ok`,
        data: records.map((banner) => banner.dataValues),
      });
      return;
    }
    res.status(400).send({ message: `Metodo no implementado!` });
  } catch (error: any) {
    if (error.isJoi) {
      res
        .status(400)
        .send({ message: (error as ValidationError).details[0].message });
      return;
    }
    res.status(500).send({ message: "Error interno" });
  }
}
