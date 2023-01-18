export const availableSpotifyTimeRanges = [
  "medium_term",
  "short_term",
  "long_term",
] as const;

export const getSpotifyData = async (
  Token: string,
  time: "medium_term" | "short_term" | "long_term"
) => {
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

export class BannerError extends Error {
  isBanner = true;
}
