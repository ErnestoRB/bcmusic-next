// MapsExample.tsx
import dynamic from "next/dynamic";
import { useMemo, useEffect, useState } from "react";
import InputMaps from "../../components/maps/InputMaps";

interface MapsExampleProps {
  startCoords: number[];
  destinationCoords: number[];
}

export default function MapsExample() {
  const Map = useMemo(
    () =>
      dynamic(() => import("../../components/maps/MapComponent"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  const [userLocation, setUserLocation] = useState<number[] | null>(null);
  const [routeGeometry, setRouteGeometry] = useState<string | null>(null);

  useEffect(() => {
    // Obtener la ubicación del usuario
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
      },
      (error) => {
        console.error("Error al obtener la ubicación:", error.message);
      }
    );
  }, []);

  const handleGeocode = async (search: string, radius: number = 1000): Promise<number[]> => {
    if (userLocation) {
      const [latitude, longitude] = userLocation;
      const response = await fetch(`/api/geocode?search=${search}&lat=${latitude}&lon=${longitude}&radius=${radius}`);
      
      if (response.ok) {
        const result = await response.json();
        return result.coordinates;
      } else {
        console.error("Error al llamar a la API de geocodificación");
        return [];
      }
    } else {
      console.error("Error: No se pudo obtener la ubicación del usuario");
      return [];
    }
  };

  const handleGenerateRoute = async ({
    startCoords,
    destinationCoords,
  }: MapsExampleProps) => {
    console.log("Ubicación del usuario:", userLocation);
    console.log("Generar ruta con:", startCoords, destinationCoords);

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
      setRouteGeometry(result.routeGeometry);
    } else {
      console.error("Error al llamar a la API de ruta");
    }
  };

  return (
    <div className="flex space-x-8">
      <div className="w-1/2">
        <InputMaps
          onGenerateRoute={handleGenerateRoute}
          onGeocode={handleGeocode}
        />
      </div>
      <div className="w-1/2">
        <Map routeGeometry={routeGeometry || ""} />
      </div>
    </div>
  );
}
