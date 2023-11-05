/// @ts-ignore
import Openrouteservice from "openrouteservice-js";
import { ORS_APIKEY } from "../environment";
import { orsReq } from "./base";
import { LatLngCoords } from "../../pages/api/maps/route/[profile]";

const Geocode = new Openrouteservice.Geocode({ api_key: ORS_APIKEY });

export interface CoordRadius {
  lat_lang: LatLngCoords;
  radius: number;
}

export interface GeoCodeArgs {
  search: string;
  boundary?: CoordRadius;
  boundaryCountry?: string;
}

export type TripProfile = "foot-walking" | "driving-car" | "cycling-regular";

export interface RouteArgs {
  profile: TripProfile;
  coords: LatLngCoords[];
}

export interface ReverseGeoCodeArgs {
  point: CoordRadius;
  boundaryCountry?: string;
}

export async function geoCode({
  search,
  boundary,
  boundaryCountry = "MEX",
}: GeoCodeArgs) {
  const query: Record<string, any> = { text: search };
  if (boundary) {
    query["boundary.circle.lat"] = boundary.lat_lang[0];
    query["boundary.circle.lng"] = boundary.lat_lang[1];
    query["boundary.circle.radius"] = boundary.radius;
  } else {
    query["boundary.country"] = boundaryCountry;
  }

  return await orsReq({
    path: "geocode/search",
    query,
    method: "GET",
  }).then((res) => res.json());
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

export async function reverseGeoCode({
  point,
  boundaryCountry = "MEX",
}: ReverseGeoCodeArgs) {
  return await Geocode.reverseGeocode({
    point: point,
    boundary_country: [boundaryCountry],
  });
}
