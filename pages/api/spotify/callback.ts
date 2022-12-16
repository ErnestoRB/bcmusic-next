import type { NextApiRequest, NextApiResponse } from "next";
import mssql from "mssql";
import {
  CLIENT_ID,
  CLIENT_SECRET,
  SPOTIFY_REDIRECT_ID,
} from "../../../utils/credentials";
import {
  getCredential,
  registerSpotifyCredentials,
  updateCredential,
} from "../../../utils/database";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const code = (req.query.code as string) || null;
  const state = (req.query.state as string) || null;

  if (state === null) {
    res.redirect(
      `/#${new URLSearchParams({ error: "state-mismatch" }).toString()}`
    );
  } else {
    const form = new URLSearchParams();
    form.append("code", code!);
    form.append("redirect_uri", SPOTIFY_REDIRECT_ID);
    form.append("grant_type", "authorization_code");
    const data = (await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${CLIENT_ID}:${CLIENT_SECRET}`
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form,
    }).then((response) => response.json())) as SpotifyData;
    if (data.error) {
      res.send(data);
      return;
    }
    const qResponse = await new mssql.Request()!
      .input("id", req.session.userID)
      .query(getCredential);
    const userHaveCredential = qResponse.recordset.length > 0;
    const { access_token, refresh_token } = data;
    let exito: boolean;
    if (userHaveCredential) {
      const response = await new mssql.Request()
        .input("id", req.session.userID)
        .input("token", access_token)
        .input("refreshToken", refresh_token)
        .query(updateCredential);

      exito = response.rowsAffected[0] > 0;
    } else {
      const response = await new mssql.Request()
        .input("id", req.session.userID)
        .input("token", access_token)
        .input("refreshToken", refresh_token)
        .query(registerSpotifyCredentials);

      exito = response.rowsAffected[0] > 0;
    }
    if (!exito) {
      res.send({ message: "Cuenta no pudo ser vínculada" });
      return;
    }
    res.send({ message: "Cuenta vínculada" });
  }
}
