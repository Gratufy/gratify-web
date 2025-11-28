'use client';

import React, { useState, useMemo } from 'react';
import debounce from 'lodash/debounce';
import { useFilters } from '@/hooks/useFilters';
import IconSearch from '@/assets/icons/general/icon-search.svg';

type InputSearchProps = {
  id: string;
  name: string;
};

function InputSearch({ id, name }: InputSearchProps) {
  const { filters, updateFilter } = useFilters();
  const [value, setValue] = useState(filters.search ?? '');

  const debouncedUpdate = useMemo(
    () => debounce((val: string) => updateFilter('search', val), 500),
    [updateFilter]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
    debouncedUpdate(val);
  };
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        Пошук
      </label>
      <IconSearch className="text-icons-grey-950 absolute bottom-[10px] left-2 size-3 lg:bottom-[6px] lg:left-3 lg:size-4 xl:left-4 xl:size-5" />
      <input
        name={name}
        id={id}
        value={value}
        onChange={handleChange}
        className="bg-background-white placeholder:text-text-500-grey focus:ring-ring lg:placeholder-sm xl:placeholder-base lg:w-71 placeholder-xs w-full py-2 pl-6 pr-2 focus:outline-none focus:ring-2 focus:ring-offset-2 lg:py-1 lg:pl-9 lg:pr-3 xl:pl-12 xl:pr-4"
        placeholder="Пошук"
      />
    </div>
  );
}

export default InputSearch;
