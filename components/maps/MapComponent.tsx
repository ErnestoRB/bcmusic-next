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

export interface MapProps {
  routeGeometry: string;
  location?: LatLngExpression;
}

export default function MapComponent({ routeGeometry, location }: MapProps) {
  const routePoints = polyline.decode(routeGeometry);

  return (
    <>
      <MapContainer
        center={location ?? [21.913380555556, -102.315025]}
        zoom={13}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/*   <TileLayer
          attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png"
        /> */}
        {/*     <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          subdomains={"abcd"}
        /> */}
        {routePoints && <Polyline positions={routePoints} color="blue" />}
        {location && (
          <Marker position={location}>
            <Popup>Te encuentras aqui</Popup>
          </Marker>
        )}
      </MapContainer>
    </>
  );
}
