import { NextApiRequest, NextApiResponse } from "next";
import { ResponseData } from "../../types/definitions";
import { unstable_getServerSession } from "next-auth";
import { sessionRequired } from "../../utils/authorization/validation/user/browser";
import { havePermission } from "../../utils/authorization/querys";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData<undefined>>
) {
  const session = await unstable_getServerSession(
    req,
    res,
    authOptions(req, res)
  );
  if (sessionRequired(session, res)) {
    return;
  }
  const user = session!.user;
  const permission = await havePermission(user.id, "hola");

  res.send({ message: "Tiene permiso? " + permission });
}
