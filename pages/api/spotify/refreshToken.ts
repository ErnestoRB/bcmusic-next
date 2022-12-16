import mssql from "mssql";
import type { NextApiRequest, NextApiResponse } from "next";
import { CLIENT_ID, CLIENT_SECRET } from "../../../utils/credentials";
import { SpotifyData } from "../../../utils/definitions";
import { updateTokenCredential } from "../../../utils/database";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { token, redirect } = req.query;
  if (
    !token ||
    typeof token !== "string" ||
    !redirect ||
    typeof redirect !== "string"
  ) {
    res.send({ message: "No colocaste token o dirección de redirección" });
    return;
  }
  const form = new URLSearchParams();
  form.append("refresh_token", token as string);
  form.append("grant_type", "refresh_token");
  const data = (await fetch("https://accounts.spotify.com/api/token", {
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${CLIENT_ID}:${CLIENT_SECRET}`
      ).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
    body: form,
  }).then((res) => res.json())) as Omit<SpotifyData, "refresh_token">;
  if (data.error) {
    res.status(500).send({ message: "Error con la API de Spotify " });
    return;
  }
  const { access_token } = data;
  const response = await new mssql.Request()
    .input("id", req.session.userID)
    .input("token", access_token)
    .query(updateTokenCredential);

  const exito = response.rowsAffected[0] > 0;
  if (!exito) {
    res.status(500).send({
      message:
        "Error con la API de Spotify. No se pudieron actualizar tus credenciales",
    });
    return;
  }
  res.redirect(redirect);
}
