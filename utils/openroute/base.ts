import { ORS_APIKEY } from "../environment";

interface BaseORSRequest {
  path: string;
  method: Request["method"];
  query?: Record<string, string>;
  body?: RequestInit["body"];
  headers?: Record<string, string>;
}

export type LatLngCoords = [number, number];

const APIKEY = ORS_APIKEY ?? "";

export async function orsReq({
  path,
  method = "get",
  body,
  headers = {},
  query: parameters,
}: BaseORSRequest) {
  const params = {
    ...parameters,
  };

  const hdrs = new Headers({ ...headers });
  if (method.toLowerCase() == "post") {
    hdrs.append("Authorization", APIKEY);
  }
  if (method.toLowerCase() == "get") {
    params.api_key = APIKEY;
  }

  return await fetch(
    `https://api.openrouteservice.org/${path}?${new URLSearchParams(params)}`,
    { method, body, headers: hdrs }
  );
}
