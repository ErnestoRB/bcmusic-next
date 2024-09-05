import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import polyline from "@mapbox/polyline";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { Location } from "../../types/definitions";
export interface MapProps {
  routeGeometry: string;
  location?: LatLngExpression;
  locations?: Location[];
}

export default function MapComponent({ routeGeometry, location, locations }: MapProps) {
  const routePoints = polyline.decode(routeGeometry);

  return (
    <>
      {location && (
        <MapContainer center={location} zoom={13} className="w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Polyline positions={routePoints} color="blue" />
          <Marker position={location}>
            <Popup>Te encuentras aqui</Popup>
          </Marker>
          {locations?.map((location, index) => (
            <Marker key={index} position={[location.lat, location.lon]}>
              <Popup>{location.label}</Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </>
  );
}
