"use client";
import React from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import markerIcon from "leaflet/dist/images/marker-icon.png";
// import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
// import markerShadow from "leaflet/dist/images/marker-shadow.png";

import L from "leaflet";
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "icons/leaflet/marker-icon-2x.png",
  iconUrl: "icons/leaflet/marker-icon.png",
  shadowUrl: "icons/leaflet/marker-shadow.png",
});

{
  /* <Marker position={[50.4501, 30.5234]} icon={customMarkerIcon}></Marker>;
const customMarkerIcon = L.icon({
  iconUrl: "icons/leaflet/marker-icon-2x.png",
  iconRetinaUrl: "icons/leaflet/marker-icon-2x.png",
  shadowUrl: "icons/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
}); */
}

function BusinessMap() {
  return (
    <MapContainer
      center={[50.4501, 30.5234]}
      zoom={13}
      scrollWheelZoom={false}
      className="w-2/3 h-60"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[50.4501, 30.5234]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default BusinessMap;
