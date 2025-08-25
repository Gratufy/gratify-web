"use client";

import React, { useEffect, useMemo } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { BusinessWithCategoryName } from "@/types/business";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/icons/leaflet/marker-icon-2x.png",
  iconUrl: "/icons/leaflet/marker-icon.png",
  shadowUrl: "/icons/leaflet/marker-shadow.png",
});

type BusinessMapAllProps = {
  businesses: BusinessWithCategoryName[];
  height?: number | string;
  className?: string;
};
function BusinessMapAll({
  businesses,
  height = 400,
  className,
}: BusinessMapAllProps) {
  // достаём все координаты (только с lat/lng)
  const coords = useMemo(
    () =>
      businesses
        .flatMap((b) => b.locations || [])
        .filter((loc) => loc.latitude && loc.longitude)
        .map((loc) => [loc.latitude!, loc.longitude!] as [number, number]),
    [businesses]
  );

  // если есть хотя бы одна точка → центр по bounds
  // иначе дефолт на центр Украины
  const center: [number, number] = coords.length > 0 ? coords[0] : [49.0, 32.0]; // Украина примерно по центру

  return (
    <div className={className} style={{ height }}>
      <MapContainer
        center={center as [number, number]}
        zoom={coords.length > 1 ? 6 : 14} // если несколько городов → зум пошире
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", borderRadius: 16 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {businesses.map((b) =>
          b.locations?.map(
            (loc, idx) =>
              loc.latitude &&
              loc.longitude && (
                <Marker
                  key={`${b.id}-${idx}`}
                  position={[loc.latitude, loc.longitude]}
                >
                  <Popup>
                    <strong>{b.name}</strong>
                    <br />
                    {loc.city} — {loc.address ?? "не додано"}
                  </Popup>
                </Marker>
              )
          )
        )}
      </MapContainer>
    </div>
  );
}

export default BusinessMapAll;
