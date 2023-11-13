import SequelizeAdapter from "@next-auth/sequelize-adapter";
import { compare } from "bcrypt";
import NextAuth, { AuthOptions, Session, User as IUser } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Email from "next-auth/providers/email";
import Spotify from "next-auth/providers/spotify";
import { sequelize } from "../../../utils/database/connection";
import {
  CLIENT_ID,
  CLIENT_SECRET,
  GMAIL_ADDRESS,
  GMAIL_PASS,
  IS_DEVELOPMENT,
} from "../../../utils/environment";
import Cookies from "cookies";

import { randomBytes, randomUUID } from "crypto";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { decode, encode } from "next-auth/jwt";
import { sendVerificationRequest } from "../../../utils/email";
import { validateRecaptchaToken } from "../../../utils/recaptcha";
import logError from "../../../utils/log";
import { getTypeUserPermissions } from "../../../utils/database/querys";
import { User } from "../../../utils/database/models";
import { Country } from "../../../utils/database/models";
import { UserType } from "../../../utils/database/models";
import {
  Account,
  Session as SessionModel,
  VerificationToken,
} from "../../../utils/database/models/next-auth";

const generateSessionToken = () => {
  return randomUUID?.() ?? randomBytes(32).toString("hex");
};

export const adapter = SequelizeAdapter(sequelize, {
  // @ts-ignore
  models: { User, Account, Session: SessionModel, VerificationToken },
  synchronize: true,
});

const providers: AuthOptions["providers"] = [
  Spotify({
    clientId: CLIENT_ID!,
    clientSecret: CLIENT_SECRET!,
    profile: function (profile) {
      if (IS_DEVELOPMENT) console.log(profile);
      const newProfile: IUser = {
        id: profile.id,
        image: profile.images?.[0]?.url,
        email: profile.email,
        name: profile.display_name,
      };
      return newProfile;
    },
    allowDangerousEmailAccountLinking: true,
    checks: process.env["NODE_ENV"] === "development" ? "none" : "state",
    authorization:
      "https://accounts.spotify.com/authorize?" +
      new URLSearchParams({
        scope: "user-top-read user-read-email",
      }).toString(),
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
        const gToken = (credentials as any).token;
        const gResponse = await validateRecaptchaToken(gToken);
        if (!gResponse.success || gResponse.score < 0.7) {
          throw new Error(
            "Detectamos actividad sospechosa. Por favor, trata de iniciar sesión con Spotify o a través de verificación de correo."
          );
        }
        let usuario: any = await User.findOne({
          where: { email: credentials?.email },
        });
        if (!usuario) throw new Error("Credenciales inválidas");
        usuario = usuario.dataValues;
        if (!usuario.password)
          throw new Error("Esta cuenta no fue registrada con una contraseña.");
        if (await compare(credentials!.contraseña, usuario.password)) {
          usuario.password = undefined;
          return usuario;
        }
        throw new Error("Credenciales inválidas");
      } catch (error: any) {
        throw error;
      }
    },
  }),
];

if (GMAIL_ADDRESS && GMAIL_PASS) {
  providers.unshift(
    Email({
      server: {
        service: "gmail",
        auth: {
          user: process.env.GMAIL_ADDRESS,
          pass: process.env.GMAIL_PASS,
        },
      },
      from: `BashCrashers MusicApp <${
        GMAIL_ADDRESS ?? `dev.ernestorb@gmail.com`
      }>`,
      sendVerificationRequest,
    })
  );
}

const events: AuthOptions["events"] = {
  signIn: async ({ account, user, isNewUser, profile }) => {
    console.log(
      `[LOGIN] ${isNewUser ? "[NEW]" : ""}\nProfile: ${JSON.stringify(
        profile
      )}\nAccount: ${JSON.stringify(account)}\nUser: ${JSON.stringify(user)}`
    );

    // update spotify profile image every time user signsin
    if (account?.provider === "spotify") {
      await User.update({ image: profile?.image }, { where: { id: user.id } });
    }
  },
};

export const authOptions: (
  req: NextApiRequest | GetServerSidePropsContext["req"],
  res: NextApiResponse | GetServerSidePropsContext["res"]
) => AuthOptions = function (req, res) {
  return {
    pages: {
      error: "/auth/login",
      signIn: "/auth/login",
      verifyRequest: "/auth/emailSent",
    },
    adapter,
    providers,
    events,
    callbacks: {
      signIn: async function ({ account, user, profile }) {
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
          if (account?.provider === "spotify" && !profile?.email) {
            const error = new Error(
              "Tu cuenta de Spotify no tiene un email asociado!"
            ) as Error & { isEmail: true };
            error.isEmail = true;
            throw error;
          }
          return true;
        } catch (error: any) {
          if (error.isEmail) {
            throw error;
          }
          logError(error);
          return false;
        }
      },
      session: async function ({ session, token, user }) {
        const otherSession: Session = {
          user: { id: user.id, email: user.email, permisos: [] },
          expires: session.expires,
        };
        if (user.idPais) {
          const pais = await Country.findOne({ where: { id: user.idPais } });
          if (pais) {
            otherSession.user.pais = pais.dataValues.name;
          }
        }
        if (user.tipoUsuarioId) {
          const tipo = await UserType.findByPk(user.tipoUsuarioId);
          if (tipo) {
            const permisos = await getTypeUserPermissions(
              String(user.tipoUsuarioId)
            );
            otherSession.user.tipo_usuario = tipo.dataValues.name;
            otherSession.user.permisos = permisos;
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
          "query" in req &&
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
          "query" in req &&
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
