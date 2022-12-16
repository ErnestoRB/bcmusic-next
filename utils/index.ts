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
  return await res.json();
};
