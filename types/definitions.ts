import { IBanner } from "../utils/database/models/Banner";
import { IFontType } from "../utils/database/models/Fonts";

declare global {
  interface Window {
    grecaptcha: any;
  }
}

export type BannerRecordWithFonts = IBanner & {
  fonts: IFontType[];
};

export type BannerRecordWithAuthors = IBanner & {
  authors: string[];
};

export interface SpotifyErrorResponse {
  error?: {
    status: number;
    message: string;
  };
}

export interface SpotifyData extends SpotifyErrorResponse {
  error_description?: string;
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export interface SpotifyTopArtistData extends SpotifyErrorResponse {
  items?: SpotifyArtist[];
  total?: number;
}

export interface SpotifyArtist {
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
}

export interface PaisFields {
  ID: string;
  Nombre: string;
  Nombre_Corto: string;
}

export interface SignUpInput {
  Email: string;
  Apellido: string;
  Nombre: string;
  Contraseña: string;
  Nacimiento: Date;
  Pais: number;
  token: string;
}

export interface Usuario {
  ID: string;
  Nombre: string;
  Apellido: string;
  Usuario: string;
  Contraseña?: string;
  Nacimiento: Date;
  Pais: string;
}

export type ResponseData<T> = {
  message: string;
  data?: T;
};

export type EmptyResponse = ResponseData<undefined>;
