"use client";

import React, { useEffect, useMemo } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { BusinessWithCategoryName } from "@/types/business";
import { useMap } from "react-leaflet/hooks";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/icons/leaflet/marker-icon-2x.png",
  iconUrl: "/icons/leaflet/marker-icon.png",
  shadowUrl: "/icons/leaflet/marker-shadow.png",
});

function FitBounds({ coords }: { coords: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (!coords.length) {
      map.setView([49.0, 32.0], 6); // default center (Ukraine)
      return;
    }

    if (coords.length === 1) {
      map.setView(coords[0], 14);
    } else {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [coords, map]);

  return null;
}
type BusinessMapAllProps = {
  businesses: BusinessWithCategoryName[];
  height?: number | string;
  className?: string;
  selectedCity?: string;
};
function BusinessMapAll({
  businesses,
  height = 400,
  className,
  selectedCity = "__all__",
}: BusinessMapAllProps) {
  const coords = useMemo(
    () =>
      businesses
        .flatMap((b) => b.locations || [])
        .filter(
          (loc) =>
            loc.latitude &&
            loc.longitude &&
            (selectedCity === "__all__" || loc.city === selectedCity)
        )
        .map((loc) => [loc.latitude!, loc.longitude!] as [number, number]),
    [businesses, selectedCity]
  );

  const center: [number, number] = coords.length > 0 ? coords[0] : [49.0, 32.0];

  return (
    <div className={className} style={{ height }}>
      {coords.length > 0 ? (
        <MapContainer
          center={center as [number, number]}
          zoom={coords.length > 1 ? 6 : 14} // если несколько городов → зум пошире
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%", borderRadius: 16 }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {coords.map((pos, idx) => (
            <Marker key={idx} position={pos} />
          ))}

          <FitBounds coords={coords} />
        </MapContainer>
      ) : (
        <p className="text-gray-500 text-2xl text-center">
          Адреса не була додана
        </p>
      )}
    </div>
  );
}

export default BusinessMapAll;
