import React from 'react';
import MapIcon from '@/assets/icons/filters/icon-map.svg';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

type ShowMapProps = {
  showMap: boolean;
  setShowMap: (show: boolean) => void;
};

function ShowMap({ showMap, setShowMap }: ShowMapProps) {
  return (
    <div className="ml-auto flex items-center">
      <MapIcon className="mr-2 inline h-4 w-4" />
      <span className="placeholder-sm mr-3">Мапа</span>
      <Switch id="map-show" checked={showMap} onCheckedChange={setShowMap} />
      <Label htmlFor="map-show" className="sr-only">
        Показати мапу
      </Label>
    </div>
  );
}

export default ShowMap;
