import { LatLngCoords, orsReq } from "./base";

export type TripProfile = "foot-walking" | "driving-car" | "cycling-regular";

export interface RouteArgs {
  profile: TripProfile;
  coords: LatLngCoords[];
}

export async function generateRoute({ profile, coords }: RouteArgs) {
  const headers = { "Content-Type": "application/json" };
  const body = JSON.stringify({ coordinates: coords });
  return await orsReq({
    headers,
    path: `v2/directions/${profile}`,
    method: "post",
    body,
  }).then((res) => res.json());
}
