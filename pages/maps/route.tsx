import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import RouteInput from "../../components/maps/RouteInput";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spotify } from "react-spotify-embed";
import Feedback from "../../components/FeedBack";
import { IGeneratedRoute } from "../api/maps/route/[profile]";
import { StoredPlaylist } from "../../utils/database/models/Playlist";
import { Button } from "../../components/Button";
import { formatDuration } from "../../utils/format";
import { useGeolocation } from "../../utils/hooks/useGeoLocation";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import Head from "next/head";
import { Spinner } from "../../components/Spinner";

export default function Route() {
  const Map = useMemo(
    () =>
      dynamic(() => import("../../components/maps/MapComponent"), {
        loading: () => {
          return (
            <div className="grid place-items-center text-white">
              <Spinner></Spinner>
              Cargando..
            </div>
          );
        },
        ssr: false,
      }),
    []
  );

  const geoLocation = useGeolocation();

  const [startCoords, setStartCoords] = useState<number[] | undefined>(
    undefined
  );
  const [destinationCoords, setDestinationCoords] = useState<
    number[] | undefined
  >(undefined);
  const [route, setRoute] = useState<IGeneratedRoute | null>(null);

  // Loading state
  const [loading, setLoading] = useState(false);
  const [playlist, setPlaylist] = useState<StoredPlaylist | null>(null);

  // UserID state
  const [userId, setUserId] = useState<string | null>(null);

  // Error state
  const [error, setError] = useState<string | null>(null);

  const handleGenerateRoute = async () => {
    console.log("handleGenerateRoute called");
    if (loading) {
      return null; // Return null if loading or route is already set
    }
    if (route) {
      return route.id;
    }
    // Reset states
    setLoading(true);
    setError(null);

    let generatedRouteId = null;

    if (startCoords && destinationCoords) {
      try {
        const response = await fetch(`/api/maps/route/driving-car`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            coordinates: [startCoords, destinationCoords],
          }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log(result);
          const data = result.data as IGeneratedRoute;
          console.log(data);
          setUserId(result.data.userId);
          setRoute(data);
          generatedRouteId = data.id;
          // Show success notification
          toast.success("Ruta generada exitosamente!");
        } else {
          console.error("Error al llamar a la API de ruta");
          setError(
            "Hubo un error al generar la ruta. Por favor, inténtalo de nuevo."
          );

          // Show error notification
          toast.error(
            "Hubo un error al generar la ruta. Por favor, inténtalo de nuevo."
          );
        }
      } catch (error) {
        console.error("Error en la generación de ruta:", error);
        setError(
          "Hubo un error al generar la ruta. Por favor, inténtalo de nuevo."
        );

        // Show error notification
        toast.error(
          "Hubo un error al generar la ruta. Por favor, inténtalo de nuevo."
        );
      } finally {
        setLoading(false);
      }
    } else {
      console.log("Error en las coordenadas");
      setError("Por favor, selecciona un origen y un destino.");
      setLoading(false);

      // Show error notification
      toast.error("Por favor, selecciona un origen y un destino.");
    }

    return generatedRouteId;
  };

  const handlePlaylistCreation = async (generatedRouteId: number) => {
    try {
      if (loading) {
        return;
      }
      console.log(route);
      if (!generatedRouteId) {
        toast.error(
          "Ya que no se pudo generar la ruta, no se pudo crear la playlist."
        );
        return;
      }
      setLoading(true);
      toast.info("Generando playlist...");
      const response = await fetch(`/api/spotify/playlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          routeId: generatedRouteId,
        }),
      });
      if (response.ok) {
        const json = await response.json();
        setPlaylist(json.data as StoredPlaylist);
        console.log(json);
        toast.success("Playlist generada!");
      } else {
        const data = await response.json();
        toast.error("Error al generar playlist: " + data.message);
      }
    } catch (error) {
      console.error("Error en handlePlaylistCreation:", error);
      toast.error("Error al generar playlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full bg-slate-800 bg-opacity-80 backdrop-blur-md">
      <Head>
        <title>Generar playlist</title>
      </Head>
      <div className="flex flex-1 flex-col justify-center items-center p-4 md:p-8 space-y-0 md:space-y-4  order-last md:order-1">
        <div className="w-full max-w-[16rem] z-50">
          <RouteInput
            label="Origen"
            userLocation={geoLocation.userLocation}
            onGenerateRoute={(start) => {
              setStartCoords(start);
            }}
          />
        </div>
        <div className="">
          <RouteInput
            label="Destino"
            userLocation={geoLocation.userLocation}
            onGenerateRoute={(destination) => {
              setDestinationCoords(destination);
            }}
          />
        </div>
        <Button
          onPress={() =>
            handleGenerateRoute().then((generatedRouteId) => {
              if (generatedRouteId) {
                handlePlaylistCreation(generatedRouteId);
              }
            })
          }
          isDisabled={loading}
          className="bg-gray-800 text-white px-4 py-2 rounded cursor-pointer tra nsition duration-300 hover:bg-gray-500"
        >
          {loading ? "Generando Ruta..." : "Generar Ruta"}
        </Button>
        {route?.summary && (
          <div className="bg-white text-black p-2">
            <p>Distancia: {route.summary.distance} metros</p>
            <p>Duración: {formatDuration(route.summary.duration)}</p>
          </div>
        )}
        {playlist?.url && <Spotify link={playlist.url}></Spotify>}
        {playlist?.id && (
          <div className="text-white">
            <Feedback playlistId={playlist.id!} />
          </div>
        )}
      </div>
      <div className="flex justify-center items-center flex-1 order-1 md:order-last min-h-[1/2] bg-black">
        <Map
          routeGeometry={route?.geometry ?? ""}
          location={geoLocation.userLocation}
        />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(
    req,
    res,
    authOptions(req, res)
  );

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
