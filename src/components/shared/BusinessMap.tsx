//if I need it
'use client';
import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
//, Popup
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

import L from 'leaflet';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/icons/leaflet/marker-icon-2x.png',
  iconUrl: '/icons/leaflet/marker-icon.png',
  shadowUrl: '/icons/leaflet/marker-shadow.png',
});

type BusinessMapProps = {
  //   location: {
  //     latitude: number;
  //     longitude: number;
  // };
  lat: number;
  lng: number;
  draggable?: boolean;
  onDragEnd?: (lat: number, lng: number) => void;
  className?: string;
  height?: number | string;
  isForm?: boolean; // <-- flag
};
function BusinessMap({
  lat,
  lng,
  draggable = false,
  onDragEnd,
  className,
  height = 320,
}: // isForm = false,
BusinessMapProps) {
  const [pos, setPos] = useState<[number, number]>([lat, lng]);
  useEffect(() => {
    setPos([lat, lng]);
  }, [lat, lng]);
  return (
    <div className={className} style={{ height }}>
      <MapContainer
        center={pos}
        zoom={16}
        scrollWheelZoom={false}
        // className={` ${
        //   isForm ? `rounded-lg w-full h-[${height}px]` : `w-2/3 h-80`
        // }`}
        // , borderRadius: 16
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker
          position={pos}
          draggable={draggable}
          eventHandlers={
            draggable
              ? {
                  dragend: (e) => {
                    const ll = (e.target as L.Marker).getLatLng();
                    setPos([ll.lat, ll.lng]);
                    onDragEnd?.(ll.lat, ll.lng);
                  },
                }
              : undefined
          }
        />
        {/* <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup> */}
        {/* </Marker> */}
      </MapContainer>
    </div>
  );
}

export default BusinessMap;
