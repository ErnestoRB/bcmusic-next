import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { ResponseData } from "../../../../types/definitions";
import logError from "../../../../utils/log";
import { GeoCodeArgs, geoCode } from "../../../../utils/openroute/geocode";
import Joi from "joi";
import { validate } from "../../../../utils/middleware/validation";

interface GeocodeRequest {
  search: string;
  lat?: number;
  lng?: number;
  radius?: number;
}

const validationSchema = Joi.object({
  search: Joi.string().required(),
  lat: Joi.number(),
  lng: Joi.number(),
  radius: Joi.number(),
});

export default validate(
  { query: validationSchema },
  async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData<undefined> | Buffer>
  ) {
    try {
      const session = await unstable_getServerSession(
        req,
        res,
        authOptions(req, res)
      );
      if (!session) {
        res.status(401).json({ message: "Debes iniciar sesión" });
        return;
      }
      const { lat, lng, search, radius } =
        (await validationSchema.validateAsync(req.query, {
          allowUnknown: true,
        })) as GeocodeRequest;

      const searchObject: GeoCodeArgs = {
        search,
      };

      if (lat && lng && radius) {
        searchObject.boundary = {
          lat_lang: [lat, lng],
          radius,
        };
      }

      const result = await geoCode(searchObject);
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
