import { error } from "console";
import { SpotifyTopArtistData } from "../types/definitions";
import { FontsType } from "./database/models";

export const perserveStatus = async (res: Response) => ({
  ok: res.ok,
  json: await res.json(),
});

export const loadFontsAsync = (
  fonts: FontsType["dataValues"][]
): Promise<FontFace[]> => {
  return Promise.all(
    fonts.map((f) => {
      const fontFace = new FontFace(f.nombre, `url('/api/font/${f.nombre}')`);
      return fontFace.load();
    })
  );
};

export const availableSpotifyTimeRanges = [
  "medium_term",
  "short_term",
  "long_term",
] as const;

export const stringIsAValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
};

export const getSpotifyData = async (
  Token: string,
  time: "medium_term" | "short_term" | "long_term"
): Promise<SpotifyTopArtistData> => {
  const res = await fetch(
    "https://api.spotify.com/v1/me/top/artists?time_range=" + time,
    {
      headers: {
        Authorization: "Bearer " + Token,
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) {
    try {
      return res.json();
    } catch (e) {
      return {
        error: {
          status: res.status,
          message: "",
        },
      };
    }
  }
  return res.json();
};

export const meses = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
] as const;

export const shortDateFormat = (date: Date): string => {
  return `${date.getDate()} de ${
    meses[date.getMonth()]
  } del ${date.getFullYear()}`;
};

export class BannerError {
  isBanner = true;
  message: string;

  constructor(message?: string) {
    this.message = message ?? "";
  }
}
