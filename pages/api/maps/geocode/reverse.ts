import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { ResponseData } from "../../../../types/definitions";
import logError from "../../../../utils/log";
import { GeoCodeArgs, geoCode } from "../../../../utils/openroute/geocode";
import Joi from "joi";
import { validate } from "../../../../utils/middleware/validation";
import {
  ReverseGeoCodeArgs,
  reverseGeocode,
} from "../../../../utils/openroute/geocode/reverse";

interface ReverseGeocodeRequest {
  lat: number;
  lng: number;
}

const validationSchema = Joi.object({
  lat: Joi.number().required(),
  lng: Joi.number().required(),
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
      const { lat, lng } = (await validationSchema.validateAsync(req.query, {
        allowUnknown: true,
      })) as ReverseGeocodeRequest;

      const searchObject: ReverseGeoCodeArgs = {
        point: [lat, lng],
      };

      const result = await reverseGeocode(searchObject);
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
