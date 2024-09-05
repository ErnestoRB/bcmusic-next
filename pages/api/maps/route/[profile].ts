import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { ResponseData } from "../../../../types/definitions";
import logError from "../../../../utils/log";
import Joi from "joi";
import { LatLngCoords } from "../../../../utils/openroute/base";
import { TripProfile, generateRoute } from "../../../../utils/openroute/route";
import { validate } from "../../../../utils/middleware/validation";
import { Route } from "../../../../utils/database/models/Route";

interface RouteRequest {
  coordinates: LatLngCoords[];
}
export interface IGeneratedRoute {
  id: number;
  from: LatLngCoords;
  to: LatLngCoords;
  userId: string;
  date: string;
  geometry: string;
  summary: {
    distance: number;
    duration: number;
  };
  profile?: string;
}

const validationSchema = Joi.object({
  coordinates: Joi.array().items(Joi.array().min(2).max(2)).min(2).required(),
});

const validateProfile = Joi.string()
  .valid("foot-walking", "driving-car", "cycling-regular")
  .required();

export default validate(
  { body: validationSchema },
  async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData<IGeneratedRoute>>
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
      if (!session) {
        res.status(401).json({ message: "Debes iniciar sesión" });
        return;
      }
      const { coordinates: coords } = req.body as RouteRequest;
      const profile = await validateProfile.validateAsync(req.query.profile, {
        allowUnknown: true,
      });

      const storedRoute = await Route.findOne({
        where: {
          fromLat: coords[0][0],
          fromLng: coords[0][1],
          toLat: coords[1][0],
          toLng: coords[1][1],
          profile,
        },
      });
      if (storedRoute) {
        res.send({
          message: "Ruta generada",
          data: {
            userId: session.user.id,
            date: storedRoute.dataValues.date!.toISOString(),
            from: coords[0],
            to: coords[1],
            geometry: storedRoute.dataValues.geometry,
            summary: {
              distance: storedRoute.dataValues.distance,
              duration: storedRoute.dataValues.duration,
            },
            profile,
            id: storedRoute.dataValues.id!,
          },
        });
      }

      const result = await generateRoute({
        coords,
        profile: profile as TripProfile,
      });

      const createdRoute = await Route.create({
        userId: session.user.id,
        distance: result.routes[0].summary.distance,
        fromLat: coords[0][1],
        fromLng: coords[0][0],
        toLat: coords[1][1],
        toLng: coords[1][0],
        geometry: result.routes[0].geometry,
        duration: result.routes[0].summary.duration,
        profile: profile as string,
      });

      const generatedRoute: IGeneratedRoute = {
        userId: session.user.id,
        date: new Date().toISOString(),
        from: coords[0],
        to: coords[1],
        geometry: result.routes[0].geometry,
        summary: result.routes[0].summary,
        profile: profile as string,
        id: createdRoute.dataValues.id!,
      };

      res.send({ message: "Ruta generada", data: generatedRoute });
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
);
