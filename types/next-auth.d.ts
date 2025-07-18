import NextAuth, { DefaultSession, DefaultUser, Profile } from "next-auth";
import { Permiso, PermisoType } from "../utils/database/models";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      name?: string;
      apellido?: string;
      email: string;
      image?: string;
      nacimiento?: string;
      pais?: string;
      tipo_usuario?: string;
      permisos: string[];
    } & DefaultSession["user"];
    isLinked: boolean;
  }

  interface User extends DefaultUser {
    id: string;
    name: string;
    email: string;
    birth?: string;
    lastName?: string;
    image?: string;
    countryId?: number;
    userTypeId?: number;
  }

  interface SpotifyProfile extends Profile {
    images: { url: string }[];
  }
}
