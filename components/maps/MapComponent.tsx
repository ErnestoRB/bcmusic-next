import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import polyline from "@mapbox/polyline";
import { useEffect, useState } from "react";
import { LatLng, LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

export interface MapProps {
  routeGeometry: string;
}

export default function MapComponent({ routeGeometry }: MapProps) {
  const [render, setRender] = useState(false);

  const [loc, setLoc] = useState<LatLngExpression>();

  const routePoints = polyline.decode(routeGeometry);

  useEffect(() => {
    if (!navigator.geolocation) {
      setRender(false);
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLoc([position.coords.latitude, position.coords.longitude]);
          setRender(true);
        },
        () => {}
      );
    }
  }, []);

  return (
    <>
      {render && (
        <MapContainer center={loc} zoom={13} className="w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Polyline positions={routePoints} color="blue" />
          <Marker position={loc!}>
            <Popup>Te encuentras aqui</Popup>
          </Marker>
        </MapContainer>
      )}
    </>
  );
}
