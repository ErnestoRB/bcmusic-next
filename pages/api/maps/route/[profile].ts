import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { ResponseData } from "../../../../types/definitions";
import logError from "../../../../utils/log";
import {
  GeoCodeArgs,
  TripProfile,
  generateRoute,
  geoCode,
} from "../../../../utils/openroute/geocode";
import Joi from "joi";

export type LatLngCoords = [number, number];

interface RouteRequest {
  coordinates: LatLngCoords[];
}

const validationSchema = Joi.object({
  coordinates: Joi.array().items(Joi.array().min(2).max(2)).min(2).required(),
  profile: Joi.string()
    .valid("foot-walking", "driving-car", "cycling-regular")
    .required(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData<undefined> | Buffer>
) {
  try {
    const session = await unstable_getServerSession(
      req,
      res,
      authOptions(req, res)
    );
    if (req.method?.toLowerCase() != "post") {
      res.status(405).json({ message: "Solo se pueden peticiones POST" });
      return;
    }
    /*  if (!session) {
      res.status(401).json({ message: "Debes iniciar sesión" });
      return;
    } */

    const { profile } = req.query;
    const { coordinates: coords } = (await validationSchema.validateAsync(
      { profile, ...req.body },
      {
        allowUnknown: true,
      }
    )) as RouteRequest;

    const result = await generateRoute({
      coords,
      profile: profile as TripProfile,
    });
    res.send(result);
  } catch (error: any) {
    if (error.isJoi) {
      res.status(400).json({
        message: error.details[0].message,
      });
      return;
    }
    logError(error);
    res.status(500).send({ message: "Error al contactar ORS" });
  }
}
