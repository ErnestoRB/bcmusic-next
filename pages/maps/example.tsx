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

  const [routeGeometry, setRouteGeometry] = useState<string | null>(null);

  const handleGenerateRoute = async ({
    startCoords,
    destinationCoords,
  }: MapsExampleProps) => {
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
      console.log(result);
      console.log(result.routes[0].geometry);
      setRouteGeometry(result.routes[0].geometry);
    } else {
      console.error("Error al llamar a la API de ruta");
    }
  };

  return (
    <div className="flex space-x-8">
      <div className="w-1/2">
        <InputMaps
          onGenerateRoute={handleGenerateRoute}
        />
      </div>
      <div className="w-1/2">
        <Map routeGeometry={routeGeometry || ""} />
      </div>
    </div>
  );
}
