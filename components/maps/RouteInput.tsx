import React, { useEffect, useState } from "react";
import AutoComplete from "../AutoComplete";
import { LatLngTuple } from "leaflet";
import { toast } from "react-toastify";

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
  const [items, setItems] = useState<IRoute[]>([]);
  const [selected, setSelected] = useState<IRoute | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  // Estado y funciones para el destino
  const [coordinates, setCoordinates] = useState<[number, number] | undefined>(
    undefined
  );

  const handleGeocode = async (
    search: string,
    radius: number = 1000
  ): Promise<void> => {
    if (isLoading) return;
    try {
      let geocodeUrl = `/api/maps/geocode?search=${search}`;
      if (userLocation) {
        const [latitude, longitude] = userLocation;
        geocodeUrl += `&lat=${latitude}&lng=${longitude}&radius=${radius}`;
      }
      setLoading(true);
      const response = await fetch(geocodeUrl, { credentials: "include" });
      if (response.ok) {
        const result = await response.json();
        // Mapear los resultados a un formato IRoute
        const newItems: IRoute[] =
          result.features?.map((feature: any) => ({
            label: feature.properties.name,
            coordinates: feature.geometry.coordinates,
            region: feature.properties.region,
            country_a: feature.properties.country_a,
          })) ?? [];

        // Actualizar los items
        setItems(newItems);
      } else {
        toast.error("No se pudo contactar con la API de geocodificacion");
        setError(true);
      }
    } catch (error) {
      toast.error("No se pudo contactar con la API de geocodificacion");
      setError(true);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <>
      <AutoComplete<IRoute>
        id={`${label.toLowerCase()}-autocomplete`}
        items={items}
        label={label}
        disabled={error}
        loading={isLoading}
        onChange={(e, v) => {
          setSelected(v);
        }}
        onInputChange={(e) => {
          const inputValue = (e.target as HTMLInputElement).value;
          if (!inputValue) {
            return;
          }
          handleGeocode(inputValue);
        }}
      ></AutoComplete>
    </>
  );
}
