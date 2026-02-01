'use client';
import React, { useState } from 'react';

import { UKRAINE_REGIONAL_CENTERS } from '@/const/regions';

import CityIcon from '@/assets/icons/filters/icon-locatio.svg';
import CrossIcon from '@/assets/icons/general/icon-16-cross.svg';
import CheckIcon from '@/assets/icons/general/icon-check.svg';

import { SheetClose } from '@/components/ui/sheet';
import { useFilters } from '@/hooks/useFilters';

type CityFilterProps = {
  onApply: () => void;
};

function CityFilter({ onApply }: CityFilterProps) {
  const { filters, updateFilter } = useFilters();
  const [tempCity, setTempCity] = useState<string>(filters.city);

  return (
    <div className="flex flex-col gap-3 p-5">
      <div className="flex items-center gap-3 pb-2">
        <CityIcon className="h-5 w-5" aria-hidden="true" />
        <h2 className="placeholder-sm font-medium">Оберіть місто</h2>
      </div>

      <div className="grid grid-cols-2 gap-x-5">
        {UKRAINE_REGIONAL_CENTERS.map((c) => (
          <button
            type="button"
            key={c.value}
            onClick={() => setTempCity(c.value)}
            className={`placeholder-xs rounded p-2 text-left ${
              tempCity === c.value
                ? 'bg-elements-main-500/30 font-medium underline'
                : 'font-normal'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="flex justify-center gap-4">
        <button
          type="button"
          onClick={() => setTempCity('__all__')}
          // className="placeholder-xs w-30 border-background-main-400 flex h-8 cursor-pointer items-center justify-center gap-1 border p-2"
          className="btn-reject"
        >
          <CrossIcon
            className="size-3 lg:size-4 xl:size-5"
            aria-hidden="true"
          />
          <span>Скасувати</span>
        </button>
        <SheetClose
          onClick={() => {
            onApply(); // close Sheet
            updateFilter('city', tempCity);
          }}
          //className="placeholder-sm bg-background-main-300 w-30 border-background-main-300 flex h-8 cursor-pointer items-center justify-center gap-1 border p-2 shadow-[1px_2px_10px_2px_var(--elements-grey-50)]"
          className="btn-aprove"
        >
          <CheckIcon
            className="size-3 lg:size-4 xl:size-5"
            aria-hidden="true"
          />
          <span>Застосувати</span>
        </SheetClose>
      </div>
    </div>
  );
}

export default CityFilter;
