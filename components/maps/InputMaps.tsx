// InputMaps.tsx
import { useEffect, useState, useRef } from "react";
import { MyComboBox } from "../Combobox";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ComboboxDemo } from "../ui/comboBox";

interface InputMapsProps {
  onGenerateRoute: (coords: {
    startCoords: number[];
    destinationCoords: number[];
  }) => void;
}

export default function InputMaps({ onGenerateRoute }: InputMapsProps) {
  const [userLocation, setUserLocation] = useState<number[] | null>(null);
  const [startResults, setStartResults] = useState<any[]>([]);
  const [startSearch, setStartSearch] = useState<string>("");
  const [start, setStart] = useState<[number, number] | undefined>(undefined);
  const [destinationResults, setDestinationResults] = useState<any[] | null>(
    []
  );
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace("/");
      // The user is not authenticated, handle it here.
    },
  });

  const startComboBoxRef = useRef(null);

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

  const handleGeocode = async (
    search: string,
    radius: number = 1000
  ): Promise<number[]> => {
    if (userLocation) {
      const [latitude, longitude] = userLocation;
      const response = await fetch(
        `/api/maps/geocode?search=${search}&lat=${latitude}&lng=${longitude}&radius=${radius}`,
        { credentials: "include" }
      );

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        return result.features;
      } else {
        console.error("Error al llamar a la API de geocodificación");
        return [];
      }
    } else {
      console.error("Error: No se pudo obtener la ubicación del usuario");
      return [];
    }
  };

  const handleInputChange = (
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setValue(value);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <MyComboBox
        ref={startComboBoxRef}
        label="Direccion 1"
        items={startResults}
        value={startSearch}
        onChange={(v: any) => {
          setStartSearch(v);
          handleGeocode(v).then(setStartResults);
        }}
        onSelect={(i: any) => {
          setStart(i.geometry?.coordinates);
          setStartSearch(i.properties.name);
        }}
      />
      <ComboboxDemo
        items={startResults}
        value={startSearch}
        onChange={(v: any) => {
          setStartSearch(v);
          handleGeocode(v).then(setStartResults);
        }}
        ref={startComboBoxRef}
      />
      {start && (
        <div>
          Coordenadas de la Dirección 1: {start[0]}, {start[1]}
        </div>
      )}
    </div>
  );
}
