'use client';
import React, { useState } from 'react';
import CityIcon from '@/assets/icons/filters/icon-locatio.svg';
import { UKRAINE_REGIONAL_CENTERS } from '@/const/regions';
import CrossIcon from '@/assets/icons/general/icon-16-cross.svg';
import CheckIcon from '@/assets/icons/general/icon-check.svg';

type CityFilterProps = {
  city: string | undefined;
  setCity: (city: string) => void;
};

function CityFilter({ city, setCity }: CityFilterProps) {
  const [tempCity, setTempCity] = useState<string>(city || '__all__');
  return (
    <div className="flex flex-col gap-4 p-5">
      <div className="flex items-center gap-3 py-1.5">
        <CityIcon className="h-5 w-5" />
        <h2 className="placeholder-sm font-medium">Оберіть місто</h2>
      </div>

      <div className="grid grid-cols-2 gap-x-5 py-2">
        {UKRAINE_REGIONAL_CENTERS.map((c) => (
          <button
            key={c.value}
            onClick={() => setTempCity(c.value)}
            className={`placeholder-xs rounded py-1 text-left ${
              city === c.value ? 'font-medium' : 'font-normal'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => setTempCity('__all__')}
          className="placeholder-xs w-30 border-background-main-400 flex h-8 items-center justify-center gap-1 border p-2"
        >
          <CrossIcon className="h-3 w-3" />
          <span>Скасувати</span>
        </button>
        <button
          onClick={() => setCity(tempCity)}
          className="placeholder-xs bg-background-main-300 w-30 border-background-main-300 flex h-8 items-center justify-center gap-1 border p-2 shadow-[1px_2px_10px_2px_var(--elements-grey-50)]"
        >
          <CheckIcon className="h-4 w-4" /> <span>Застосувати</span>
        </button>
      </div>
    </div>
  );
}

export default CityFilter;
