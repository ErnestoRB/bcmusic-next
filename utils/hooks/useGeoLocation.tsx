import { LatLngExpression, LatLngTuple } from "leaflet";
import { useEffect, useState } from "react";

export function useGeolocation() {
  const [userLocation, setUserLocation] = useState<LatLngTuple>();
  const [error, setError] = useState<GeolocationPositionError>();

  useEffect(() => {
    // Obtener la ubicación del usuario
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
      },
      (error) => {
        setError(error);
        error.code == error.POSITION_UNAVAILABLE;
        console.error("Error al obtener la ubicación:", error.message);
      }
    );
  }, []);
  return {
    userLocation,
    denied: error?.code == error?.PERMISSION_DENIED,
    unavailable: error?.code == error?.POSITION_UNAVAILABLE,
    timeout: error?.code == error?.TIMEOUT,
    loading: !userLocation && !error,
  };
}
