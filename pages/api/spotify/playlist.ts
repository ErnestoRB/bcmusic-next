import type { NextApiRequest, NextApiResponse } from "next";
import { EmptyResponse, ResponseData } from "../../../types/definitions";
import { refreshToken } from "../../../utils/spotify";
import logError from "../../../utils/log";
import {
  addItemsToPlaylist,
  getPlaylistTracks,
  getProfile,
  getRecommendations,
  getTopTracks,
  makePlaylist,
} from "../../../utils";
import Joi from "joi";
import { validate } from "../../../utils/middleware/validation";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { Account, User } from "../../../utils/database/models";
import { Route } from "../../../utils/database/models/Route";
import {
  Playlist,
  StoredPlaylist,
} from "../../../utils/database/models/Playlist";
import { Song } from "../../../utils/database/models/Song";

export default validate(
  {
    body: Joi.object({
      routeId: Joi.number().required(),
    }).required(),
  },
  async (
    req: NextApiRequest,
    res: NextApiResponse<ResponseData<StoredPlaylist> | EmptyResponse>
  ) => {
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
      const user = await User.findByPk(session.user.id);
      if (!user) {
        res.status(401).json({ message: "No encontramos tu cuenta!" });
        return;
      }
      const spotifyAccount = await Account.findOne({
        attributes: ["id", "refresh_token", "access_token"],
        where: {
          userId: session?.user.id,
          provider: "spotify",
        },
      });
      if (!spotifyAccount) {
        res.status(400).json({
          message: "Usuario no tiene vinculada ninguna cuenta de spotify!",
        });
        return;
      }
      let { access_token, refresh_token } = spotifyAccount.dataValues;
      const { routeId } = req.body;
      const route = await Route.findByPk(routeId);
      if (!route) {
        return res.status(400).send({
          message: "Ruta no existe!",
        });
      }

      let data = await getTopTracks(access_token as string, "long_term");
      if (data.error) {
        if (data.error.status == 401) {
          try {
            const refreshResult = await refreshToken(refresh_token!);
            if (refreshResult.error) {
              return res.status(403).send({
                message: "No pudimos renovar tu token",
              });
            }
            access_token = refreshResult.access_token;
            spotifyAccount.set({ access_token: refreshResult.access_token });
            await spotifyAccount.save();
            data = await getTopTracks(access_token, "long_term");
            if (data.total == 0) {
              res.status(400).send({
                message:
                  "No pudimos obtener suficientes recomendaciones. ¿Usas tu cuenta regularmente?",
              });
              return;
            }
            if (data.error) {
              res.status(400).send({
                message:
                  "Hubo un problema con el token, vuelve a intentarlo más tarde",
              });
              return;
            }
          } catch (error: any) {
            res
              .status(400)
              .send({ message: "Error al renovar el token de acceso" });
            return;
          }
        } else if (data.error.status === 403) {
          res.status(400).send({
            message:
              "No pudimos obtener permisos necesarios para generar la playlist",
          });
          return;
        } else {
          console.log({ data });

          if (data.total == 0) {
            res.status(400).send({
              message:
                "No pudimos obtener suficientes recomendaciones. ¿Usas tu cuenta regularmente?",
            });
            return;
          }
          res
            .status(400)
            .send({ message: "Error al contactar la API De Spotify" });
          return;
        }
      }

      const seedForRecommendations = data?.items?.map(({ id }) => id) || [];
      const duration = route.dataValues.duration * 1000; //Tiempo en ms
      const tracksURI: string[] = [];
      let totalLength = 0;

      while (totalLength < duration) {
        let newData = await getRecommendations(
          access_token!,
          seedForRecommendations
        );
        if (newData.error) {
          console.error(data);
          if (newData.error.status === 403) {
            res.status(400).send({
              message:
                "No pudimos obtener permisos necesarios para generar la playlist",
            });
            return;
          }
          res
            .status(400)
            .send({ message: "Error al contactar la API De Spotify" });
          return;
        }
        newData.tracks?.forEach((track) => {
          console.log(
            `Duracion actual: ${totalLength}, Track URI: ${track.uri}`
          );
          tracksURI.push(track.uri);
          totalLength += track.duration_ms;
        });
      }
      console.log(tracksURI);

      let userInfo = await getProfile(access_token as string);
      if (userInfo.error) {
        console.error(data);
        if (userInfo.error.status === 403) {
          res.status(400).send({
            message:
              "No pudimos obtener permisos necesarios para generar la playlist",
          });
          return;
        }
        res
          .status(400)
          .send({ message: "Error al contactar la API De Spotify" });
        return;
      }
      console.log(userInfo.id);
      const userID = userInfo.id;
      const playlistName = "Musica de fondo para tu viaje de hoy";

      let playlist = await makePlaylist(
        access_token as string,
        userID as string,
        playlistName
      );
      if (playlist.error) {
        console.error(data);
        if (playlist.error.status === 403) {
          res.status(400).send({
            message:
              "No pudimos obtener permisos necesarios para generar la playlist",
          });
          return;
        }
        res
          .status(400)
          .send({ message: "Error al contactar la API De Spotify" });
        return;
      }
      const playlistID = playlist.id;
      console.log(playlistID);
      console.log(playlist.external_urls?.spotify);

      const storedPlaylist = await Playlist.create({
        name: playlistName,
        uri: playlist.uri,
        url: playlist.external_urls?.spotify,
        userId: session.user.id,
        routeId,
      });

      let addItems = await addItemsToPlaylist(
        access_token as string,
        playlistID as string,
        tracksURI
      );
      if (addItems.error) {
        console.error(data);
        if (addItems.error.status === 403) {
          res.status(400).send({
            message:
              "No pudimos obtener permisos necesarios para generar la playlist",
          });
          return;
        }
        res
          .status(400)
          .send({ message: "Error al contactar la API De Spotify" });
        return;
      }

      let getAddedTracks = await getPlaylistTracks(
        access_token as string,
        playlistID as string
      );
      if (getAddedTracks.error) {
        console.error(data);
        if (getAddedTracks.error.status === 403) {
          res.status(400).send({
            message:
              "No pudimos obtener permisos necesarios para generar la playlist",
          });
          return;
        }
        res
          .status(400)
          .send({ message: "Error al contactar la API De Spotify" });
        return;
      }

      const addedSongs = await Song.bulkCreate(
        getAddedTracks.items!.map((item) => {
          return {
            artist: item.track.artists[0].name,
            name: item.track.name,
            url: item.track.external_urls.spotify,
            playlistId: storedPlaylist.dataValues.id!,
          };
        })
      );

      res.json({
        message: "Playlist generada",
        data: storedPlaylist.dataValues,
      });
    } catch (error: any) {
      logError(error);
      res.status(500).send({ message: "Error al guardar el token" });
    }
  }
);
