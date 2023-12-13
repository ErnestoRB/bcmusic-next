import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { ResponseData } from "../../../../types/definitions";
import logError from "../../../../utils/log";
import Joi from "joi";
import { LatLngCoords } from "../../../../utils/openroute/base";
import { TripProfile, generateRoute } from "../../../../utils/openroute/route";
import { join } from "path";
import { ROUTES_PATH } from "../../../../utils/paths";
import { mkdir, writeFile } from "fs/promises";
import { validate } from "../../../../utils/middleware/validation";

interface RouteRequest {
  coordinates: LatLngCoords[];
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
    res: NextApiResponse<ResponseData<any>>
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
      const { coordinates: coords } = req.body;
      const profile = await validateProfile.validateAsync(req.query.profile, {
        allowUnknown: true,
      });

      const result = await generateRoute({
        coords,
        profile: profile as TripProfile,
      });
      try {
        const folder = join(ROUTES_PATH, session?.user.id ?? "anonymous");
        await mkdir(folder, { recursive: true });
        await writeFile(
          join(folder, `${Date.now()}.json`),
          JSON.stringify(result)
        );
      } catch (error: any) {
        logError("No se pudo guardar la ruta");
      }
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
);
