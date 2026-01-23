'use client';

import React, { useState, useEffect } from 'react';
import { ChangeEvent } from 'react';
import IconSearch from '@/assets/icons/general/icon-search.svg';

type InputSearchProps = {
  id: string;
  name: string;
  value: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

function InputSearch({ id, name, value, onChange }: InputSearchProps) {
  const [localValue, setLocalValue] = useState(value ?? '');

  useEffect(() => {
    setLocalValue(value ?? '');
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    setLocalValue(val); // immidiately upfate local state
    onChange?.(e); //from header
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
        value={localValue}
        onChange={handleChange}
        className="active:shadow-pressed bg-icons-color-white placeholder:text-text-500-grey lg:placeholder-sm xl:placeholder-base lg:w-71 placeholder-xs hover-focus-card-dark w-full py-2 pl-6 pr-2 focus:outline-none lg:py-1 lg:pl-9 lg:pr-3 xl:pl-12 xl:pr-4"
        placeholder="Пошук"
      />
    </div>
  );
}

export default InputSearch;
