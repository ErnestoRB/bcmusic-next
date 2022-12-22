import SequelizeAdapter from "@next-auth/sequelize-adapter";
import { compare } from "bcrypt";
import NextAuth, { AuthOptions, Session, SpotifyProfile } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Email from "next-auth/providers/email";
import Spotify from "next-auth/providers/spotify";
import { sequelize } from "../../../utils/database/connection";
import { CLIENT_ID, CLIENT_SECRET } from "../../../utils/credentials";
import Cookies from "cookies";
import {
  User,
  Account,
  Session as SessionModel,
  VerificationToken,
  Pais,
} from "../../../utils/database/models";
import { randomBytes, randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { decode, encode } from "next-auth/jwt";

const generateSessionToken = () => {
  return randomUUID?.() ?? randomBytes(32).toString("hex");
};

export const adapter = SequelizeAdapter(sequelize, {
  // @ts-ignore
  models: { User, Account, Session: SessionModel, VerificationToken },
  synchronize: true,
});

export const authOptions: (
  req: NextApiRequest,
  res: NextApiResponse
) => AuthOptions = function (req, res) {
  return {
    pages: {
      error: "/auth/login",
      signIn: "/auth/login",
    },
    adapter,
    providers: [
      Email({
        server: {
          service: "gmail",
          auth: {
            user: process.env.GMAIL_ADDRESS,
            pass: process.env.GMAIL_PASS,
          },
        },
      }),
      Spotify({
        clientId: CLIENT_ID!,
        clientSecret: CLIENT_SECRET!,
        profile: function (profile, tokens) {
          const newProfile = { ...profile };
          console.log(newProfile);
          return newProfile;
        },
        allowDangerousEmailAccountLinking: true,
        authorization:
          "https://accounts.spotify.com/authorize?scope=user-top-read&scope=user-read-email",
      }),
      Credentials({
        // The name to display on the sign in form (e.g. "Sign in with...")
        name: "Iniciar sesión",
        // `credentials` is used to generate a form on the sign in page.
        // You can specify which fields should be submitted, by adding keys to the `credentials` object.
        // e.g. domain, username, password, 2FA token, etc.
        // You can pass any HTML attribute to the <input> tag through the object.
        credentials: {
          email: {
            label: "Email",
            type: "email",
            placeholder: "youremail@example.com",
          },
          contraseña: { label: "Contraseña", type: "password" },
        },
        async authorize(credentials, req) {
          try {
            let usuario: any = await User.findOne({
              where: { email: credentials?.email },
            });
            if (!usuario) return null;
            usuario = usuario.dataValues;
            if (!usuario.password)
              throw new Error(
                "Esta cuenta no fue registrada con una contraseña."
              );
            if (await compare(credentials!.contraseña, usuario.password)) {
              usuario.password = undefined;
              return usuario;
            }
            return null;
          } catch (err: any) {
            throw err;
          }
        },
      }),
    ],
    callbacks: {
      signIn: async function ({ account, user, credentials, email, profile }) {
        try {
          if (account?.provider === "credentials") {
            const cookies = new Cookies(req, res);
            const expires = new Date(Date.now() + 1000 * 60 * 60 * 25);
            const sessionToken = generateSessionToken();
            await adapter.createSession({
              userId: user.id,
              expires,
              sessionToken,
            });
            cookies.set("next-auth.session-token", sessionToken, {
              expires,
            });
            return true;
          }
          if (
            account?.provider === "spotify" &&
            (profile as SpotifyProfile)?.images?.length > 0
          ) {
            await User.update(
              {
                image: (profile as SpotifyProfile)?.images[0].url,
              },
              {
                where: { id: user.id },
              }
            );
            return true;
          }
          return true;
        } catch (err) {
          console.log(err);
          return false;
        }
      },
      session: async function ({ session, token, user }) {
        const otherSession: Session = {
          user: { id: user.id, email: user.email },
          expires: session.expires,
        };
        if (user.idPais) {
          const pais = await Pais.findOne({ where: { ID: user.idPais } });
          if (pais) {
            otherSession.user.pais = pais.dataValues.Nombre;
          }
        }
        const { name, nacimiento, image, apellido } = user;
        otherSession.user.name = name;
        otherSession.user.apellido = apellido;
        otherSession.user.nacimiento = nacimiento;
        otherSession.user.image = image;
        return otherSession;
      },
    },
    session: {
      strategy: "database",
    },
    jwt: {
      // Customize the JWT encode and decode functions to overwrite the default behaviour of storing the JWT token in the session cookie when using credentials providers. Instead we will store the session token reference to the session in the database.
      encode: async ({ token, secret, maxAge }) => {
        if (
          req.query.nextauth?.includes("callback") &&
          req.query.nextauth?.includes("credentials") &&
          req.method === "POST"
        ) {
          const cookies = new Cookies(req, res);
          const cookie = cookies.get("next-auth.session-token");
          if (cookie) return cookie;
          else return "";
        }
        // Revert to default behaviour when not in the credentials provider callback flow
        return encode({ token, secret, maxAge });
      },
      decode: async ({ token, secret }) => {
        if (
          req.query.nextauth?.includes("callback") &&
          req.query.nextauth?.includes("credentials") &&
          req.method === "POST"
        ) {
          return null;
        }
        // Revert to default behaviour when not in the credentials provider callback flow
        return decode({ token, secret });
      },
    },
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return await NextAuth(req, res, authOptions(req, res));
}
