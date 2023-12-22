import { error } from "console";
import {
  SpotifyCreatedPlaylistTracks,
  SpotifyGeneratedPlaylist,
  SpotifyPlaylistSnapshotID,
  SpotifyRecommendationsData,
  SpotifyTopArtistData,
  SpotifyTopTracksData,
  SpotifyUserDataID,
} from "../types/definitions";
import { IFontType } from "./database/models/Fonts";

export const perserveStatus = async (res: Response) => ({
  ok: res.ok,
  json: await res.json(),
});

export const loadFontsAsync = (
  fonts: IFontType["dataValues"][]
): Promise<FontFace[]> => {
  return Promise.all(fonts.map(async (f) => await loadFontAsync(f.name)));
};

export const loadFontAsync = (fontName: string): Promise<FontFace> => {
  const fontFace = new FontFace(fontName, `url('/api/font/${fontName}')`);
  return fontFace.load();
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
      return await res.json();
    } catch (e) {
      return {
        error: {
          status: res.status,
          message: "",
        },
      };
    }
  }
  return await res.json();
};

export const getTopTracks = async (
  Token: string,
  time: "medium_term" | "short_term" | "long_term"
): Promise<SpotifyTopTracksData> => {
  const res = await fetch(
    "https://api.spotify.com/v1/me/top/tracks?time_range=" + time + "&limit=5", //limite a 5 para conseguir recomendaciones
    {
      headers: {
        Authorization: "Bearer " + Token,
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) {
    try {
      return await res.json();
    } catch (e) {
      return {
        error: {
          status: res.status,
          message: "",
        },
      };
    }
  }
  return await res.json();
};

export const getRecommendations = async (
  Token: string,
  seed: string[]
): Promise<SpotifyRecommendationsData> => {
  const res = await fetch(
    "https://api.spotify.com/v1/recommendations?limit=20&seed_tracks=" +
      seed.join(","),
    {
      headers: {
        Authorization: "Bearer " + Token,
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) {
    try {
      return await res.json();
    } catch (e) {
      return {
        error: {
          status: res.status,
          message: "",
        },
      };
    }
  }
  return await res.json();
};

export const getProfile = async (Token: string): Promise<SpotifyUserDataID> => {
  const res = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: "Bearer " + Token,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    try {
      return await res.json();
    } catch (e) {
      return {
        error: {
          status: res.status,
          message: "",
        },
      };
    }
  }
  return await res.json();
};

export const getPlaylistTracks = async (
  Token: string,
  id: string
): Promise<SpotifyCreatedPlaylistTracks> => {
  const res = await fetch(
    "https://api.spotify.com/v1/playlists/" + id + "/tracks",
    {
      headers: {
        Authorization: "Bearer " + Token,
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) {
    try {
      return await res.json();
    } catch (e) {
      return {
        error: {
          status: res.status,
          message: "",
        },
      };
    }
  }
  return await res.json();
};

export const makePlaylist = async (
  Token: string,
  userID: string,
  playlistName: string
): Promise<SpotifyGeneratedPlaylist> => {
  const res = await fetch(
    "https://api.spotify.com/v1/users/" + userID + "/playlists",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + Token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: playlistName,
        description: "Playlist generada por BCMusic para un viaje.",
        public: true,
      }),
    }
  );
  if (!res.ok) {
    try {
      return await res.json();
    } catch (e) {
      return {
        error: {
          status: res.status,
          message: "",
        },
      };
    }
  }
  return await res.json();
};

export const addItemsToPlaylist = async (
  Token: string,
  playlistID: string,
  tracksURI: string[]
): Promise<SpotifyPlaylistSnapshotID> => {
  const res = await fetch(
    "https://api.spotify.com/v1/playlists/" + playlistID + "/tracks",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + Token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uris: tracksURI,
        position: 0,
      }),
    }
  );
  if (!res.ok) {
    try {
      return await res.json();
    } catch (e) {
      return {
        error: {
          status: res.status,
          message: "",
        },
      };
    }
  }
  return await res.json();
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
