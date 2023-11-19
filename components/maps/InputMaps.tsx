// InputMaps.tsx
import { useState } from "react";
import { TextField, Label, Input } from "react-aria-components";

interface InputMapsProps {
  onGenerateRoute: (coords: {
    startCoords: number[];
    destinationCoords: number[];
  }) => void;
  onGeocode: (search: string) => Promise<number[]>;
}

export default function InputMaps({ onGenerateRoute, onGeocode }: InputMapsProps) {
  const [startLocation, setStartLocation] = useState<string>("");
  const [destinationLocation, setDestinationLocation] = useState<string>("");

  const handleGenerateRoute = async () => {
    if (startLocation && destinationLocation) {
      const startCoords = await onGeocode(startLocation);
      const destinationCoords = await onGeocode(destinationLocation);

      if (startCoords && destinationCoords) {
        onGenerateRoute({
          startCoords,
          destinationCoords,
        });
      } else {
        console.error("Error al obtener las coordenadas");
      }
    } else {
      console.error("Direcciones inválidas");
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
      <TextField
        type="text"
        value={startLocation}
        onChange={(value) => handleInputChange(value, setStartLocation)}
        className="border p-2 w-full"
      >
        <Label>Ubicación de inicio</Label>
        <Input />
      </TextField>
      <TextField
        type="text"
        value={destinationLocation}
        onChange={(value) => handleInputChange(value, setDestinationLocation)}
        className="border p-2 w-full"
      >
        <Label>Ubicación de destino:</Label>
        <Input />
      </TextField>

      <button
        onClick={handleGenerateRoute}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Generar Ruta
      </button>
    </div>
  );
}
