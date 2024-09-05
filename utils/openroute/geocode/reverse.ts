import { LatLngCoords, orsReq } from "../base";

export interface CoordRadius {
  lat_lang: LatLngCoords;
  radius: number;
}

export interface ReverseGeoCodeArgs {
  point: [number, number];
  boundary?: CoordRadius;
}

export async function reverseGeocode({ point, boundary }: ReverseGeoCodeArgs) {
  const query: Record<string, any> = {};
  if (boundary) {
    query["boundary.circle.lat"] = boundary.lat_lang[0];
    query["boundary.circle.lon"] = boundary.lat_lang[1];
    query["boundary.circle.radius"] = boundary.radius;
  }
  query["point.lat"] = point[0];
  query["point.lon"] = point[1];

  return await orsReq({
    path: "geocode/reverse",
    query,
    method: "GET",
  }).then((res) => res.json());
}
