import { NextApiRequest, NextApiResponse } from "next";
import { sequelize } from "../../utils/database/connection";
import { ResponseData } from "../../types/definitions";
import { IS_DEVELOPMENT } from "../../utils/environment";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData<undefined>>
) {
  if (IS_DEVELOPMENT) {
    await sequelize.sync();
  }
  return res.status(200);
}
