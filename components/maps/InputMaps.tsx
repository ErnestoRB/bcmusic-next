// InputMaps.tsx
import { useEffect, useState, useRef } from "react";
import { ComboboxDemo } from "../ui/comboBox";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

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
  const [endResults, setEndResults] = useState<any[]>([]);
  const [endSearch, setEndSearch] = useState<string>("");
  const [end, setEnd] = useState<[number, number] | undefined>(undefined);
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace("/");
      // The user is not authenticated, handle it here.
    },
  });

  const startComboBoxRef = useRef(null);
  const endComboBoxRef = useRef(null);

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
      console.log(search);
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

  const handleStartInputChange = (
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setValue(value);
  };

  const handleEndInputChange = (
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setValue(value);
  };

  useEffect(() => {
    if (start && end) {
      onGenerateRoute({ startCoords: start, destinationCoords: end });
    }
  }, [start, end, onGenerateRoute]);

  return (
    <div className="m-10">
      <ComboboxDemo
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
        handleInputChange={(value: string) => {
          setStartSearch(value);
          handleStartInputChange(value, setStartSearch);
        }}
        ref={startComboBoxRef}
      />
      {start && (
        <div>
          Coordenadas de la Dirección 1: {start[0]}, {start[1]}
        </div>
      )}
      <ComboboxDemo
        items={endResults}
        value={endSearch}
        onChange={(v: any) => {
          setEndSearch(v);
          handleGeocode(v).then(setEndResults);
        }}
        onSelect={(i: any) => {
          setEnd(i.geometry?.coordinates);
          setEndSearch(i.properties.name);
        }}
        handleInputChange={(value: string) => {
          setEndSearch(value);
          handleEndInputChange(value, setEndSearch);
        }}
        ref={endComboBoxRef}
      />
      {end && (
        <div>
          Coordenadas de la Dirección 2: {end[0]}, {end[1]}
        </div>
      )}
    </div>
  );
}
