import { LatLngCoords, orsReq } from "./base";

export interface CoordRadius {
  lat_lang: LatLngCoords;
  radius: number;
}

export interface GeoCodeArgs {
  search: string;
  boundary?: CoordRadius;
  boundaryCountry?: string;
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
    query["boundary.circle.lon"] = boundary.lat_lang[1];
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
