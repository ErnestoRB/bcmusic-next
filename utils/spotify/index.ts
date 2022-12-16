import { CLIENT_ID, CLIENT_SECRET } from "../credentials";
import { SpotifyData } from "../definitions";

export const availableSpotifyTimeRanges = [
  "medium_term",
  "short_term",
  "long_term",
];

export const refreshToken = async (token: string) => {
  const form = new URLSearchParams();
  form.append("refresh_token", token as string);
  form.append("grant_type", "refresh_token");
  return (await fetch("https://accounts.spotify.com/api/token", {
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${CLIENT_ID}:${CLIENT_SECRET}`
      ).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
    body: form,
  }).then((res) => res.json())) as Omit<SpotifyData, "refresh_token">;
};

export const validateToken = async (token: string) => {
  return fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((json) => !json.error);
};
