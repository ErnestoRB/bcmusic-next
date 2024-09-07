import React, { useEffect, useState } from "react";
import AutoComplete from "../AutoComplete";
import { LatLngTuple } from "leaflet";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";
import { Button } from "../Button";
import { LocationIcon } from "../icons/LocationIcon";

interface IRoute extends IRouteItems {
  id: string;
  label: string;
  coordinates: [number, number];
}
interface IRouteItems {
  region: string;
  country_a: string;
}

interface RouteInputProps {
  label: string;
  onGenerateRoute: (coords: [number, number] | undefined) => void;
  userLocation?: LatLngTuple;
}

export default function RouteInput({
  label,
  onGenerateRoute,
  userLocation,
}: RouteInputProps) {
  const [text, setText] = useState<string>();
  const [debouncedText] = useDebounce(text, 500);
  const [items, setItems] = useState<IRoute[]>([]);
  const [selected, setSelected] = useState<IRoute | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  // Estado y funciones para el destino
  const [coordinates, setCoordinates] = useState<[number, number] | undefined>(
    undefined
  );

  useEffect(() => {
    if (!debouncedText) return;
    const search = debouncedText;
    let geocodeUrl = `/api/maps/geocode?search=${search}`;
    if (userLocation) {
      const [latitude, longitude] = userLocation;
      geocodeUrl += `&lat=${latitude}&lng=${longitude}&radius=${1000}`;
    }
    const controller = new AbortController();
    const signal = controller.signal;

    setLoading(true);
    fetch(geocodeUrl, { credentials: "include", signal })
      .then(async (response) => {
        if (response.ok) {
          const result = await response.json();
          // Mapear los resultados a un formato IRoute
          const newItems: IRoute[] =
            result.features?.map((feature: any) => ({
              label: feature.properties.name,
              coordinates: feature.geometry.coordinates,
              region: feature.properties.region,
              country_a: feature.properties.country_a,
              id: feature.properties.id,
            })) ?? [];

          // Actualizar los items
          setItems(newItems);
        } else {
          toast.error("No se pudo contactar con la API de geocodificacion");
          setError(true);
        }
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          // Handle cancellation
          setLoading(false);
        } else {
          toast.error("No se pudo contactar con la API de geocodificacion");
          setError(true);
        }
      })
      .finally(() => {
        setLoading(false);
      });
    return () => {
      controller.abort();
    };
  }, [debouncedText, userLocation]);

  useEffect(() => {
    if (selected) {
      setCoordinates(selected.coordinates);
      // Llama a onGenerateRoute con las coordenadas actuales
      onGenerateRoute(selected.coordinates);
    }
  }, [selected, coordinates, setCoordinates, onGenerateRoute]);

  useEffect(() => {
    onGenerateRoute(coordinates);
  }, [coordinates, onGenerateRoute]);

  const fetchPossibleRoutes = async () => {
    if (!userLocation) {
      toast.error("No se pudo obtener la ubicación del usuario");
      return;
    }
    const [lat, lon] = userLocation;
    const controller = new AbortController();
    const signal = controller.signal;
    try {
      setLoading(true);
      const response = await fetch(
        `/api/maps/geocode/reverse?lat=${lat}&lng=${lon}`,
        {
          signal,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const json = await response.json();
        console.log(json);
        // Mapear los resultados a un formato IRoute
        const newItems: IRoute[] =
          json.features?.map((feature: any) => ({
            label: feature.properties.name,
            coordinates: feature.geometry.coordinates,
            region: feature.properties.region,
            country_a: feature.properties.country_a,
            id: feature.properties.id,
          })) ?? [];

        setItems(newItems);
        toast.success("Rutas generadas!");
      } else {
        toast.error("No se pudo generar rutas cercanas");
      }
    } catch (error) {
      console.error("Error fetching possible routes:", error);
      throw new Error("Failed to fetch possible routes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AutoComplete<IRoute>
      id={`${label.toLowerCase()}-autocomplete`}
      items={items}
      label={label}
      disabled={error}
      right={
        <Button
          onPress={() => fetchPossibleRoutes()}
          isDisabled={isLoading}
          className="w-auto h-auto bg-gray-800 text-white px-4 py-2 rounded cursor-pointer tra nsition duration-300 hover:bg-gray-500"
        >
          <LocationIcon />
        </Button>
      }
      loading={isLoading}
      onChange={(e, v) => {
        setSelected(v);
      }}
      onInputChange={(e) => {
        const inputValue = (e.target as HTMLInputElement).value;
        if (!inputValue) {
          return;
        }
        setText(inputValue);
      }}
    ></AutoComplete>
  );
}
