'use client';
import React, { useState } from 'react';

import { UKRAINE_REGIONAL_CENTERS } from '@/const/regions';

import CityIcon from '@/assets/icons/filters/icon-locatio.svg';
import CrossIcon from '@/assets/icons/general/icon-16-cross.svg';
import CheckIcon from '@/assets/icons/general/icon-check.svg';

import { SheetClose } from '@/components/ui/sheet';

type CityFilterProps = {
  city: string | undefined;
  setCity: (city: string) => void;
  onApply: () => void;
  setCityName: (label: string) => void;
};

function CityFilter({ city, setCity, onApply, setCityName }: CityFilterProps) {
  const [tempCity, setTempCity] = useState<string>(city || '__all__');

  return (
    <div className="flex flex-col gap-4 p-5">
      <div className="flex items-center gap-3 py-2">
        <CityIcon className="h-5 w-5" />
        <h2 className="placeholder-sm font-medium">Оберіть місто</h2>
      </div>

      <div className="grid grid-cols-2 gap-x-5 py-2">
        {UKRAINE_REGIONAL_CENTERS.map((c) => (
          <button
            type="button"
            key={c.value}
            onClick={() => setTempCity(c.value)}
            className={`placeholder-xs rounded py-2 text-left ${
              tempCity === c.value ? 'font-medium underline' : 'font-normal'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="mx-auto flex gap-4">
        <button
          type="button"
          onClick={() => setTempCity('__all__')}
          className="placeholder-xs w-30 border-background-main-400 flex h-8 cursor-pointer items-center justify-center gap-1 border p-2"
        >
          <CrossIcon className="h-3 w-3" />
          <span>Скасувати</span>
        </button>
        <SheetClose
          onClick={() => {
            setCity(tempCity);
            const city = UKRAINE_REGIONAL_CENTERS.find(
              (c) => c.value === tempCity
            );
            setCityName(city?.label ?? '');
            onApply(); // close Sheet
          }}
          className="placeholder-sm bg-background-main-300 w-30 border-background-main-300 flex h-8 cursor-pointer items-center justify-center gap-1 border p-2 shadow-[1px_2px_10px_2px_var(--elements-grey-50)]"
        >
          <CheckIcon className="h-4 w-4" /> <span>Застосувати</span>
        </SheetClose>
      </div>
    </div>
  );
}

export default CityFilter;
