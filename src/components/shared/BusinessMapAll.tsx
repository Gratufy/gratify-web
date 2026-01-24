'use client';

import React, { useEffect, useMemo } from 'react';
import 'leaflet/dist/leaflet.css';
//, Popup
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';

import { useMap } from 'react-leaflet/hooks';
// import { UKRAINE_REGIONAL_CENTERS } from '@/const/regions';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/icons/leaflet/marker-icon-2x.png',
  iconUrl: '/icons/leaflet/marker-icon.png',
  shadowUrl: '/icons/leaflet/marker-shadow.png',
});

function FitBounds({ coords }: { coords: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    // 👉 fix white space on map load
    // map.invalidateSize();
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

type BusinessForMap = {
  id: string;
  locations: {
    city: string;
    address?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  }[];
};
type BusinessMapAllProps = {
  businesses: BusinessForMap[];
  // height?: number | string;
  className?: string;
  selectedCity?: string;
  hoveredId?: string | null;
};

function BusinessMapAll({
  businesses,
  // height = 400,
  className,
  selectedCity = '__all__',
  hoveredId = null,
}: BusinessMapAllProps) {
  const coords = useMemo(() => {
    return businesses.flatMap((b) =>
      b.locations
        .filter((loc) => {
          if (!loc.latitude || !loc.longitude) return false;
          if (selectedCity === '__all__') return true;
          return loc.city === selectedCity; // now loc.city = value
        })
        .map((loc) => ({
          businessId: b.id,
          lat: loc.latitude!,
          lng: loc.longitude!,
        }))
    );
  }, [businesses, selectedCity]);

  const { defaultIcon, hoveredIcon } = useMemo(() => {
    return {
      defaultIcon: new L.Icon.Default(),
      hoveredIcon: new L.Icon({
        iconUrl: '/icons/leaflet/marker-icon.png',
        iconRetinaUrl: '/icons/leaflet/marker-icon-2x.png',
        shadowUrl: '/icons/leaflet/marker-shadow.png',
        iconSize: [35, 55],
        iconAnchor: [17, 55],
      }),
    };
  }, []);

  // const center: [number, number] = coords.length > 0 ? coords[0] : [49.0, 32.0];
  const center: [number, number] =
    coords.length > 0 ? [coords[0].lat, coords[0].lng] : [49.0, 32.0];

  return (
    // style={{ height }}
    <div className={'overflow-hidden ' + className}>
      {coords.length > 0 ? (
        <MapContainer
          center={center as [number, number]}
          //6:13
          zoom={coords.length > 1 ? 10 : 13} // если несколько городов → зум пошире
          scrollWheelZoom={false}
          //, borderRadius: 16
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: '#dcd5d5' /* for leaflet map */,
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {coords.map((loc, idx) => (
            <Marker
              key={idx}
              position={[loc.lat, loc.lng]}
              icon={loc.businessId === hoveredId ? hoveredIcon : defaultIcon}
            />
          ))}

          {/* <FitBounds coords={coords} /> */}
          <FitBounds
            coords={coords.map((c) => [c.lat, c.lng] as [number, number])}
          />
        </MapContainer>
      ) : (
        <div className="bg-default-photo flex h-full w-full items-center justify-center px-4">
          <p className="text-center text-xl lg:text-2xl">
            Немає доступних адрес для відображення на карті
          </p>
        </div>
      )}
    </div>
  );
}

export default BusinessMapAll;

// function FixMapResize() {
//   const map = useMap();

//   useEffect(() => {
//     setTimeout(() => {
//       map.invalidateSize();
//     }, 100);
//   }, [map]);

//   return null;
// }
